import { ArrowLeft } from 'lucide-react';
import { Lesson } from '../../types/classroom.types';

interface LessonContentViewProps {
  lesson: Lesson;
  onBack: () => void;
  showForum: boolean;
  onToggleForum: () => void;
  lessonContent: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
}

export default function LessonContentView({
  lesson,
  onBack,
  showForum,
  onToggleForum,
  lessonContent
}: LessonContentViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold">Lesson content</h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          {/* Lesson Header */}
          <div className="bg-pink-100 rounded-lg p-6 mb-6 relative overflow-hidden">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Lesson {lesson.number}</h2>
            <div className="absolute right-6 top-6 w-16 h-16 opacity-80">
              <img src="/assets/notepad.svg" alt="Notepad" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Content</h3>
            <div className="space-y-3">
              {lessonContent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forum Sidebar */}
        {showForum && (
          <div className="w-80 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Classroom Forum</h3>
              <button onClick={onToggleForum} className="p-1 hover:bg-gray-100 rounded">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">Forum content would go here...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}