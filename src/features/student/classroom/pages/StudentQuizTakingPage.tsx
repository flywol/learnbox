import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuizTimer from '../components/quiz/QuizTimer';
import StudentQuizQuestion from '../components/quiz/StudentQuizQuestion';
import StartQuizModal from '../components/quiz/StartQuizModal';
import FinishQuizModal from '../components/quiz/FinishQuizModal';
import StudentQuizSuccessModal from '../components/quiz/StudentQuizSuccessModal';
import { StudentQuiz } from '../types/classroom.types';

export default function StudentQuizTakingPage() {
  const navigate = useNavigate();
  const { subjectId, quizId } = useParams();

  // TODO: Replace with actual API call - using mock data for now
  const mockQuiz: StudentQuiz = {
    id: quizId || '1',
    title: 'Introduction to biology',
    subjectId: subjectId || '1',
    dueDate: '2023-09-15',
    dueTime: '14:00',
    duration: 20,
    instruction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra diam lectus odio orci...',
    status: 'pending',
    questions: [
      {
        id: '1',
        question: 'Select all reptiles',
        type: 'text-only',
        options: [
          { label: 'A', value: 'Ostrich' },
          { label: 'B', value: 'Crocodile' },
          { label: 'C', value: 'Hawk' },
          { label: 'D', value: 'Snake' }
        ],
        correctAnswers: ['B', 'D'],
        points: 5
      },
      {
        id: '2',
        question: 'Which of the following is cold-blooded?',
        type: 'text-with-image',
        options: [
          { label: 'A', value: 'Lizard', image: 'https://images.unsplash.com/photo-1567495111105-c2c2b90f0d7f?w=400' },
          { label: 'B', value: 'Bear', image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400' },
          { label: 'C', value: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
          { label: 'D', value: 'Bird', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400' }
        ],
        correctAnswers: ['A'],
        points: 5
      },
      {
        id: '3',
        question: 'What class of animal does the following belong to?',
        type: 'image-with-text',
        image: 'https://images.unsplash.com/photo-1503918756811-0bd64d76a5bb?w=400',
        options: [
          { label: 'A', value: 'Mammal' },
          { label: 'B', value: 'Bird' },
          { label: 'C', value: 'Reptile' },
          { label: 'D', value: 'Amphibian' }
        ],
        correctAnswers: ['D'],
        points: 5
      }
    ]
  };

  const [quizStarted, setQuizStarted] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [answers, setAnswers] = useState<Map<string, string[]>>(new Map());
  const [timeExpired, setTimeExpired] = useState(false);

  const answeredCount = answers.size;
  const totalQuestions = mockQuiz.questions?.length || 0;

  const handleStartQuiz = () => {
    setShowStartModal(false);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionId: string, label: string) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      // Single select - replace existing answer
      newAnswers.set(questionId, [label]);
      return newAnswers;
    });
  };

  const handleFinishClick = () => {
    setShowFinishModal(true);
  };

  const handleSubmitQuiz = () => {
    setShowFinishModal(false);
    // TODO: Submit quiz answers to API
    console.log('Submitting quiz with answers:', Object.fromEntries(answers));
    setShowSuccessModal(true);
  };

  const handleTimeExpired = () => {
    setTimeExpired(true);
    setShowFinishModal(true);
  };

  const handleGoBack = () => {
    navigate(`/student/classroom/subject/${subjectId}`);
  };

  const formatDueDate = (date: string, time: string) => {
    const dateObj = new Date(date + 'T' + time);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return dateObj.toLocaleString('en-US', options);
  };

  // Calculate time remaining for finish modal
  const timeRemaining = useMemo(() => {
    return timeExpired ? 0 : mockQuiz.duration * 60;
  }, [timeExpired, mockQuiz.duration]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Start Quiz Modal */}
      <StartQuizModal
        isOpen={showStartModal}
        onClose={handleGoBack}
        onStart={handleStartQuiz}
        duration={mockQuiz.duration}
      />

      {/* Finish Quiz Modal */}
      <FinishQuizModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onSubmit={handleSubmitQuiz}
        answeredCount={answeredCount}
        totalCount={totalQuestions}
        timeRemaining={timeRemaining}
      />

      {/* Success Modal */}
      <StudentQuizSuccessModal
        isOpen={showSuccessModal}
        onClose={handleGoBack}
        onGoBack={handleGoBack}
      />

      {/* Main Quiz Content */}
      {quizStarted && (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-medium text-gray-600">Start Quiz</h2>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Quiz Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{mockQuiz.title}</h1>
              <QuizTimer
                durationInMinutes={mockQuiz.duration}
                onTimeExpired={handleTimeExpired}
                isPaused={showFinishModal || showSuccessModal}
              />
            </div>

            {/* Instruction */}
            {mockQuiz.instruction && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Instruction</h3>
                <p className="text-gray-600 text-sm">{mockQuiz.instruction}</p>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Due date: <span className="font-medium text-gray-900">
                  {formatDueDate(mockQuiz.dueDate, mockQuiz.dueTime)}
                </span>
              </p>
              <p className="text-gray-600">
                Questions: <span className="font-medium text-gray-900">
                  {answeredCount} of {totalQuestions} answered
                </span>
              </p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {mockQuiz.questions?.map((question, index) => (
              <StudentQuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedAnswers={answers.get(question.id) || []}
                onAnswerSelect={(label) => handleAnswerSelect(question.id, label)}
              />
            ))}
          </div>

          {/* Finish Button */}
          <button
            onClick={handleFinishClick}
            className="w-full py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg"
          >
            Finish Quiz
          </button>
        </div>
      )}
    </div>
  );
}
