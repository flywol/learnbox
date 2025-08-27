import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  paid: number;
  pending: number;
}

interface MonthlyPaymentChartProps {
  monthlyData: MonthlyData[];
}

export default function MonthlyPaymentChart({ monthlyData }: MonthlyPaymentChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Monthly Payment Overview</h2>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Total paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Total pending</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="paid" fill="#f97316" />
            <Bar dataKey="pending" fill="#d1d5db" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}