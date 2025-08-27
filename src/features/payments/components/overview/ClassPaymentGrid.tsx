import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PaymentClassData {
  level: string;
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  paidPercentage: number;
}

interface ClassPaymentGridProps {
  paymentData: PaymentClassData[];
  formatCurrency: (amount: number) => string;
}

export default function ClassPaymentGrid({ paymentData, formatCurrency }: ClassPaymentGridProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentData.map((classData) => {
          const chartData = [
            { name: 'Paid', value: classData.totalPaid, color: '#F97316' },
            { name: 'Pending', value: classData.totalPending, color: '#E5E7EB' },
          ];

          return (
            <div
              key={classData.level}
              className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/payments/class/${classData.level.replace(' ', '-').toLowerCase()}`)}
            >
              <h3 className="text-lg font-semibold mb-3">{classData.level}</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{formatCurrency(classData.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{formatCurrency(classData.totalPaid)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">{formatCurrency(classData.totalPending)}</span>
                  </div>
                </div>
                <div className="relative w-20 h-20">
                  {classData.totalRevenue > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                      <span className="text-xs text-gray-500">0%</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-semibold">{classData.paidPercentage}%</div>
                      <div className="text-xs text-gray-500">paid</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}