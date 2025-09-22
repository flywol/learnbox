interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
  iconColor: string;
  loading?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  iconColor,
  loading = false,
}: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}