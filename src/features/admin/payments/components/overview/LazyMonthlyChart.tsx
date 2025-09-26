import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  paid: number;
  pending: number;
}

interface LazyMonthlyChartProps {
  monthlyData: MonthlyData[];
}

export default function LazyMonthlyChart({ monthlyData }: LazyMonthlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="paid" fill="#f97316" />
        <Bar dataKey="pending" fill="#d1d5db" />
      </BarChart>
    </ResponsiveContainer>
  );
}