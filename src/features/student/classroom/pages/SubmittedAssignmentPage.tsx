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
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/student/classroom')}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
        <div className="flex-1">
           <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
           <div className="flex items-center gap-3 text-sm mt-1">
             <span className={`px-2.5 py-0.5 rounded-full font-semibold text-xs ${
                assignment.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
             }`}>
                {assignment.status === 'graded' ? 'Graded' : 'Submitted'}
             </span>
             {assignment.submittedAt && (
               <span className="text-gray-500">
                 Submitted {getTimeSinceSubmission()}
               </span>
             )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Questions & Answers */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Your Response</h2>
              <div className="space-y-8">
                {questionsWithAnswers.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md text-xs font-bold text-gray-600">
                        {item.id}
                      </span>
                      <p className="text-gray-900 font-medium">{item.question}</p>
                    </div>
                    <div className="pl-9">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-gray-700 text-sm leading-relaxed">
                         {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Right Column: Score & Feedback */}
        <div className="lg:col-span-1 space-y-6">
           {/* Score Card */}
           {assignment.status === 'graded' && assignment.score !== undefined && (
             <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Grade</h2>
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#F3F4F6"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke={scorePercentage >= 70 ? "#10B981" : scorePercentage >= 50 ? "#F59E0B" : "#EF4444"}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(scorePercentage / 100) * 351.8} 351.8`}
                            strokeLinecap="round"
                        />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${
                            scorePercentage >= 70 ? "text-green-600" : scorePercentage >= 50 ? "text-orange-500" : "text-red-500"
                        }`}>
                            {scorePercentage}%
                        </span>
                        <span className="text-sm text-gray-400 font-medium">Score</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Total Points</p>
                        <p className="text-xl font-bold text-gray-900">{assignment.score} <span className="text-gray-400 text-base font-normal">/ {assignment.totalPoints}</span></p>
                    </div>
                </div>
             </div>
           )}

           {/* Feedback Card */}
           {assignment.status === 'graded' && (
             <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                   <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>💬</span> Teacher's Remark
                   </h3>
                   <p className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      Great work! You've shown a solid understanding of the topic.
                   </p>
                </div>
                
                <div>
                   <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>💡</span> Suggestions
                   </h3>
                   <p className="text-sm text-gray-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                      Consider expanding on your explanation of chlorophyll's role in photosynthesis.
                   </p>
                </div>
             </div>
           )}

           <button
             onClick={() => navigate('/student/classroom')}
             className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm"
           >
             Back to Classroom
           </button>
        </div>
      </div>
    </div>
  );
}
