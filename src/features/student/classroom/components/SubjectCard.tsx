import { StudentSubject } from '../types/classroom.types';

interface SubjectCardProps {
  subject: StudentSubject;
  onClick: () => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${subject.bgColor} rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-200`}
    >
      {/* Subject icon and name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">
          {subject.icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">{subject.name}</h3>
      </div>

      {/* Teacher name */}
      <div className="text-sm text-gray-700 mb-3">
        Teacher: {subject.teacher}
      </div>

      {/* Progress info */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-700">
          Lesson {subject.currentLesson}/{subject.totalLessons}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          {subject.progressPercentage}%
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/50 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${subject.progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
