import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/teacher/subject/${subjectId}/quiz/${quizId}/submissions`)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Preview | {submission.studentName}
            </h1>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {submission.percentage?.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
        </div>

        {/* Submission Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Quiz Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h2>

          {/* Instruction */}
          {quiz.instruction && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Instruction</h3>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: quiz.instruction }}
              />
            </div>
          )}

          {/* Due Date and Correct Submission Button */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <span className="text-sm text-gray-600">Due date: </span>
              <span className="text-sm font-medium text-gray-900">
                {formatDueDate(quiz.dueDate, quiz.dueTime)}
              </span>
            </div>
            <button
              onClick={handleCorrectSubmission}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Correct Submission
            </button>
          </div>

          {/* Questions with Student Answers */}
          <div className="space-y-8">
            {quiz.questions.map((question, index) => {
              const studentAnswers = getAnswersForQuestion(question.id);
              const answerData = submission.answers.find((a) => a.questionId === question.id);

              return (
                <div key={question.id}>
                  <QuestionCard
                    question={question}
                    questionNumber={index + 1}
                    selectedAnswers={studentAnswers}
                    showCorrectAnswers={true}
                    mode="grading"
                  />
                  {/* Show if answer is correct/incorrect */}
                  <div className="mt-2 ml-4">
                    {answerData?.isCorrect ? (
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Correct ({question.points} {question.points === 1 ? 'point' : 'points'})
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-medium">
                        ✗ Incorrect (0 points)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{submission.totalPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-2xl font-bold text-green-600">{submission.score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {submission.percentage?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
