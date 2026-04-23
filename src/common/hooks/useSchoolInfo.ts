import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import BaseApiClient from '@/common/api/baseApiClient';

class SchoolInfoClient extends BaseApiClient {
	async fetchByRole(role: string | null) {
		if (role === 'ADMIN')   return this.get<any>('/admin/admin-by-id');
		if (role === 'TEACHER') return this.get<any>('/teacher/profile');
		if (role === 'STUDENT') return this.get<any>('/student/profile');
		if (role === 'PARENT')  return this.get<any>('/parent/profile');
		return null;
	}

	async fetchByDomain(domain: string) {
		return this.post<any>('/school/verify-domain', { schoolDomain: domain });
	}
}
const client = new SchoolInfoClient();

function extractSchoolName(data: any, role: string | null): string {
	if (!data) return '';
	const d = data?.data ?? data;
	let school: any = null;
	if (role === 'ADMIN')   school = d?.admin?.school ?? d?.school ?? null;
	if (role === 'TEACHER') school = d?.teacher?.school ?? null;
	if (role === 'STUDENT') school = d?.student?.school ?? null;
	if (role === 'PARENT')  school = d?.parent?.school ?? null;
	return (school?.schoolName ?? '') as string;
}

function buildLogoSrc(raw: string | null | undefined): string | null {
	if (!raw) return null;
	if (raw.startsWith('data:') || raw.startsWith('http')) return raw;
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
	const schoolDomain = useAuthStore((s) => s.schoolDomain);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	// Fetch role profile for school name
	const { data: profileData } = useQuery({
		queryKey: ['school-info-profile', selectedRole],
		queryFn: () => client.fetchByRole(selectedRole),
		enabled: isAuthenticated,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
		retry: 1,
	});

	// Fetch school domain info for logo (public endpoint, works for all roles)
	const { data: domainData } = useQuery({
		queryKey: ['school-info-domain', schoolDomain],
		queryFn: () => client.fetchByDomain(schoolDomain!),
		enabled: isAuthenticated && !!schoolDomain,
		staleTime: 30 * 60 * 1000,
		gcTime: 60 * 60 * 1000,
		retry: 1,
	});

	const schoolName = extractSchoolName(profileData, selectedRole);

	// Logo comes from domain verification response: { data: { school: { schoolLogo } } }
	const domainSchool = domainData?.data?.school ?? domainData?.school ?? null;
	const schoolLogo = (domainSchool?.schoolLogo ?? null) as string | null;
	const schoolLogoSrc = buildLogoSrc(schoolLogo);
	const schoolInitial = schoolName ? schoolName.charAt(0).toUpperCase() : 'S';

	return { schoolName, schoolLogo, schoolLogoSrc, schoolInitial };
}
