import { useNavigate, useParams } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { Quiz } from '../../types/classroom.types';
import QuizCard from '../quizzes/QuizCard';

interface QuizTabProps {
  quizzes: Quiz[];
}

export default function QuizTab({ quizzes }: QuizTabProps) {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const handleQuizClick = (quiz: Quiz) => {
    navigate(`/teacher/subject/${subjectId}/quiz/${quiz.id}`);
  };

  const handleCreateQuiz = () => {
    navigate(`/teacher/subject/${subjectId}/lesson/add/quiz`);
  };

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ClipboardList className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No quizzes have been created for this subject yet. Create quizzes to test student knowledge and track their progress.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleCreateQuiz}
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
    <div className="space-y-4">
      {/* Create Quiz Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCreateQuiz}
          className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <span className="text-lg">+</span>
          Create Quiz
        </button>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onView={handleQuizClick}
          />
        ))}
      </div>
    </div>
  );
}
