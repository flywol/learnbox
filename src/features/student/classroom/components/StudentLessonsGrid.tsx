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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          onClick={() => onLessonClick(lesson)}
          className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            {/* Numbered Badge */}
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 text-lg font-bold">
              {lesson.number}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                {lesson.title}
              </h4>
              <p className="text-sm text-gray-500">
                Lesson {lesson.number}
              </p>
            </div>

            {/* Lock Icon for locked lessons */}
            {lesson.isLocked && (
              <div className="flex-shrink-0">
                <Lock className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
