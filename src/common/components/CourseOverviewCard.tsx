import { Edit } from 'lucide-react';

interface CourseOverviewCardProps {
  description: string;
  progress?: number;
  onEdit?: () => void;
  className?: string;
  showProgress?: boolean;
}

export default function CourseOverviewCard({ 
  description, 
  progress = 0, 
  onEdit,
  className = "",
  showProgress = true
}: CourseOverviewCardProps) {
  return (
    <div 
      className={`w-1/2 rounded-xl p-6 relative bg-no-repeat border border-orange-200 min-h-[120px] ${className}`}
      style={{ 
        backgroundImage: 'url(/assets/notepad.svg)',
        backgroundPosition: 'bottom 8px right 8px',
        backgroundSize: '80px 80px',
        backgroundColor: '#fef7f0'
      }}
    >
      {/* Edit button in top right */}
      {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 hover:bg-orange-100 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
      )}
      
      <div className="pr-20 flex items-center justify-center h-full">
        <p className="text-gray-900 text-2xl font-bold text-center">
          {description}
        </p>
        
        {showProgress && (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}