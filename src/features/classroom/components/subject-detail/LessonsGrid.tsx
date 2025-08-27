import { Lesson } from '../../types/classroom.types';

interface LessonsGridProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
}

export default function LessonsGrid({ lessons, onLessonClick }: LessonsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          onClick={() => onLessonClick(lesson)}
          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold">
            {lesson.number}
          </div>
          <div>
            <p className="text-sm text-gray-600">{lesson.lessonNumber}</p>
            <p className="font-semibold">{lesson.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}