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
      className={`${subject.bgColor} rounded-xl p-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]`}
    >
      {/* Icon Container */}
      <div className="mb-3">
        <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
          <span className="text-2xl">{subject.icon}</span>
        </div>
      </div>

      {/* Subject Name */}
      <h3 className="font-semibold text-gray-900 text-base mb-1">{subject.name}</h3>

      {/* Teacher Name */}
      <p className="text-sm text-gray-700 mb-3">Teacher: {subject.teacher}</p>

      {/* Progress Info Row */}
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-700">
          Lesson {subject.currentLesson}/{subject.totalLessons}
        </span>
        <span className="font-semibold text-gray-900">
          {subject.progressPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/50 rounded-full h-2">
        <div
          className={`${progressBarColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${subject.progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
