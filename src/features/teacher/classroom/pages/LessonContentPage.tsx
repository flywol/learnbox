import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import { getSubjectDetail } from '../data/mockData';

export default function LessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [isForumOpen, setIsForumOpen] = useState(false);

  const subject = getSubjectDetail(subjectId!);
  const lesson = subject?.lessons.find(l => l.id === lessonId);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '▶️';
      case 'document':
        return '📄';
      case 'quiz':
        return '📊';
      case 'assignment':
        return '📝';
      default:
        return '📄';
    }
  };

  if (!subject || !lesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/teacher/subject/${subjectId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Not Found</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Lesson Content</h1>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-pink-100 rounded-lg p-8 relative">
        <div className="absolute top-6 right-6">
          <button className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
            <span className="text-lg">+</span>
            Add New Content
          </button>
        </div>
        <div className="flex items-center justify-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Lesson {lesson.number}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Content</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.contents.map((content) => (
            <div
              key={content.id}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-orange-600 bg-orange-50 rounded-lg">
                  {getContentIcon(content.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {content.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {content.description}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-4 h-4 text-gray-400">✏️</div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {lesson.contents.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No content available for this lesson yet.</p>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsForumOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Classroom Forum Overlay */}
      {isForumOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full shadow-xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Classroom Forum</h3>
              <button
                onClick={() => setIsForumOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 h-full overflow-y-auto pb-20">
              {/* Comment Input */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <input
                  type="text"
                  placeholder="Add your comment"
                  className="flex-1 bg-transparent border-none outline-none text-gray-600"
                />
              </div>

              {/* Sample Comments */}
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Mr Akande</span>
                        <span className="text-sm text-gray-500">2:00pm</span>
                      </div>
                      <p className="text-gray-700 mb-2">Do you all understand?</p>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Reply this chat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Praise Peters</span>
                        <span className="text-sm text-gray-500">1:58pm</span>
                      </div>
                      <p className="text-gray-700 mb-2">Can you explain it sir?</p>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Reply this chat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Mr Akande</span>
                        <span className="text-sm text-gray-500">2:00pm</span>
                      </div>
                      <p className="text-gray-700 mb-2">Do you all understand?</p>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Reply this chat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Mr Akande</span>
                        <span className="text-sm text-gray-500">2:00pm</span>
                      </div>
                      <p className="text-gray-700 mb-2">Do you all understand?</p>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Reply this chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}