import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MessageCircle, X, RefreshCw, AlertCircle, Send } from 'lucide-react';
import { lessonsApiClient } from '../../lessons/api/lessonsApiClient';
import { forumApiClient } from '../../lessons/api/forumApiClient';
import { useToast } from '../../../../hooks/use-toast';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';

export default function LessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isForumOpen, setIsForumOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Fetch lesson details
  const {
    data: lesson,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      return lessonsApiClient.getLesson(lessonId);
    },
    enabled: !!lessonId,
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
        return '▶️';
      case 'document':
      case 'file':
        return '📄';
      case 'quiz':
        return '📊';
      case 'assignment':
        return '📝';
      default:
        return '📄';
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

  if (error || !lesson) {
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
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load lesson</h3>
          <p className="text-gray-600 mb-4">The requested lesson could not be found or failed to load.</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isForumOpen ? 'mr-96' : ''} transition-all duration-300`}>
      <div className="flex-1 space-y-6">
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

        {/* Course Overview Card for Lesson */}
        <div className="flex items-center justify-between">
          <CourseOverviewCard
            description={`Lesson ${lesson.number}: ${lesson.title}`}
            showProgress={false}
            onEdit={() => {
              navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}/edit`);
            }}
          />
        </div>

        {/* Lesson Details Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Lesson Number</p>
                <p className="text-base font-medium text-gray-900">{lesson.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-base font-medium text-gray-900">{lesson.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="text-base font-medium text-gray-900">{lesson.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-base font-medium text-gray-900">
                  {lesson.class} {lesson.classArm && `- ${lesson.classArm}`}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Content</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center text-orange-600 bg-white rounded-lg">
                  {getContentIcon(lesson.contentType)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{lesson.contentTitle}</h4>
                  <p className="text-gray-600 text-sm mb-2">{lesson.contentDescription}</p>
                  {lesson.fileUrl && (
                    <a
                      href={lesson.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:text-orange-700 underline"
                    >
                      View/Download File
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Section (if exists) */}
          {lesson.assignmentTitle && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center text-blue-600 bg-white rounded-lg">
                    📝
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{lesson.assignmentTitle}</h4>
                    <p className="text-gray-600 text-sm mb-2">{lesson.assignmentDescription}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {lesson.assignmentDueDate && (
                        <span>Due: {lesson.assignmentDueDate} {lesson.assignmentDueTime}</span>
                      )}
                      {lesson.acceptLateSubmissions !== undefined && (
                        <span>
                          {lesson.acceptLateSubmissions ? '✓ Accepts late submissions' : '✗ No late submissions'}
                        </span>
                      )}
                    </div>
                    {lesson.assignmentFileUrl && (
                      <a
                        href={lesson.assignmentFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
                      >
                        View/Download Assignment File
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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