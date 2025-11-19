import { QuizOption } from '../../types/classroom.types';

interface ImageGridOptionsProps {
  options: QuizOption[];
  selectedAnswers: string[];
  onSelect: (label: string) => void;
  showCorrect?: boolean;
  correctAnswers?: string[];
}

export default function ImageGridOptions({
  options,
  selectedAnswers,
  onSelect,
  showCorrect = false,
  correctAnswers = []
}: ImageGridOptionsProps) {
  const isSelected = (label: string) => selectedAnswers.includes(label);
  const isCorrect = (label: string) => correctAnswers.includes(label);
  const isWrong = (label: string) => isSelected(label) && !isCorrect(label);

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <div
          key={option.label}
          onClick={() => !showCorrect && onSelect(option.label)}
          className={`relative rounded-lg overflow-hidden border-4 transition-all ${
            showCorrect
              ? isCorrect(option.label)
                ? 'border-green-500'
                : isWrong(option.label)
                ? 'border-red-500'
                : 'border-gray-200'
              : isSelected(option.label)
              ? 'border-red-500 cursor-pointer'
              : 'border-gray-200 hover:border-gray-300 cursor-pointer'
          }`}
        >
          {/* Image */}
          <img
            src={option.image || '/placeholder-image.png'}
            alt={option.value}
            className="w-full h-40 object-cover"
          />

          {/* Label Badge */}
          <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-semibold text-gray-700 shadow-md">
            {option.label}
          </div>

          {/* Radio Circle */}
          <div
            className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
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
                className={`w-4 h-4 rounded-full ${
                  showCorrect
                    ? isCorrect(option.label)
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : 'bg-red-500'
                }`}
              />
            )}
            {showCorrect && isCorrect(option.label) && !isSelected(option.label) && (
              <div className="w-4 h-4 rounded-full bg-green-500" />
            )}
          </div>

          {/* Value Text Overlay */}
          {option.value && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm py-2 px-3">
              {option.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
