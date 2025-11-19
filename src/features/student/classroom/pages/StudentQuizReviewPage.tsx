import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import StudentQuizQuestion from '../components/quiz/StudentQuizQuestion';
import { StudentQuiz } from '../types/classroom.types';

export default function StudentQuizReviewPage() {
  const navigate = useNavigate();
  const { subjectId, quizId } = useParams();

  // TODO: Replace with actual API call - using mock submitted quiz data
  const mockSubmittedQuiz: StudentQuiz = {
    id: quizId || '1',
    title: 'Introduction to biology',
    subjectId: subjectId || '1',
    dueDate: '2023-09-15',
    dueTime: '14:00',
    duration: 20,
    instruction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'graded',
    score: 10,
    totalPoints: 15,
    submittedAt: '2023-09-15T12:43:00',
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

  // Mock student answers
  const studentAnswers = new Map<string, string[]>([
    ['1', ['D']], // Partially correct
    ['2', ['A']], // Correct
    ['3', ['D']]  // Correct
  ]);

  const handleGoBack = () => {
    navigate(`/student/classroom/subject/${subjectId}`);
  };

  const formatSubmittedDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  const scorePercentage = mockSubmittedQuiz.totalPoints
    ? Math.round(((mockSubmittedQuiz.score || 0) / mockSubmittedQuiz.totalPoints) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-medium text-gray-600">Quiz Review</h2>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Quiz Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockSubmittedQuiz.title}</h1>
              {mockSubmittedQuiz.submittedAt && (
                <p className="text-sm text-gray-600">
                  Submitted: {formatSubmittedDate(mockSubmittedQuiz.submittedAt)}
                </p>
              )}
            </div>

            {/* Score Badge */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-orange-500 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-gray-900">{scorePercentage}%</span>
              </div>
              <p className="text-sm text-gray-600">
                {mockSubmittedQuiz.score}/{mockSubmittedQuiz.totalPoints} points
              </p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">
                Correct: <span className="font-medium text-gray-900">2</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-gray-600">
                Incorrect: <span className="font-medium text-gray-900">1</span>
              </span>
            </div>
          </div>
        </div>

        {/* Questions with Answers */}
        <div className="space-y-6">
          {mockSubmittedQuiz.questions?.map((question, index) => (
            <StudentQuizQuestion
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedAnswers={studentAnswers.get(question.id) || []}
              onAnswerSelect={() => {}} // Read-only mode
              showCorrect={true}
            />
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="w-full py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg"
        >
          Back to Quiz List
        </button>
      </div>
    </div>
  );
}
