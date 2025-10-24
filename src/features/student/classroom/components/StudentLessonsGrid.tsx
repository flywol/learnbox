import { Lock } from 'lucide-react';
import { StudentLesson } from '../types/classroom.types';

interface StudentLessonsGridProps {
  lessons: StudentLesson[];
  onLessonClick: (lesson: StudentLesson) => void;
  subjectDescription?: string;
  progressPercentage?: number;
}

export default function StudentLessonsGrid({
  lessons,
  onLessonClick,
}: Omit<StudentLessonsGridProps, 'subjectDescription' | 'progressPercentage'>) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6">
          <img
            src="/images/onboarding/student-2.svg"
            alt="No lessons"
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No lesson yet</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lessons Grid */}
      <div className="grid grid-cols-2 gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => onLessonClick(lesson)}
            className={`relative ${
              lesson.isLocked
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:shadow-md'
            } transition-shadow`}
          >
            {lesson.isLocked && (
              <div className="absolute top-2 right-2 z-10">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 mx-auto mb-2">
                {lesson.number}
              </div>
              <p className="text-xs text-gray-600 mb-1">Lesson {lesson.number}</p>
              <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
