interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
  iconColor?: string;
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
    <div className="border border-[#ddd] rounded-xl h-[104px] flex items-center px-4 gap-[50px]">
      <div className="bg-[#ffefe9] p-3 rounded-lg flex-shrink-0">
        <Icon className={`w-6 h-6 ${iconColor || 'text-[#fd5d26]'}`} />
      </div>
      <div className="flex flex-col items-end gap-1 flex-1">
        {loading ? (
          <>
            <div className="w-12 h-7 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-[#2b2b2b] leading-[1.4]">{value}</p>
            <p className="text-sm text-[#6b6b6b] text-right">{label}</p>
            {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
          </>
        )}
      </div>
    </div>
  );
}
