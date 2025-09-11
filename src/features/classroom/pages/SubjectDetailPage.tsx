import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabType, Lesson } from '../types/classroom.types';
import AssignmentTab from '../components/assignments/AssignmentTab';
import QuizTab from '../components/quizzes/QuizTab';
import AssessmentTab from '../components/AssessmentTab';
import LessonContentView from '../components/subject-detail/LessonContentView';
import SubjectHeader from '../components/subject-detail/SubjectHeader';
import SubjectTabs from '../components/subject-detail/SubjectTabs';
import LessonsGrid from '../components/subject-detail/LessonsGrid';
import LiveClassTab from '../components/subject-detail/LiveClassTab';
import { mockData } from '../data';

export default function SubjectDetailPage() {
  const { classId } = useParams<{ classId: string; subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showForum, setShowForum] = useState(false);

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
      setShowForum(false);
    } else {
      navigate(`/classroom/${classId}`);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

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
      {activeTab === 'lessons' && (
        <SubjectHeader 
          subjectData={mockData.subjectData}
          onBack={handleBack}
        />
      )}

      {/* For other tabs, just show back button and title */}
      {activeTab !== 'lessons' && (
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">{mockData.subjectData.name}</h1>
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
            <LessonsGrid 
              lessons={mockData.lessons}
              onLessonClick={handleLessonClick}
            />
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