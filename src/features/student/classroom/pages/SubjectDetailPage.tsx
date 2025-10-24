import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';
import StudentLessonsGrid from '../components/StudentLessonsGrid';
import QuizTab from '../components/QuizTab';
import LockedLessonModal from '../components/LockedLessonModal';
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
    { id: 'quiz', label: 'Quiz' },
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
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lesson Tab */}
      {activeTab === 'lesson' && (
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-lg border border-orange-200 p-6">
            <p className="text-gray-700 mb-4">{subjectDescription}</p>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${subject.progressPercentage || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-right">{subject.progressPercentage}%</p>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm text-gray-600">Teacher:</p>
                  <p className="font-semibold text-gray-900">{subject.teacher}</p>
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

      {/* Quiz Tab */}
      {activeTab === 'quiz' && <QuizTab quizzes={quizzes} />}

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
