import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TabType, Lesson } from '../types/classroom.types';
import AssignmentTab from '../components/assignments/AssignmentTab';
import QuizTab from '../components/quizzes/QuizTab';
import AssessmentTab from '../components/AssessmentTab';
import LessonContentView from '../components/subject-detail/LessonContentView';
import SubjectHeader from '../components/subject-detail/SubjectHeader';
import SubjectTabs from '../components/subject-detail/SubjectTabs';
import LessonsGrid from '../components/subject-detail/LessonsGrid';
import LiveClassTab from '../components/subject-detail/LiveClassTab';
import { lessonsApiClient } from '../../../teacher/lessons/api/lessonsApiClient';
import { subjectsApiClient } from '../../user-management/api/subjectsApiClient';
import { mockData } from '../data';

export default function SubjectDetailPage() {
  const { classId, armId, subjectId } = useParams<{ classId: string; armId: string; subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showForum, setShowForum] = useState(false);

  // Fetch subjects for this class to get subject details
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useQuery({
    queryKey: ['admin-subjects', classId, armId],
    queryFn: () => subjectsApiClient.getSubjectsForClass(classId!, armId!),
    enabled: !!classId && !!armId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch lessons for this specific subject
  const { data: lessonsData, isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['admin-lessons', classId, subjectId],
    queryFn: () => {
      if (!classId || !subjectId) {
        throw new Error('Missing classId or subjectId for fetching lessons');
      }
      console.log('Admin fetching lessons for:', { 
        classId, 
        subjectId,
        endpoint: `/lessons/class/${classId}/subject/${subjectId}`
      });
      return lessonsApiClient.getLessonsByClassAndSubject(classId, subjectId, armId);
    },
    enabled: !!classId && !!subjectId,
    staleTime: 2 * 60 * 1000,
  });

  const currentSubject = subjects?.find(s => s.id === subjectId);
  const lessons = lessonsData?.lessons?.map(lesson => ({
    id: lesson.id,
    number: parseInt(lesson.number),
    title: lesson.title,
    lessonNumber: lesson.number,
  })) || [];
  
  console.log('Admin Subject Detail Data:', { 
    classId, 
    armId, 
    subjectId, 
    currentSubject, 
    lessonsCount: lessons.length,
    subjectsLoading,
    lessonsLoading
  });

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
      setShowForum(false);
    } else {
      navigate(`/admin/classroom/${classId}/${armId}`);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  // Loading state
  if (subjectsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
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

  // Error state
  if (subjectsError || (!currentSubject && !subjectsLoading)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-red-600">Subject Not Found</h1>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load subject</h3>
          <p className="text-gray-500 mb-4">The requested subject could not be found or failed to load.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If viewing lesson content
  if (selectedLesson) {
    return (
      <LessonContentView
        lesson={selectedLesson}
        onBack={handleBack}
        showForum={showForum}
        onToggleForum={() => setShowForum(!showForum)}
        lessonContent={mockData.lessonContent}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Subject Header - Only show on Lessons tab */}
      {activeTab === 'lessons' && currentSubject && (
        <SubjectHeader 
          subjectData={{
            name: currentSubject.name,
            description: `${currentSubject.name} lessons for this class`,
            lessonCount: lessons.length,
            completedLessons: 0, // TODO: Calculate from real data
            progress: 0, // TODO: Calculate from real data
            teacher: {
              name: 'Teacher', // TODO: Get from real data
              avatar: undefined
            }
          }}
          onBack={handleBack}
        />
      )}

      {/* For other tabs, just show back button and title */}
      {activeTab !== 'lessons' && currentSubject && (
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">{currentSubject.name}</h1>
        </div>
      )}

      <SubjectTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'lessons' && (
          <div className="bg-white rounded-lg p-6">
            {lessonsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : lessonsError ? (
              <div className="text-center py-8">
                <div className="text-red-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load lessons</h3>
                <p className="text-gray-500 mb-4">Please try again later.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
                <p className="text-gray-500">Lessons for this subject will appear here once they are created.</p>
              </div>
            ) : (
              <LessonsGrid 
                lessons={lessons}
                onLessonClick={handleLessonClick}
              />
            )}
          </div>
        )}

        {activeTab === 'live-class' && (
          <div className="bg-white rounded-lg p-6">
            <LiveClassTab 
              students={mockData.students} 
              liveClasses={mockData.liveClasses}
            />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-white rounded-lg p-6">
            <QuizTab quizzes={mockData.quizzes || []} />
          </div>
        )}

        {activeTab === 'assignment' && (
          <div className="bg-white rounded-lg p-6">
            <AssignmentTab assignments={mockData.assignments || []} />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="bg-white rounded-lg p-6">
            <AssessmentTab 
              students={mockData.assessmentStudents}
              summary={mockData.assessmentSummary}
            />
          </div>
        )}
      </div>
    </div>
  );
}