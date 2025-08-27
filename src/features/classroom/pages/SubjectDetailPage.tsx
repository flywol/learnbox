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
      <SubjectHeader 
        subjectData={mockData.subjectData}
        onBack={handleBack}
      />

      <SubjectTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6">
        {activeTab === 'lessons' && (
          <LessonsGrid 
            lessons={mockData.lessons}
            onLessonClick={handleLessonClick}
          />
        )}

        {activeTab === 'live-class' && (
          <LiveClassTab students={mockData.students} />
        )}

        {activeTab === 'quiz' && (
          <QuizTab quizzes={mockData.quizzes || []} />
        )}

        {activeTab === 'assignment' && (
          <AssignmentTab assignments={mockData.assignments || []} />
        )}

        {activeTab === 'assessment' && (
          <AssessmentTab 
            students={mockData.assessmentStudents}
            summary={mockData.assessmentSummary}
          />
        )}
      </div>
    </div>
  );
}