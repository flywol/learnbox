import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import QuizSuccessModal from '@/common/components/QuizSuccessModal';
import { QuizQuestion } from '../../classroom/types/classroom.types';

interface QuizPreviewData {
  title: string;
  instruction?: string;
  duration: number; // in minutes
  dueDate: string;
  dueTime: string;
  allowLateSubmission: boolean;
  questions: QuizQuestion[];
  subjectId?: string;
  lessonId?: string;
}

export default function QuizPreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectId, lessonId } = useParams();

  const quizData = location.state?.quizData as QuizPreviewData | undefined;

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!quizData) {
      navigate(-1);
      return;
    }

    // Set initial timer from duration
    setTimeRemaining(quizData.duration * 60); // Convert minutes to seconds

    // Initialize selected answers for preview (show some sample selections)
    const sampleAnswers: Record<string, string[]> = {};
    quizData.questions.forEach((question) => {
      // Select the correct answers for demo
      sampleAnswers[question.id] = question.correctAnswers;
    });
    setSelectedAnswers(sampleAnswers);

    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizData, navigate]);

  if (!quizData) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDueDate = (date: string, time: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = d.toLocaleDateString('en-US', options);

    // Convert 24h time to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${formattedDate}, ${hour12}:${minutes} ${ampm}`;
  };

  const handleAnswerSelect = (questionId: string, answers: string[]) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answers,
    });
  };

  const calculateProgress = () => {
    const answered = Object.keys(selectedAnswers).filter(
      (qId) => selectedAnswers[qId].length > 0
    ).length;
    return { answered, total: quizData.questions.length };
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePublish = async () => {
    // TODO: Save quiz to backend
    console.log('Publishing quiz:', quizData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success modal
    setIsSuccessModalOpen(true);
  };

  const handleAddMore = () => {
    setIsSuccessModalOpen(false);
    navigate(-2); // Go back to content selection page
  };

  const handleViewLesson = () => {
    setIsSuccessModalOpen(false);
    if (lessonId) {
      navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}`);
    } else {
      navigate(`/teacher/subject/${subjectId}`);
    }
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Preview</h1>
          </div>

          {/* Timer */}
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(timeRemaining)}
            <div className="text-xs text-gray-500 font-normal text-center">Time</div>
          </div>
        </div>

        {/* Quiz Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Quiz Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{quizData.title}</h2>

          {/* Instruction */}
          {quizData.instruction && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Instruction</h3>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: quizData.instruction }}
              />
            </div>
          )}

          {/* Due Date and Progress */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <span className="text-sm text-gray-600">Due date: </span>
              <span className="text-sm font-medium text-gray-900">
                {formatDueDate(quizData.dueDate, quizData.dueTime)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Questions: </span>
              <span className="text-sm font-medium text-gray-900">
                {progress.answered} of {progress.total} answered
              </span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {quizData.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedAnswers={selectedAnswers[question.id] || []}
                onAnswerSelect={(answers) => handleAnswerSelect(question.id, answers)}
                mode="preview"
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              Go Back
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <QuizSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        quizTitle={quizData.title}
        onAddMore={handleAddMore}
        onViewLesson={handleViewLesson}
      />
    </div>
  );
}
