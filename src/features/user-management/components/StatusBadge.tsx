interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export default function StatusBadge({ isActive, className = "" }: StatusBadgeProps) {
  if (isActive) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}>
        Active
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
      Inactive
    </span>
  );
}