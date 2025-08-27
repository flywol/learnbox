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
    navigate(`/classroom/${classId}/subject/${subjectId}/quiz/${quiz.id}`);
  };

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