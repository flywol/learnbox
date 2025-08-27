import React, { useState } from 'react';
import { useSchoolPayments } from '../hooks/useSchoolPayments';
import PaymentTabs from '../components/PaymentTabs';
import OverviewTab from '../components/overview/OverviewTab';
import TransactionsTab from '../components/transactions/TransactionsTab';
import FeesTab from '../components/fees/FeesTab';
import type { TransactionData } from '../types/payment.types';

interface PaymentClassData {
  level: string;
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  paidPercentage: number;
}

interface MonthlyData {
  month: string;
  paid: number;
  pending: number;
}

interface FeeDocument {
  id: string;
  title: string;
  classLevel: string;
  session: string;
  term: string;
  amount: number;
  feeType: string;
  fileName: string;
  uploadDate: string;
}

const SchoolPaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'fees'>('overview');
  const [showCreateFee, setShowCreateFee] = useState(false);
  
  const { data: paymentsData, isLoading, error } = useSchoolPayments();

  // Transform API data to component format
  const paymentData: PaymentClassData[] = paymentsData?.classes.map(cls => ({
    level: cls.name,
    totalRevenue: cls.totalRevenue,
    totalPaid: cls.totalPaid,
    totalPending: cls.totalPending,
    paidPercentage: cls.percentagePaid,
  })) || [];

  const monthlyData: MonthlyData[] = paymentsData?.timeline.map(item => ({
    month: item.month.substring(0, 3),
    paid: Math.round(item.paid / 1000),
    pending: Math.round(item.pending / 1000),
  })) || [];

  // Mock data for demonstration
  const transactionData: TransactionData[] = [
    {
      id: '1',
      studentName: 'Jane Doe',
      parentName: 'Jane Doe',
      classLevel: 'JSS 1',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: 'Today',
      totalAmount: 300000,
      amountPaid: 300000,
      studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=32&h=32&fit=crop&crop=face',
    },
  ];

  const feeDocuments: FeeDocument[] = [
    {
      id: '1',
      title: 'JSS1 school fees upload',
      classLevel: 'JSS 1',
      session: '2023/2024',
      term: '1st Term',
      amount: 150000,
      feeType: 'Tuition Fee',
      fileName: 'jss1_fees.pdf',
      uploadDate: '2024-01-15',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">School Payments</h1>
        <p className="text-gray-600 mt-1">Monitor and manage all school payment activities</p>
      </div>

      <PaymentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' && (
        <OverviewTab 
          paymentData={paymentData}
          monthlyData={monthlyData}
          isLoading={isLoading}
          error={error?.message}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsTab transactions={transactionData} />
      )}

      {activeTab === 'fees' && (
        <FeesTab
          feeDocuments={feeDocuments}
          showCreateFee={showCreateFee}
          onToggleCreateFee={() => setShowCreateFee(!showCreateFee)}
        />
      )}
    </div>
  );
};

export default SchoolPaymentsPage;