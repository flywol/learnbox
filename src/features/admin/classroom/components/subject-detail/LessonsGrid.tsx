import { Lesson } from '../../types/classroom.types';

interface LessonsGridProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
}

export default function LessonsGrid({ lessons, onLessonClick }: LessonsGridProps) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lessons Available</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No lessons have been created for this subject yet. Create engaging lesson content to help students learn effectively.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => {/* Add navigation to create lesson */}}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Lesson
          </button>
          <p className="text-xs text-gray-400">
            Add interactive lessons with videos, documents, and activities
          </p>
        </div>
      </div>
    );
  }

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