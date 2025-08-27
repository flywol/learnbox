import PaymentOverviewStats from './PaymentOverviewStats';
import MonthlyPaymentChart from './MonthlyPaymentChart';
import ClassPaymentGrid from './ClassPaymentGrid';

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

interface OverviewTabProps {
  paymentData: PaymentClassData[];
  monthlyData: MonthlyData[];
  isLoading: boolean;
  error?: string;
}

export default function OverviewTab({ 
  paymentData, 
  monthlyData, 
  isLoading, 
  error 
}: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading payment data: {error}</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
  
  // Calculate totals from paymentData
  const totals = paymentData.reduce((acc, curr) => ({
    totalRevenue: acc.totalRevenue + curr.totalRevenue,
    totalPaid: acc.totalPaid + curr.totalPaid,
    totalPending: acc.totalPending + curr.totalPending,
  }), { totalRevenue: 0, totalPaid: 0, totalPending: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-sm text-gray-600">Total revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
          <span className="text-sm text-gray-600">Total paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
          <span className="text-sm text-gray-600">Total pending</span>
        </div>
      </div>
      
      <ClassPaymentGrid paymentData={paymentData} formatCurrency={formatCurrency} />
      
      <PaymentOverviewStats 
        totalSchoolRevenue={totals.totalRevenue}
        totalPaid={totals.totalPaid}
        totalPending={totals.totalPending}
        totalStudents={100} // Mock data
        studentsPaid={75} // Mock data
        studentsPending={25} // Mock data
        formatCurrency={formatCurrency}
      />
      
      <MonthlyPaymentChart monthlyData={monthlyData} />
    </div>
  );
}