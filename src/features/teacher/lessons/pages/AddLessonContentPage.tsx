import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, FileText, ClipboardList, BarChart3 } from 'lucide-react';

interface ContentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  route: string;
  description: string;
}

export default function AddLessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();

  const contentTypes: ContentType[] = [
    {
      id: 'video',
      name: 'Add video',
      icon: <Play className="w-6 h-6" />,
      route: `/teacher/subject/${subjectId}/lesson/${lessonId}/content/video/add`,
      description: 'Upload video content for the lesson'
    },
    {
      id: 'files',
      name: 'Add files',
      icon: <FileText className="w-6 h-6" />,
      route: `/teacher/subject/${subjectId}/lesson/${lessonId}/content/files/add`,
      description: 'Upload documents and files'
    },
    {
      id: 'assignment',
      name: 'Add assignment',
      icon: <ClipboardList className="w-6 h-6" />,
      route: `/teacher/subject/${subjectId}/lesson/${lessonId}/content/assignment/add`,
      description: 'Create assignments for students'
    },
    {
      id: 'quiz',
      name: 'Add quiz',
      icon: <BarChart3 className="w-6 h-6" />,
      route: `/teacher/subject/${subjectId}/lesson/${lessonId}/content/quiz/add`,
      description: 'Create quizzes and assessments'
    }
  ];

  const handleContentTypeClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add Content to Lesson</h1>
      </div>

      {/* Content Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Select a content type to add to this lesson:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentTypes.map((contentType, index) => (
            <button
              key={contentType.id}
              onClick={() => handleContentTypeClick(contentType.route)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                index === 0 
                  ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-lg ${
                  index === 0 
                    ? 'bg-white/20' 
                    : 'bg-gray-50'
                }`}>
                  <div className={index === 0 ? 'text-white' : 'text-orange-500'}>
                    {contentType.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{contentType.name}</h3>
                  <p className={`text-xs ${
                    index === 0 ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {contentType.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}