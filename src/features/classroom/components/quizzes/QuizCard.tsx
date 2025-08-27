import { Quiz } from '../../types/classroom.types';

interface QuizCardProps {
  quiz: Quiz;
  onView: (quiz: Quiz) => void;
}

export default function QuizCard({ quiz, onView }: QuizCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
        <p className="text-sm text-gray-600">{quiz.dueDate}</p>
      </div>
      <button
        onClick={() => onView(quiz)}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        View
      </button>
    </div>
  );
}