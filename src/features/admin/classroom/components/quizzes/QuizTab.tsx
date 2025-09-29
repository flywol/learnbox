import { useNavigate, useParams } from 'react-router-dom';
import { Quiz } from '../../types/classroom.types';
import QuizCard from './QuizCard';

interface QuizTabProps {
  quizzes: Quiz[];
}

export default function QuizTab({ quizzes }: QuizTabProps) {
  const navigate = useNavigate();
  const { classId, subjectId } = useParams();

  const handleQuizClick = (quiz: Quiz) => {
    navigate(`/admin/classroom/${classId}/subject/${subjectId}/quiz/${quiz.id}`);
  };

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No quizzes have been created for this subject yet. Create quizzes to test student knowledge and track their progress.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => navigate(`/admin/classroom/${classId}/subject/${subjectId}/quiz/create`)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Quiz
          </button>
          <p className="text-xs text-gray-400">
            Set up interactive quizzes with multiple choice questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onView={handleQuizClick}
        />
      ))}
    </div>
  );
}