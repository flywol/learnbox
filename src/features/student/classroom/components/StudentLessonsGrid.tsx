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
                ? 'cursor-pointer opacity-75 bg-gray-50'
                : 'cursor-pointer hover:shadow-md'
            } transition-shadow`}
          >
            {lesson.isLocked && (
              <div className="absolute top-2 right-2 z-10">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center group-hover:border-orange-200 transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                {lesson.number}
              </div>
              <h4 className="text-sm font-bold text-gray-900 truncate mb-1">{lesson.title}</h4>
              <p className="text-xs text-gray-500 mb-3">Lesson {lesson.number}</p>
              
              <div className={`text-xs font-medium py-1.5 px-3 rounded-lg inline-block ${
                lesson.isLocked 
                  ? 'bg-gray-100 text-gray-500' 
                  : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors'
              }`}>
                {lesson.isLocked ? 'Locked' : 'Start Lesson'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
