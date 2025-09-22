interface PaymentOverviewStatsProps {
  totalSchoolRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalStudents: number;
  studentsPaid: number;
  studentsPending: number;
  formatCurrency: (amount: number) => string;
}

export default function PaymentOverviewStats({
  totalSchoolRevenue,
  totalPaid,
  totalPending,
  totalStudents,
  studentsPaid,
  studentsPending,
  formatCurrency,
}: PaymentOverviewStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Payment Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">Total school revenue:</span>
          <div className="text-xl font-bold">{formatCurrency(totalSchoolRevenue)}</div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">Total students:</span>
          <div className="text-xl font-bold">{totalStudents}</div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">Total paid:</span>
          <div className="text-xl font-bold">{formatCurrency(totalPaid)}</div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">Students paid:</span>
          <div className="text-xl font-bold">{studentsPaid}</div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">Total pending:</span>
          <div className="text-xl font-bold">{formatCurrency(totalPending)}</div>
        </div>
        <div className="space-y-1">
          <span className="text-gray-600 text-sm">Students pending:</span>
          <div className="text-xl font-bold">{studentsPending}</div>
        </div>
      </div>
    </div>
  );
}