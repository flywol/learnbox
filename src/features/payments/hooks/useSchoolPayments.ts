import { useQuery } from '@tanstack/react-query';
import { paymentsApiClient, type SchoolPaymentsData } from '../api/paymentsApiClient';

export function useSchoolPayments() {
  return useQuery<SchoolPaymentsData>({
    queryKey: ['school-payments'],
    queryFn: () => paymentsApiClient.getSchoolPayments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}