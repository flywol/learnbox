import { StudentSubject } from '../types/classroom.types';

interface SubjectCardProps {
  subject: StudentSubject;
  onClick: () => void;
}

// Helper function to convert light bg color to bold progress bar color
const getProgressBarColor = (bgColor: string): string => {
  const colorMap: Record<string, string> = {
    'bg-green-100': 'bg-green-600',
    'bg-red-100': 'bg-red-600',
    'bg-blue-100': 'bg-blue-600',
    'bg-purple-100': 'bg-purple-600',
    'bg-teal-100': 'bg-teal-600',
    'bg-lime-100': 'bg-lime-600',
    'bg-indigo-100': 'bg-indigo-600',
    'bg-orange-100': 'bg-orange-600',
    'bg-rose-100': 'bg-rose-600',
    'bg-cyan-100': 'bg-cyan-600',
    'bg-pink-100': 'bg-pink-600',
  };
  return colorMap[bgColor] || 'bg-orange-500';
};

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const progressBarColor = getProgressBarColor(subject.bgColor);

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Background Decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${subject.bgColor} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 ${subject.bgColor} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
            <span className="text-3xl filter drop-shadow-sm">{subject.icon}</span>
          </div>
          <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
             <span className="text-xs font-semibold text-gray-600">{subject.totalLessons} Lessons</span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
            {subject.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <p className="font-medium">{subject.teacher}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <div className="flex items-end justify-between text-sm mb-2">
            <span className="text-gray-500 font-medium text-xs uppercase tracking-wider">Progress</span>
            <span className="font-bold text-gray-900">
              {subject.progressPercentage}%
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`${progressBarColor} h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110 relative`}
              style={{ width: `${subject.progressPercentage}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
