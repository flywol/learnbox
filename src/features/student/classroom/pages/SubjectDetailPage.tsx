import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';
import StudentLessonsGrid from '../components/StudentLessonsGrid';
import QuizTab from '../components/QuizTab';
import AssignmentTab from '../components/AssignmentTab';
import LockedLessonModal from '../components/LockedLessonModal';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';
import { SubjectTab, StudentLesson } from '../types/classroom.types';

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SubjectTab>('lesson'); 
  const [lockedLesson, setLockedLesson] = useState<StudentLesson | null>(null);

  const { getSubjectById, getLessonsBySubject, getQuizzesBySubject } = useClassroomStore();

  const subject = subjectId ? getSubjectById(subjectId) : undefined;
  const lessons = subjectId ? getLessonsBySubject(subjectId) : [];
  const quizzes = subjectId ? getQuizzesBySubject(subjectId) : [];

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Subject not found</p>
      </div>
    );
  }

  const handleLessonClick = (lesson: StudentLesson) => {
    if (lesson.isLocked) {
      setLockedLesson(lesson);
    } else {
      navigate(`/student/classroom/subject/${subjectId}/lesson/${lesson.id}`);
    }
  };

  const tabs: { id: SubjectTab; label: string }[] = [
    { id: 'lesson', label: 'Lesson' },
    { id: 'live-class', label: 'Live class' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'assignment', label: 'Assignment' },
  ];

  const subjectDescription =
    'Explore the fascinating world of living organisms, from microscopic cells to complex ecosystems. Dive into the science of life, evolution, and the interconnectedness of all living things.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/classroom')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{subject.name}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lesson Tab */}
      {activeTab === 'lesson' && (
        <div className="space-y-4">
          {/* Course Overview Card */}
          <CourseOverviewCard
            description={subjectDescription}
            progress={subject.progressPercentage || 0}
            showProgress={true}
          />

          {/* Teacher Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Teacher:</p>
                  <p className="text-sm font-semibold text-gray-900">{subject.teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <StudentLessonsGrid
            lessons={lessons}
            onLessonClick={handleLessonClick}
          />
        </div>
      )}

      {/* Live Class Tab */}
      {activeTab === 'live-class' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No live classes scheduled for this subject yet.</p>
          <button
            onClick={() => navigate('/student/live-class')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            View All Live Classes
          </button>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && <QuizTab quizzes={quizzes} />}

      {/* Assignment Tab */}
      {activeTab === 'assignment' && <AssignmentTab />}

      {/* Locked Lesson Modal */}
      {lockedLesson && (
        <LockedLessonModal
          isOpen={!!lockedLesson}
          onClose={() => setLockedLesson(null)}
          lesson={lockedLesson}
        />
      )}
    </div>
  );
}
