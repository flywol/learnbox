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
	if (role === 'ADMIN')   return d?.school ?? d?.data?.school ?? null;
	if (role === 'TEACHER') return d?.teacher?.school ?? d?.data?.teacher?.school ?? null;
	if (role === 'STUDENT') return d?.student?.school ?? d?.data?.student?.school ?? null;
	if (role === 'PARENT')  return d?.parent?.school ?? d?.data?.parent?.school ?? null;
	return null;
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
	const schoolInitial = schoolName ? schoolName.charAt(0).toUpperCase() : 'S';

	return { schoolName, schoolLogo, schoolInitial };
}
