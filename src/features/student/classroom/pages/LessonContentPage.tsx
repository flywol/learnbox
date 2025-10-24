import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Play, FileText, Grid3x3, Edit, CheckCircle, Circle } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';
import ClassChatSidebar from '../components/ClassChatSidebar';
import { LessonContentItem } from '../types/classroom.types';

export default function LessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { getLessonsBySubject, forumMessages, addForumMessage, markContentItemComplete } =
    useClassroomStore();

  const lessons = subjectId ? getLessonsBySubject(subjectId) : [];
  const lesson = lessons.find((l) => l.id === lessonId);
  const messages = lessonId ? forumMessages[lessonId] || [] : [];

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lesson not found</p>
      </div>
    );
  }

  const handleSendMessage = (message: string) => {
    if (lessonId) {
      addForumMessage(lessonId, {
        senderId: 'current-student',
        senderName: 'You',
        senderRole: 'STUDENT',
        message,
      });
    }
  };

  const handleContentItemClick = (item: LessonContentItem) => {
    if (!item.isCompleted && subjectId) {
      markContentItemComplete(lesson.id, subjectId, item.id);
    }
  };

  const getContentIcon = (type: LessonContentItem['type']) => {
    switch (type) {
      case 'video':
        return <Play className="w-6 h-6 text-red-600" />;
      case 'document':
      case 'file':
        return <FileText className="w-6 h-6 text-orange-600" />;
      case 'quiz':
        return <Grid3x3 className="w-6 h-6 text-purple-600" />;
      case 'assignment':
        return <Edit className="w-6 h-6 text-blue-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/student/classroom/subject/${subjectId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Lesson content</h1>
      </div>

      {/* Lesson Header */}
      <div className="bg-[#FEF6F3] rounded-lg p-8 relative overflow-hidden">
        <h2 className="text-3xl font-bold text-gray-900">Lesson {lesson.number}</h2>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-50">
          <div className="w-20 h-20 text-6xl">📝</div>
        </div>
      </div>

      {/* Content Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>

        {lesson.contentItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-48 h-48 mx-auto mb-4">
              <img
                src="/images/onboarding/student-2.svg"
                alt="No content"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-600">No lesson yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lesson.contentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleContentItemClick(item)}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{getContentIcon(item.type)}</div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                {item.isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Sidebar */}
      <ClassChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
