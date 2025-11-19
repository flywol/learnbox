import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { Quiz } from '../../classroom/types/classroom.types';

// Mock quiz data - will be replaced with API call
const getMockQuiz = (quizId: string): Quiz => ({
  id: quizId,
  title: 'Introduction to biology',
  instruction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra diam lectus odio orci...',
  duration: 20, // 20 minutes
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

export default function TeacherQuizViewPage() {
  const { quizId, subjectId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (quizId) {
      // TODO: Fetch quiz from API
      const mockQuiz = getMockQuiz(quizId);
      setQuiz(mockQuiz);
      setTimeRemaining(mockQuiz.duration * 60);

      // Set sample answers to show correct answers in preview
      const sampleAnswers: Record<string, string[]> = {};
      mockQuiz.questions.forEach((question) => {
        sampleAnswers[question.id] = question.correctAnswers;
      });
      setSelectedAnswers(sampleAnswers);
    }
  }, [quizId]);

  useEffect(() => {
    if (!quiz) return;

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
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
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

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${formattedDate}, ${hour12}:${minutes} ${ampm}`;
  };

  const calculateProgress = () => {
    const answered = Object.keys(selectedAnswers).filter(
      (qId) => selectedAnswers[qId].length > 0
    ).length;
    return { answered, total: quiz.questions.length };
  };

  const handleViewSubmissions = () => {
    navigate(`/teacher/subject/${subjectId}/quiz/${quizId}/submissions`);
  };

  const handleEditQuiz = () => {
    navigate(`/teacher/subject/${subjectId}/quiz/${quizId}/edit`);
  };

  const handleDeleteQuiz = () => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      // TODO: Delete quiz via API
      console.log('Deleting quiz:', quizId);
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
              onClick={() => navigate(`/teacher/subject/${subjectId}`)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Preview</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(timeRemaining)}
              <div className="text-xs text-gray-500 font-normal text-center">Time</div>
            </div>

            {/* View Submissions Button */}
            <button
              onClick={handleViewSubmissions}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              View submissions
            </button>
          </div>
        </div>

        {/* Quiz Container */}
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

          {/* Due Date and Progress */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <span className="text-sm text-gray-600">Due date: </span>
              <span className="text-sm font-medium text-gray-900">
                {formatDueDate(quiz.dueDate, quiz.dueTime)}
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
            {quiz.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedAnswers={selectedAnswers[question.id] || []}
                mode="preview"
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleDeleteQuiz}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Delete Quiz
            </button>
            <button
              onClick={handleEditQuiz}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Edit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
