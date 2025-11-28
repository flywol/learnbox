import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';
import VideoContent from '../components/content-items/VideoContent';
import DocumentContent from '../components/content-items/DocumentContent';
import QuizContent from '../components/content-items/QuizContent';
import AssignmentContent from '../components/content-items/AssignmentContent';

export default function ContentItemPage() {
  const { subjectId, lessonId, contentId } = useParams<{
    subjectId: string;
    lessonId: string;
    contentId: string;
  }>();
  const navigate = useNavigate();

  const { getLessonsBySubject, markContentItemComplete } = useClassroomStore();

  const lessons = subjectId ? getLessonsBySubject(subjectId) : [];
  const lesson = lessons.find((l) => l.id === lessonId);
  const contentItem = lesson?.contentItems.find((item) => item.id === contentId);

  if (!lesson || !contentItem) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Content not found</p>
      </div>
    );
  }

  // Find next content item
  const currentIndex = lesson.contentItems.findIndex((item) => item.id === contentId);
  const nextItem = lesson.contentItems[currentIndex + 1];
  const isLastItem = currentIndex === lesson.contentItems.length - 1;

  const handleMarkComplete = () => {
    if (subjectId && !contentItem.isCompleted) {
      markContentItemComplete(lesson.id, subjectId, contentItem.id);
    }
  };

  const handleGoToNext = () => {
    handleMarkComplete();

    if (nextItem) {
      // Navigate to next content item
      navigate(`/student/classroom/subject/${subjectId}/lesson/${lessonId}/content/${nextItem.id}`);
    } else {
      // Navigate back to lesson content grid
      navigate(`/student/classroom/subject/${subjectId}/lesson/${lessonId}`);
    }
  };

  const renderContent = () => {
    switch (contentItem.type) {
      case 'video':
        return <VideoContent contentItem={contentItem} />;
      case 'document':
        return <DocumentContent contentItem={contentItem} />;
      case 'quiz':
        return <QuizContent contentItem={contentItem} />;
      case 'assignment':
        return <AssignmentContent contentItem={contentItem} />;
      default:
        return <DocumentContent contentItem={contentItem} />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/student/classroom/subject/${subjectId}/lesson/${lessonId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-500">Lesson content</h1>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {renderContent()}
      </div>

      {/* Action Button */}
      {/* Action Button & Completion Indicator */}
      <div className="flex items-center justify-center gap-4">
        {contentItem.isCompleted ? (
          <button
            onClick={handleGoToNext}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
          >
            {isLastItem ? 'Back to Lesson' : 'Go to next item'}
          </button>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
          >
            Mark as complete
          </button>
        )}

        {contentItem.isCompleted && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
      </div>
    </div>
  );
}
