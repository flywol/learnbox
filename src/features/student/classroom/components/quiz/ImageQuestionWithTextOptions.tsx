import { QuizOption } from '../../types/classroom.types';

interface ImageQuestionWithTextOptionsProps {
  questionImage: string;
  options: QuizOption[];
  selectedAnswers: string[];
  onSelect: (label: string) => void;
  showCorrect?: boolean;
  correctAnswers?: string[];
}

export default function ImageQuestionWithTextOptions({
  questionImage,
  options,
  selectedAnswers,
  onSelect,
  showCorrect = false,
  correctAnswers = []
}: ImageQuestionWithTextOptionsProps) {
  const isSelected = (label: string) => selectedAnswers.includes(label);
  const isCorrect = (label: string) => correctAnswers.includes(label);
  const isWrong = (label: string) => isSelected(label) && !isCorrect(label);

  return (
    <div className="space-y-4">
      {/* Question Image */}
      <div className="flex justify-center">
        <img
          src={questionImage || '/placeholder-image.png'}
          alt="Question"
          className="max-w-sm w-full h-auto rounded-lg border border-gray-200"
        />
      </div>

      {/* Text Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.label}
            onClick={() => !showCorrect && onSelect(option.label)}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
              showCorrect
                ? isCorrect(option.label)
                  ? 'border-green-500 bg-green-50'
                  : isWrong(option.label)
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200'
                : isSelected(option.label)
                ? 'border-red-500 bg-red-50 cursor-pointer'
                : 'border-gray-200 hover:border-gray-300 cursor-pointer'
            }`}
          >
            {/* Radio Circle */}
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                showCorrect
                  ? isCorrect(option.label)
                    ? 'border-green-500'
                    : isWrong(option.label)
                    ? 'border-red-500'
                    : 'border-gray-300'
                  : isSelected(option.label)
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              {isSelected(option.label) && (
                <div
                  className={`w-3 h-3 rounded-full ${
                    showCorrect
                      ? isCorrect(option.label)
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-red-500'
                  }`}
                />
              )}
              {showCorrect && isCorrect(option.label) && !isSelected(option.label) && (
                <div className="w-3 h-3 rounded-full bg-green-500" />
              )}
            </div>

            {/* Label and Value */}
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-gray-700">{option.label}</span>
              <span className="text-gray-900">{option.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
