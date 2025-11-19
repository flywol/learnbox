import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import Modal from '@/common/components/Modal';
import ImageUpload from '@/common/components/ImageUpload';
import { QuizQuestion, QuizOption, QuestionType } from '../../classroom/types/classroom.types';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: Omit<QuizQuestion, 'id'>) => void;
  editQuestion?: QuizQuestion;
  questionNumber?: number;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function AddQuestionModal({
  isOpen,
  onClose,
  onAdd,
  editQuestion,
  questionNumber
}: AddQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('text-only');
  const [questionImage, setQuestionImage] = useState<string>('');
  const [options, setOptions] = useState<QuizOption[]>([
    { label: 'A', value: '', image: '' },
    { label: 'B', value: '', image: '' },
    { label: 'C', value: '', image: '' },
    { label: 'D', value: '', image: '' },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [points, setPoints] = useState(1);

  // Load edit data if editing
  useEffect(() => {
    if (editQuestion) {
      setQuestion(editQuestion.question);
      setQuestionType(editQuestion.type);
      setQuestionImage(editQuestion.image || '');
      setOptions(editQuestion.options);
      setCorrectAnswers(editQuestion.correctAnswers);
      setPoints(editQuestion.points);
    } else {
      // Reset form
      setQuestion('');
      setQuestionType('text-only');
      setQuestionImage('');
      setOptions([
        { label: 'A', value: '', image: '' },
        { label: 'B', value: '', image: '' },
        { label: 'C', value: '', image: '' },
        { label: 'D', value: '', image: '' },
      ]);
      setCorrectAnswers([]);
      setPoints(1);
    }
  }, [editQuestion, isOpen]);

  const handleOptionChange = (index: number, field: 'value' | 'image', value: string | null) => {
    const newOptions = [...options];
    if (field === 'image') {
      newOptions[index].image = value || '';
    } else {
      newOptions[index].value = value || '';
    }
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < OPTION_LABELS.length) {
      const newLabel = OPTION_LABELS[options.length];
      setOptions([...options, { label: newLabel, value: '', image: '' }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);

      // Remove from correct answers if it was selected
      const removedLabel = options[index].label;
      setCorrectAnswers(correctAnswers.filter((label) => label !== removedLabel));
    }
  };

  const toggleCorrectAnswer = (label: string) => {
    if (correctAnswers.includes(label)) {
      setCorrectAnswers(correctAnswers.filter((l) => l !== label));
    } else {
      setCorrectAnswers([...correctAnswers, label]);
    }
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (options.some((opt) => !opt.value.trim() && questionType === 'text-only')) {
      alert('Please fill in all option values');
      return;
    }

    if (options.some((opt) => !opt.image && questionType === 'text-with-image')) {
      alert('Please upload images for all options');
      return;
    }

    if (correctAnswers.length === 0) {
      alert('Please select at least one correct answer');
      return;
    }

    const newQuestion: Omit<QuizQuestion, 'id'> = {
      question: question.trim(),
      type: questionType,
      image: questionImage || undefined,
      options: options.map((opt) => ({
        label: opt.label,
        value: opt.value.trim(),
        image: questionType === 'text-with-image' ? opt.image : undefined,
      })),
      correctAnswers,
      points,
    };

    onAdd(newQuestion);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editQuestion ? 'Edit Question' : 'Add Question'}
            {questionNumber && ` ${questionNumber}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Which of the following is cold-blooded?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Question Image (Optional) */}
          <ImageUpload
            label="Upload Image (Optional)"
            value={questionImage}
            onChange={(value) => setQuestionImage(value || '')}
          />

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text-only">Text only</option>
              <option value="text-with-image">Text with image</option>
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options <span className="text-red-500">*</span>
            </label>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={option.label} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        {option.label}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                        placeholder={`Value for option ${option.label}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {questionType === 'text-with-image' && (
                        <ImageUpload
                          value={option.image}
                          onChange={(value) => handleOptionChange(index, 'image', value)}
                          showPreview
                        />
                      )}
                    </div>

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="flex-shrink-0 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {options.length < OPTION_LABELS.length && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add New Options
              </button>
            )}
          </div>

          {/* Correct Answers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer(s) <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => toggleCorrectAnswer(option.label)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      correctAnswers.includes(option.label)
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    {correctAnswers.includes(option.label) && (
                      <X className="inline w-3 h-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click to select/deselect. Multiple answers allowed.
              </p>
            </div>
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            {editQuestion ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
