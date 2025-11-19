import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import RichTextEditor from '@/common/components/RichTextEditor';
import TimePicker from '@/common/components/TimePicker';
import AddQuestionModal from '../components/AddQuestionModal';
import { QuizQuestion, Quiz } from '../../classroom/types/classroom.types';

// Mock function to get existing quiz
const getMockQuiz = (quizId: string): Quiz => ({
  id: quizId,
  title: 'Introduction to biology',
  instruction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at.',
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
      type: 'text-only',
      options: [
        { label: 'A', value: 'Reptiles' },
        { label: 'B', value: 'Mammals' },
        { label: 'C', value: 'Birds' },
      ],
      correctAnswers: ['A'],
      points: 1,
    },
    {
      id: 'q3',
      question: 'What class of animal does the following belong to?',
      type: 'text-only',
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

export default function EditQuizPage() {
  const { subjectId, quizId } = useParams<{ subjectId: string; quizId: string }>();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [duration, setDuration] = useState('00:20');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('14:00');
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | undefined>();

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing quiz data
  useEffect(() => {
    if (quizId) {
      // TODO: Fetch quiz from API
      const quiz = getMockQuiz(quizId);
      setTitle(quiz.title);
      setInstruction(quiz.instruction || '');

      // Convert duration to HH:MM format
      const hours = Math.floor(quiz.duration / 60);
      const minutes = quiz.duration % 60;
      setDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);

      setDueDate(quiz.dueDate);
      setDueTime(quiz.dueTime);
      setAllowLateSubmission(quiz.allowLateSubmission);
      setQuestions(quiz.questions);
    }
  }, [quizId]);

  const handleAddQuestion = (question: Omit<QuizQuestion, 'id'>) => {
    if (editingIndex !== undefined && editingQuestion) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = {
        ...question,
        id: editingQuestion.id,
      };
      setQuestions(updatedQuestions);
      setEditingQuestion(undefined);
      setEditingIndex(undefined);
    } else {
      // Add new question
      const newQuestion: QuizQuestion = {
        ...question,
        id: uuidv4(),
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestion(questions[index]);
    setEditingIndex(index);
    setIsQuestionModalOpen(true);
  };

  const handleRemoveQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!duration) newErrors.duration = 'Duration is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!dueTime) newErrors.dueTime = 'Due time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;

    // TODO: Update quiz via API
    console.log('Updating quiz:', {
      id: quizId,
      title,
      instruction,
      duration,
      dueDate,
      dueTime,
      allowLateSubmission,
      questions,
    });

    alert('Quiz updated successfully!');
    navigate(`/teacher/subject/${subjectId}/quiz/${quizId}`);
  };

  const handlePreview = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    // Navigate to preview page with quiz data
    const quizData = {
      id: quizId,
      title,
      instruction,
      duration: parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]),
      dueDate,
      dueTime,
      allowLateSubmission,
      questions,
      subjectId,
    };

    navigate(`/teacher/subject/${subjectId}/quiz/${quizId}/preview`, { state: { quizData } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}/quiz/${quizId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Instruction (Rich Text Editor) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instruction <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={instruction}
                onChange={setInstruction}
                placeholder="Enter detailed instruction for students"
                error={errors.instruction}
              />
            </div>
          </form>
        </div>

        {/* Right Side - Duration & Schedule */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="space-y-6">
            {/* Duration */}
            <TimePicker
              label="Duration *"
              value={duration}
              onChange={setDuration}
              error={errors.duration}
            />

            {/* Schedule Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule due date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
            </div>

            {/* Schedule Due Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule due time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dueTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueTime && <p className="mt-1 text-sm text-red-600">{errors.dueTime}</p>}
            </div>

            {/* Accept Submission After Due Date */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Accept submission after due date:
              </label>
              <button
                type="button"
                onClick={() => setAllowLateSubmission(!allowLateSubmission)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  allowLateSubmission ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    allowLateSubmission ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Questions Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Questions</h2>

        {questions.length > 0 && (
          <div className="space-y-3 mb-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                  <p className="text-sm text-gray-600 mt-1">{question.question}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEditQuestion(index)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setEditingQuestion(undefined);
            setEditingIndex(undefined);
            setIsQuestionModalOpen(true);
          }}
          className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add Question
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handlePreview}
          className="flex-1 px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
        >
          Preview Changes
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Save Changes
        </button>
      </div>

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingQuestion(undefined);
          setEditingIndex(undefined);
        }}
        onAdd={handleAddQuestion}
        editQuestion={editingQuestion}
        questionNumber={editingIndex !== undefined ? editingIndex + 1 : questions.length + 1}
      />
    </div>
  );
}
