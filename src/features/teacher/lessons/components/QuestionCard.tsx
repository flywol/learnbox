import { QuizQuestion } from '../../classroom/types/classroom.types';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswers?: string[]; // For preview/submission view
  showCorrectAnswers?: boolean; // For grading view
  onAnswerSelect?: (answers: string[]) => void; // For interactive mode
  mode?: 'preview' | 'submission' | 'grading'; // Display mode
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswers = [],
  showCorrectAnswers = false,
  onAnswerSelect,
  mode = 'preview'
}: QuestionCardProps) {
  const isMultiSelect = question.correctAnswers.length > 1;

  const handleOptionClick = (label: string) => {
    if (!onAnswerSelect) return;

    if (isMultiSelect) {
      // Multi-select: toggle selection
      if (selectedAnswers.includes(label)) {
        onAnswerSelect(selectedAnswers.filter((l) => l !== label));
      } else {
        onAnswerSelect([...selectedAnswers, label]);
      }
    } else {
      // Single select: replace selection
      onAnswerSelect([label]);
    }
  };

  const isCorrectAnswer = (label: string) => {
    return question.correctAnswers.includes(label);
  };

  const isSelected = (label: string) => {
    return selectedAnswers.includes(label);
  };

  const getOptionStyle = (label: string) => {
    // Grading mode: show correct/incorrect
    if (mode === 'grading' && showCorrectAnswers) {
      if (isSelected(label)) {
        return isCorrectAnswer(label)
          ? 'border-green-500 bg-green-50' // Correct answer selected
          : 'border-red-500 bg-red-50'; // Wrong answer selected
      }
      return 'border-gray-200';
    }

    // Preview/submission mode: just show selected
    if (isSelected(label)) {
      return 'border-orange-500 bg-orange-50';
    }

    return 'border-gray-200 hover:border-gray-300';
  };

  const getIndicatorIcon = (label: string) => {
    if (mode === 'grading' && showCorrectAnswers && isSelected(label)) {
      if (isCorrectAnswer(label)) {
        return (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      } else {
        return (
          <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      }
    }

    // Show selection indicator in preview mode
    if (isSelected(label)) {
      return (
        <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-8">
      {/* Question Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Question {questionNumber}
          {mode === 'grading' && (
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({question.points} point{question.points !== 1 ? 's' : ''})
            </span>
          )}
        </h3>
        <p className="text-gray-700">{question.question}</p>
        {question.image && (
          <div className="mt-3">
            <img
              src={question.image}
              alt="Question"
              className="max-w-md rounded-lg border border-gray-200"
            />
          </div>
        )}
        {isMultiSelect && mode !== 'grading' && (
          <p className="text-sm text-gray-500 mt-2 italic">Select all that apply</p>
        )}
      </div>

      {/* Options */}
      {question.type === 'text-only' ? (
        // Text-only options (list view)
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleOptionClick(option.label)}
              disabled={!onAnswerSelect}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all relative ${getOptionStyle(
                option.label
              )} ${onAnswerSelect ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                <span className="flex-1 text-gray-800">{option.value}</span>
              </div>
              {getIndicatorIcon(option.label)}
            </button>
          ))}
        </div>
      ) : (
        // Text-with-image options (grid view)
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleOptionClick(option.label)}
              disabled={!onAnswerSelect}
              className={`p-4 border-2 rounded-lg transition-all relative ${getOptionStyle(
                option.label
              )} ${onAnswerSelect ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="text-left">
                <span className="inline-block mb-2 px-2 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                {option.image && (
                  <div className="mb-2">
                    <img
                      src={option.image}
                      alt={`Option ${option.label}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                {option.value && (
                  <p className="text-sm text-gray-700 mt-2">{option.value}</p>
                )}
              </div>
              {getIndicatorIcon(option.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
