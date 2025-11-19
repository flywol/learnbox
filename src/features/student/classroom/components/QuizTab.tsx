import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentQuiz, QuizSummary } from '../types/classroom.types';

interface QuizTabProps {
  quizzes: StudentQuiz[];
}

type QuizFilter = 'all' | 'pending' | 'submitted' | 'graded';

export default function QuizTab({ quizzes }: QuizTabProps) {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [activeFilter, setActiveFilter] = useState<QuizFilter>('all');

  // Calculate quiz summary
  const summary: QuizSummary = {
    total: quizzes.length,
    submitted: quizzes.filter((q) => q.status === 'submitted' || q.status === 'graded').length,
    pending: quizzes.filter((q) => q.status === 'pending').length,
    graded: quizzes.filter((q) => q.status === 'graded').length,
  };

  // Calculate average score
  const gradedQuizzes = quizzes.filter((q) => q.status === 'graded' && q.score && q.totalPoints);
  if (gradedQuizzes.length > 0) {
    const totalScore = gradedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
    const totalMaxPoints = gradedQuizzes.reduce((sum, q) => sum + (q.totalPoints || 0), 0);
    summary.averageScore = totalMaxPoints > 0 ? Math.round((totalScore / totalMaxPoints) * 5) : 0;
  }

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    if (activeFilter === 'all') return true;
    return quiz.status === activeFilter;
  });

  const filters: { id: QuizFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'graded', label: 'Graded' },
  ];

  const formatDueDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    }

    if (diffHours < 3) {
      return { text: `Due in ${diffHours}hrs ${diffMins}mins`, color: 'text-red-600' };
    }

    if (diffHours < 24) {
      return { text: `Due in ${diffHours}hrs ${diffMins}mins`, color: 'text-orange-600' };
    }

    return { text: `Due in ${Math.floor(diffHours / 24)}days ${diffHours % 24}hrs`, color: 'text-gray-600' };
  };

  const formatSubmittedTime = (isoString: string) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hours}:${minutesStr}${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Quiz Summary Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#4F46E5"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(summary.graded / summary.total) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {summary.graded}
                </p>
                <p className="text-sm text-gray-600">/{summary.total}</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-3">Quiz</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Total:</p>
                <p className="font-semibold text-gray-900">{summary.total}</p>
              </div>
              <div>
                <p className="text-gray-600">Submitted:</p>
                <p className="font-semibold text-gray-900">{summary.submitted}</p>
              </div>
              <div>
                <p className="text-gray-600">Pending:</p>
                <p className="font-semibold text-gray-900">{summary.pending}</p>
              </div>
              <div>
                <p className="text-gray-600">Graded:</p>
                <p className="font-semibold text-gray-900">{summary.graded}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-24 h-24">
            <img
              src="/images/onboarding/student-2.svg"
              alt="Quiz"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeFilter === filter.id
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <div className="mb-4">
              <img
                src="/images/onboarding/student-2.svg"
                alt="No quizzes"
                className="w-32 h-32 mx-auto opacity-50"
              />
            </div>
            <p className="text-gray-500">No assignment yet</p>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => {
                if (quiz.status === 'pending') {
                  navigate(`/student/classroom/subject/${subjectId}/quiz/${quiz.id}/take`);
                } else {
                  navigate(`/student/classroom/subject/${subjectId}/quiz/${quiz.id}/review`);
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{quiz.title}</h4>
                  {(() => {
                    const dueDate = formatDueDate(quiz.dueDate);
                    return <p className={`text-sm ${dueDate.color}`}>{dueDate.text}</p>;
                  })()}
                </div>

                {quiz.status === 'pending' && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    Go
                  </span>
                )}

                {(quiz.status === 'submitted' || quiz.status === 'graded') && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    View
                  </span>
                )}
              </div>

              {quiz.submittedAt && (
                <p className="text-xs text-gray-500">
                  Submitted at {formatSubmittedTime(quiz.submittedAt)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
