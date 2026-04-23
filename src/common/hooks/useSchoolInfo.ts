import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import BaseApiClient from '@/common/api/baseApiClient';

class SchoolInfoClient extends BaseApiClient {
	async fetch(role: string | null) {
		if (role === 'ADMIN')   return this.get<any>('/admin/admin-by-id');
		if (role === 'TEACHER') return this.get<any>('/teacher/profile');
		if (role === 'STUDENT') return this.get<any>('/student/profile');
		if (role === 'PARENT')  return this.get<any>('/parent/profile');
		return null;
	}
}
const client = new SchoolInfoClient();

function extractSchool(data: any, role: string | null) {
	if (!data) return null;
	const d = data?.data ?? data;
	if (role === 'ADMIN')
		// /admin/admin-by-id → { data: { admin: { school: {...} } } }
		return d?.admin?.school ?? d?.school ?? d?.data?.school ?? null;
	if (role === 'TEACHER') return d?.teacher?.school ?? d?.data?.teacher?.school ?? null;
	if (role === 'STUDENT') return d?.student?.school ?? d?.data?.student?.school ?? null;
	if (role === 'PARENT')  return d?.parent?.school ?? d?.data?.parent?.school ?? null;
	return null;
}

// Build a usable img src from whatever the backend returns (base64 or URL).
function buildLogoSrc(raw: string | null): string | null {
	if (!raw) return null;
	if (raw.startsWith('data:') || raw.startsWith('http')) return raw;
	// Detect MIME type from the first bytes of the base64 string
	const head = raw.substring(0, 8);
	let mime = 'image/png';
	if (head.startsWith('/9j/'))  mime = 'image/jpeg';
	else if (head.startsWith('R0lG')) mime = 'image/gif';
	else if (head.startsWith('UklG')) mime = 'image/webp';
	else if (head.startsWith('PHN2') || head.startsWith('PD94')) mime = 'image/svg+xml';
	return `data:${mime};base64,${raw}`;
}

export function useSchoolInfo() {
	const selectedRole = useAuthStore((s) => s.selectedRole);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	const { data } = useQuery({
		queryKey: ['school-info', selectedRole],
		queryFn: () => client.fetch(selectedRole),
		enabled: isAuthenticated,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		retry: 2,
	});

	const school = extractSchool(data, selectedRole);
	const schoolName    = (school?.schoolName ?? '') as string;
	const schoolLogo    = (school?.schoolLogo ?? null) as string | null;
	const schoolLogoSrc = buildLogoSrc(schoolLogo);
	const schoolInitial = schoolName ? schoolName.charAt(0).toUpperCase() : 'S';

	return { schoolName, schoolLogo, schoolLogoSrc, schoolInitial };
}
