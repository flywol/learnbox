import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MessageCircle, X, Send, Video, FileText, BarChart3, ClipboardList, Edit } from 'lucide-react';
import { lessonsApiClient } from '../../lessons/api/lessonsApiClient';
import { forumApiClient } from '../../lessons/api/forumApiClient';
import { useToast } from '../../../../hooks/use-toast';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';

// Mock lesson content items - keeping until content items endpoint is provided
const mockLessonContents = [
  {
    id: '1',
    type: 'video',
    title: 'Beginning of everything',
    description: 'Learn about how biology began',
    isCompleted: true
  },
  {
    id: '2',
    type: 'document',
    title: 'Introduction',
    description: 'Learn about how biology began',
    isCompleted: true
  },
  {
    id: '3',
    type: 'video',
    title: 'Life and its characteristics',
    description: 'Learn about how biology began',
    isCompleted: false
  },
  {
    id: '4',
    type: 'quiz',
    title: 'Introduction Quiz',
    description: 'Lesson 1 quiz',
    isCompleted: false
  },
  {
    id: '5',
    type: 'assignment',
    title: 'Introduction',
    description: 'Lesson 1 assignment',
    isCompleted: false
  },
  {
    id: '6',
    type: 'document',
    title: 'Introduction',
    description: 'Take note and download the resources',
    isCompleted: false
  }
];

export default function LessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isForumOpen, setIsForumOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Fetch lesson details - disabled for now, using mock data
  const {
    data: lesson,
    isLoading
  } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      return lessonsApiClient.getLesson(lessonId);
    },
    enabled: false, // Disabled - using mock data below
    staleTime: 5 * 60 * 1000,
  });

  // Fetch forum messages
  const {
    data: forumData,
    isLoading: forumLoading,
    error: forumError
  } = useQuery({
    queryKey: ['forum-messages', lessonId],
    queryFn: () => forumApiClient.getMessages(lessonId!),
    enabled: !!lessonId && isForumOpen,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Post message mutation
  const postMessageMutation = useMutation({
    mutationFn: (message: string) => forumApiClient.postMessage(lessonId!, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-messages', lessonId] });
      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been posted to the forum.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      postMessageMutation.mutate(newMessage.trim());
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
      case 'file':
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
      case 'file':
        return 'bg-orange-50 text-orange-600';
      case 'quiz':
        return 'bg-purple-50 text-purple-600';
      case 'assignment':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Use mock lesson data if API call fails - keeping until lesson endpoint is stable
  const displayLesson = lesson || {
    id: lessonId,
    number: '1',
    title: 'Introduction to Biology',
    subject: 'Biology',
    class: 'JSS 1',
    classArm: 'A',
    startDate: new Date().toISOString().split('T')[0],
    contentType: 'video',
    contentTitle: 'Getting Started',
    contentDescription: 'Introduction to the course'
  };

  return (
    <div className={`flex ${isForumOpen ? 'mr-96' : ''} transition-all duration-300`}>
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/teacher/subject/${subjectId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-500">Lesson content</h1>
        </div>

        {/* Course Overview Card */}
        <CourseOverviewCard
          description={`Lesson ${displayLesson.number}: ${displayLesson.title}`}
          progress={0}
          showProgress={false}
          onEdit={() => {
            navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}/edit`);
          }}
        />

        {/* Content Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Content</h3>
            <button
              onClick={() => navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}/content/add`)}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="text-lg">+</span>
              Add New Content
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLessonContents.map((item) => (
              <div
                key={item.id}
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
                      {item.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {item.isCompleted ? (
                      <button className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                        View
                      </button>
                    ) : (
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsForumOpen(true)}
        className={`fixed bottom-6 ${isForumOpen ? 'right-[25rem]' : 'right-6'} w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 flex items-center justify-center z-40`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Classroom Forum Panel */}
      {isForumOpen && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Classroom Forum</h3>
            <button
              onClick={() => setIsForumOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {forumLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading messages...</p>
                </div>
              ) : forumError ? (
                <div className="text-center py-4">
                  <p className="text-sm text-red-600">Failed to load messages</p>
                </div>
              ) : forumData?.data.messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                forumData?.data.messages.map((message) => (
                  <div key={message._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {message.author.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{message.author.fullName}</span>
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                            {message.authorType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-orange-600">T</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={postMessageMutation.isPending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || postMessageMutation.isPending}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {postMessageMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}