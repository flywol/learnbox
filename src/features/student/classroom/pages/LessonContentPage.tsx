import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, FileText, BarChart3, ClipboardList, CheckCircle } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';
import { LessonContentItem } from '../types/classroom.types';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';

export default function LessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();

  const { getLessonsBySubject } = useClassroomStore();

  const lessons = subjectId ? getLessonsBySubject(subjectId) : [];
  const lesson = lessons.find((l) => l.id === lessonId);

  // Calculate progress
  const completedItems = lesson?.contentItems.filter(item => item.isCompleted).length || 0;
  const totalItems = lesson?.contentItems.length || 0;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lesson not found</p>
      </div>
    );
  }

  const handleContentItemClick = (item: LessonContentItem) => {
    navigate(`/student/classroom/subject/${subjectId}/lesson/${lessonId}/content/${item.id}`);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
      case 'reading':
        return <FileText className="w-5 h-5" />;
      case 'quiz':
        return <BarChart3 className="w-5 h-5" />;
      case 'assignment':
        return <ClipboardList className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-50 text-red-600';
      case 'document':
      case 'reading':
        return 'bg-orange-50 text-orange-600';
      case 'quiz':
        return 'bg-orange-50 text-orange-600';
      case 'assignment':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  // Check if lesson has content items, show empty state if not
  const hasContent = lesson.contentItems && lesson.contentItems.length > 0;

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
        <h1 className="text-xl font-semibold text-gray-500">Lesson content</h1>
      </div>

      {/* Lesson Overview Card */}
      <CourseOverviewCard
        description={lesson.title}
        progress={progress}
        showProgress={true}
      />

      {/* Content Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>

        {!hasContent ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
              <img
                src="/images/empty-lesson.svg"
                alt="No lesson content"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'text-8xl';
                  fallback.textContent = '📚';
                  e.currentTarget.parentElement?.appendChild(fallback);
                }}
              />
            </div>
            <p className="text-gray-500 font-medium">No lesson yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.contentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleContentItemClick(item)}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgColor(item.type)}`}>
                    {getContentIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.description || `Learn about ${item.title.toLowerCase()}`}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    {item.isCompleted ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white fill-current" />
                      </div>
                    ) : (
                      <button className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                        Go
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
