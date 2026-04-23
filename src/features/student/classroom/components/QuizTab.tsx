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
      <div className="bg-white border border-[#d6d6d6] rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#d5e1ff" strokeWidth="8" fill="none" />
              <circle
                cx="48" cy="48" r="40"
                stroke="#4F46E5" strokeWidth="8" fill="none"
                strokeDasharray={`${summary.total > 0 ? (summary.graded / summary.total) * 251.2 : 0} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-[#2b2b2b]">{summary.graded}</span>
                <span className="text-base text-[#6b6b6b]">/{summary.total}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-[#2b2b2b] text-lg mb-3">Quiz</h3>
            <div className="space-y-1 text-sm">
              <p className="text-[#2b2b2b]">Total: <span className="font-semibold">{summary.total > 0 ? summary.total : "--"}</span></p>
              <p className="text-[#2b2b2b]">Pending: <span className="font-semibold">{summary.total > 0 ? summary.pending : "--"}</span></p>
              <p className="text-[#2b2b2b]">Submitted: <span className="font-semibold">{summary.total > 0 ? summary.submitted : "--"}</span></p>
            </div>
          </div>

          <div className="hidden md:block w-20 h-20 flex-shrink-0 opacity-70">
            <img src="/images/student/assignmentbg.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-6 border-b border-[#eeeeee]">
        {filters.map((filter) => (
          <div key={filter.id} className="flex flex-col">
            <button
              onClick={() => setActiveFilter(filter.id)}
              className={`pb-3 font-medium transition-colors text-base ${
                activeFilter === filter.id ? "text-[#2b2b2b] font-semibold" : "text-[#838383]"
              }`}
            >
              {filter.label}
            </button>
            {activeFilter === filter.id && (
              <div className="h-0.5 bg-[#fd5d26] rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 gap-3">
            <img src="/images/onboarding/student-2.svg" alt="" className="w-28 h-28 opacity-70" />
            <p className="text-[#838383] text-base">No assignment yet</p>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white border border-[#d6d6d6] rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer flex items-center justify-between gap-3"
              onClick={() => {
                if (quiz.status === "pending") {
                  navigate(`/student/classroom/subject/${subjectId}/quiz/${quiz.id}/take`);
                } else {
                  navigate(`/student/classroom/subject/${subjectId}/quiz/${quiz.id}/review`);
                }
              }}
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#2b2b2b] mb-1 truncate">{quiz.title}</h4>
                {(() => {
                  const dueDate = formatDueDate(quiz.dueDate);
                  return <p className={`text-sm ${dueDate.color}`}>{dueDate.text}</p>;
                })()}
                {quiz.submittedAt && (
                  <p className="text-xs text-[#838383] mt-0.5">
                    Submitted at {formatSubmittedTime(quiz.submittedAt)}
                  </p>
                )}
              </div>

              {quiz.status === "pending" && (
                <span className="bg-[#fd5d26] text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex-shrink-0">
                  Go
                </span>
              )}
              {(quiz.status === "submitted" || quiz.status === "graded") && (
                <span className="bg-[#fd5d26] text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex-shrink-0">
                  View
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
