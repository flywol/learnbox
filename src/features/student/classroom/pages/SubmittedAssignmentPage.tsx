import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';

export default function SubmittedAssignmentPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { assignments } = useClassroomStore();

  // Find the assignment
  const assignment = assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Assignment not found</p>
      </div>
    );
  }

  // Mock assignment questions and answers
  const questionsWithAnswers = [
    {
      id: 1,
      question: 'What is the process by which plants convert sunlight into energy?',
      answer:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes on purpose (injected humour and the like)',
    },
    {
      id: 2,
      question: 'Explain the role of chlorophyll in this crucial energy conversion process.',
      answer:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English.',
    },
  ];

  // Calculate time since submission
  const getTimeSinceSubmission = () => {
    if (!assignment.submittedAt) return '';
    const now = new Date();
    const submitted = new Date(assignment.submittedAt);
    const diffMs = now.getTime() - submitted.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs > 0) {
      return `${diffHrs}hrs ${diffMins}mins ago`;
    }
    return `${diffMins}mins ago`;
  };

  const scorePercentage = assignment.score && assignment.totalPoints
    ? Math.round((assignment.score / assignment.totalPoints) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/classroom')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-700">Back</span>
      </div>

      {/* Assignment Info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
        {assignment.submittedAt && (
          <p className="text-sm text-gray-600">
            Submitted {getTimeSinceSubmission()}
          </p>
        )}
      </div>

      {/* Questions and Answers */}
      <div className="space-y-6">
        {questionsWithAnswers.map((item) => (
          <div key={item.id} className="space-y-3">
            <div className="flex gap-3">
              <span className="text-gray-700 font-medium">{item.id}.</span>
              <p className="text-gray-700 font-medium">{item.question}</p>
            </div>
            <div className="pl-7">
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Score Section (Only show if graded) */}
      {assignment.status === 'graded' && assignment.score !== undefined && (
        <div className="space-y-4">
          {/* Score Display */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                    fill="white"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#10B981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(scorePercentage / 100) * 175.9} 175.9`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">
                    {scorePercentage}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your remark</p>
                <p className="text-lg font-semibold text-gray-900">
                  {assignment.score}/{assignment.totalPoints}
                </p>
              </div>
            </div>
          </div>

          {/* Teacher's Remark */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
            <h3 className="font-semibold text-gray-900">Teacher's remark</h3>
            <p className="text-sm text-gray-600">
              Great work! You've shown a solid understanding of the topic.
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
            <h3 className="font-semibold text-gray-900">Suggestions</h3>
            <p className="text-sm text-gray-600">
              Consider expanding on your explanation of chlorophyll's role in photosynthesis.
              More specific examples would strengthen your answer.
            </p>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={() => navigate('/student/classroom')}
        className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
