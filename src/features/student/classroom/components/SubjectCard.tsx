import { StudentSubject } from '../types/classroom.types';

interface SubjectCardProps {
  subject: StudentSubject;
  onClick: () => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
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
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${subject.progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
