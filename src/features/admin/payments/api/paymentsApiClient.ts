import BaseApiClient from '@/common/api/baseApiClient';

export interface PaymentOverview {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalStudents: number;
  studentsPaid: number;
  studentsPending: number;
}

export interface PaymentClass {
  name: string;
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  percentagePaid: number;
}

export interface PaymentTimeline {
  month: string;
  paid: number;
  pending: number;
}

export interface SchoolPaymentsData {
  schoolId: string;
  session: string;
  overview: PaymentOverview;
  classes: PaymentClass[];
  timeline: PaymentTimeline[];
}

export interface SchoolPaymentsResponse {
  data: SchoolPaymentsData;
}

class PaymentsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  async getSchoolPayments(): Promise<SchoolPaymentsData> {
    const response = await this.api.get<SchoolPaymentsResponse>('/admin/payment-overview');
    return response.data.data;
  }
}

export const paymentsApiClient = new PaymentsApiClient();