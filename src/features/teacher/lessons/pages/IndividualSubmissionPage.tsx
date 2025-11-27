import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { Quiz, QuizSubmission } from '../../classroom/types/classroom.types';

// Mock data
const getMockQuiz = (quizId: string): Quiz => ({
  id: quizId,
  title: 'Introduction to biology',
  instruction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra diam lectus odio orci...',
  duration: 20,
  dueDate: '2023-09-15',
  dueTime: '14:00',
  allowLateSubmission: true,
  status: 'published',
  subjectId: 'subject-1',
  questions: [
    {
      id: 'q1',
      question: 'Select all reptiles',
      type: 'text-only',
      options: [
        { label: 'A', value: 'Ostrich' },
        { label: 'B', value: 'Crocodile' },
        { label: 'C', value: 'Hawk' },
        { label: 'D', value: 'Snake' },
      ],
      correctAnswers: ['B', 'D'],
      points: 1,
    },
    {
      id: 'q2',
      question: 'Which of the following is cold-blooded?',
      type: 'text-with-image',
      options: [
        { label: 'A', value: 'Reptiles', image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=300&h=200&fit=crop' },
        { label: 'B', value: 'Mammals', image: 'https://images.unsplash.com/photo-1534188753412-5dfb9bdc0f15?w=300&h=200&fit=crop' },
        { label: 'C', value: 'Birds', image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&h=200&fit=crop' },
        { label: 'D', value: 'Fish', image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=300&h=200&fit=crop' },
      ],
      correctAnswers: ['A'],
      points: 1,
    },
    {
      id: 'q3',
      question: 'What class of animal does the following belong to?',
      type: 'text-with-image',
      image: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400&h=300&fit=crop',
      options: [
        { label: 'A', value: 'Mammals' },
        { label: 'B', value: 'Birds' },
        { label: 'C', value: 'Reptiles' },
        { label: 'D', value: 'Amphibians' },
      ],
      correctAnswers: ['D'],
      points: 2,
    },
  ],
});

const getMockSubmission = (studentId: string, quizId: string): QuizSubmission => ({
  id: 'sub-1',
  quizId,
  studentId,
  studentName: 'Jane Doe',
  studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=40&h=40&fit=crop&crop=face',
  submissionStatus: 'Submitted',
  submissionTime: '2023-09-15T14:30:00',
  gradeStatus: 'Graded',
  score: 2,
  totalPoints: 4,
  percentage: 66.67,
  answers: [
    { questionId: 'q1', selectedAnswers: ['B', 'D'], isCorrect: true },
    { questionId: 'q2', selectedAnswers: ['A'], isCorrect: true },
    { questionId: 'q3', selectedAnswers: ['C'], isCorrect: false }, // Wrong answer
  ],
});

export default function IndividualSubmissionPage() {
  const { quizId, subjectId, studentId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);

  useEffect(() => {
    if (quizId && studentId) {
      // TODO: Fetch quiz and submission from API
      const mockQuiz = getMockQuiz(quizId);
      const mockSubmission = getMockSubmission(studentId, quizId);
      setQuiz(mockQuiz);
      setSubmission(mockSubmission);
    }
  }, [quizId, studentId]);

  if (!quiz || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading submission...</p>
      </div>
    );
  }

  const formatDueDate = (date: string, time: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = d.toLocaleDateString('en-US', options);

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${formattedDate}, ${hour12}:${minutes} ${ampm}`;
  };

  const getAnswersForQuestion = (questionId: string): string[] => {
    const answer = submission.answers.find((a) => a.questionId === questionId);
    return answer?.selectedAnswers || [];
  };

  const handleCorrectSubmission = () => {
    // TODO: Update submission score/comments
    console.log('Correcting submission:', submission.id);
    alert('Submission corrected!');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/teacher/subject/${subjectId}/quiz/${quizId}/submissions`)}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
            <div>
               <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Submissions</span>
                  <span>/</span>
                  <span className="font-medium text-gray-900">{submission.studentName}</span>
               </div>
               <h1 className="text-2xl font-bold text-gray-900">
                 Review Submission
               </h1>
            </div>
          </div>

          {/* Score Display */}
          <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Score</p>
                <p className="text-2xl font-bold text-gray-900">
                   {submission.percentage?.toFixed(0)}<span className="text-sm text-gray-400 font-medium">%</span>
                </p>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-orange-100 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-orange-500 flex items-center justify-center bg-white">
                   <span className="text-xs font-bold text-orange-600">{submission.score}/{submission.totalPoints}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Content - Questions */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                   <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                         <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.duration} mins</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Due {formatDueDate(quiz.dueDate, quiz.dueTime)}</span>
                         </div>
                      </div>
                   </div>
                </div>

                {quiz.instruction && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Instructions</h3>
                    <div
                      className="text-gray-700 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: quiz.instruction }}
                    />
                  </div>
                )}

                {/* Questions with Student Answers */}
                <div className="space-y-10">
                  {quiz.questions.map((question, index) => {
                    const studentAnswers = getAnswersForQuestion(question.id);
                    const answerData = submission.answers.find((a) => a.questionId === question.id);

                    return (
                      <div key={question.id} className="relative">
                        <div className="absolute -left-3 top-6 w-1 h-full bg-gray-100 rounded-full" />
                        <div className="relative pl-6">
                           <QuestionCard
                             question={question}
                             questionNumber={index + 1}
                             selectedAnswers={studentAnswers}
                             showCorrectAnswers={true}
                             mode="grading"
                           />
                           
                           {/* Grading Feedback */}
                           <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
                              answerData?.isCorrect 
                                 ? 'bg-green-50 border-green-100' 
                                 : 'bg-red-50 border-red-100'
                           }`}>
                              {answerData?.isCorrect ? (
                                 <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                 <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                 <p className={`font-semibold ${
                                    answerData?.isCorrect ? 'text-green-900' : 'text-red-900'
                                 }`}>
                                    {answerData?.isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                                 </p>
                                 <p className={`text-sm mt-1 ${
                                    answerData?.isCorrect ? 'text-green-700' : 'text-red-700'
                                 }`}>
                                    {answerData?.isCorrect 
                                       ? `Student earned ${question.points} ${question.points === 1 ? 'point' : 'points'}`
                                       : 'Student earned 0 points'
                                    }
                                 </p>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
           </div>

           {/* Sidebar - Grading Controls */}
           <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
                 <h3 className="text-lg font-bold text-gray-900 mb-6">Grading Actions</h3>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Teacher's Remarks
                       </label>
                       <textarea 
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none text-sm"
                          placeholder="Add feedback for the student..."
                       />
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                       <button
                         onClick={handleCorrectSubmission}
                         className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-sm hover:shadow-md font-semibold"
                       >
                         Save Grading
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
