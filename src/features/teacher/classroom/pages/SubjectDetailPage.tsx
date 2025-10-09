import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Video, FileText, Users, ClipboardList, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { subjectsClassesApiClient } from '../api/subjectsClassesApiClient';
import { lessonsApiClient } from '../../lessons/api/lessonsApiClient';
import type { SubjectDetailTab } from '../types/classroom.types';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';

// Empty state components
const EmptyLessons = ({ onAddLesson }: { onAddLesson: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
    <p className="text-gray-500 mb-6">Start building your curriculum by creating your first lesson.</p>
    <button
      onClick={onAddLesson}
      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
    >
      Create First Lesson
    </button>
  </div>
);

const EmptyGeneric = ({ icon: Icon, title, description }: { 
  icon: React.ComponentType<any>; 
  title: string; 
  description: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load data</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Try Again</span>
    </button>
  </div>
);

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SubjectDetailTab>('lessons');

  // Fetch subject details and available classes
  const { data: subjectsData, isLoading: subjectsLoading, error: subjectsError } = useQuery({
    queryKey: ['teacher-subjects-classes'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
    staleTime: 5 * 60 * 1000,
  });

  const subject = subjectsData?.assignedSubjects.find(s => s._id === subjectId);

  // Extract classId and classArmId from subject's classRef
  const classId = subject?.classRef && typeof subject.classRef === 'object' ? subject.classRef._id : undefined;
  const classArmId = subject?.classArm;

  // Fetch lessons for this subject
  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons
  } = useQuery({
    queryKey: ['lessons', classId, subjectId, classArmId],
    queryFn: () => {
      if (!classId || !subjectId) {
        throw new Error('Class ID and Subject ID are required');
      }
      return lessonsApiClient.getLessonsByClassAndSubject(classId, subjectId, classArmId);
    },
    enabled: !!classId && !!subjectId,
    staleTime: 5 * 60 * 1000,
  });

  const lessons = lessonsData?.lessons || [];

  const tabs: { key: SubjectDetailTab; label: string }[] = [
    { key: 'lessons', label: 'Lessons' },
    { key: 'live-class', label: 'Live class' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'assignment', label: 'Assignment' },
    { key: 'assessment', label: 'Assessment' },
    { key: 'students', label: 'Students' }
  ];

  const handleLessonClick = (lessonId: string) => {
    navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}`);
  };

  if (subjectsLoading) {
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

  if (subjectsError || !subject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Subject Not Found</h1>
        </div>
        <ErrorState 
          message="The requested subject could not be found or failed to load." 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/teacher/classes')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {subject.name}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'text-orange-600 border-orange-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Course Overview Card */}
          <CourseOverviewCard
            description={
              subject.description ||
              `Explore the fascinating world of ${subject.name}`
            }
            progress={0}
            onEdit={() => {
              // TODO: Implement edit functionality
              console.log('Edit course overview');
            }}
          />

          {/* Add New Lesson Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => navigate(`/teacher/subject/${subjectId}/lesson/add`)}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="text-lg">+</span>
              Add New Lesson
            </button>
          </div>

          {/* Lessons Content */}
          {lessonsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : lessonsError ? (
            <ErrorState
              message="Failed to load lessons. Please try again."
              onRetry={() => refetchLessons()}
            />
          ) : lessons.length === 0 ? (
            <EmptyLessons onAddLesson={() => navigate(`/teacher/subject/${subjectId}/lesson/add`)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson.id)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                      {lesson.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Lesson {lesson.number}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {lesson.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other tabs with proper empty states */}
      {activeTab === 'live-class' && (
        <EmptyGeneric 
          icon={Video}
          title="No live classes scheduled"
          description="Live classes will appear here when you schedule them for your students."
        />
      )}
      
      {activeTab === 'quiz' && (
        <EmptyGeneric 
          icon={ClipboardList}
          title="No quizzes created"
          description="Create interactive quizzes to test your students' understanding."
        />
      )}
      
      {activeTab === 'assignment' && (
        <EmptyGeneric 
          icon={FileText}
          title="No assignments created"
          description="Assignments you create will be displayed here for easy management."
        />
      )}
      
      {activeTab === 'assessment' && (
        <EmptyGeneric 
          icon={BarChart3}
          title="No assessments available"
          description="Student assessment data and analytics will be shown here."
        />
      )}
      
      {activeTab === 'students' && (
        <EmptyGeneric 
          icon={Users}
          title="No students enrolled"
          description="Students enrolled in this subject will appear here."
        />
      )}
    </div>
  );
}