import { StudentQuizQuestion as QuizQuestionType } from '../../types/classroom.types';
import TextOnlyOptions from './TextOnlyOptions';
import ImageGridOptions from './ImageGridOptions';
import ImageQuestionWithTextOptions from './ImageQuestionWithTextOptions';

interface StudentQuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  selectedAnswers: string[];
  onAnswerSelect: (label: string) => void;
  showCorrect?: boolean;
}

export default function StudentQuizQuestion({
  question,
  questionNumber,
  selectedAnswers,
  onAnswerSelect,
  showCorrect = false
}: StudentQuizQuestionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Question Header */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Question {questionNumber}</h3>
        <p className="text-gray-700">{question.question}</p>
        {question.type === 'text-only' && question.image && (
          <div className="mt-3">
            <img
              src={question.image}
              alt="Question illustration"
              className="max-w-md w-full h-auto rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Options based on question type */}
      {question.type === 'text-only' && (
        <TextOnlyOptions
          options={question.options}
          selectedAnswers={selectedAnswers}
          onSelect={onAnswerSelect}
          showCorrect={showCorrect}
          correctAnswers={question.correctAnswers}
        />
      )}

      {question.type === 'text-with-image' && (
        <ImageGridOptions
          options={question.options}
          selectedAnswers={selectedAnswers}
          onSelect={onAnswerSelect}
          showCorrect={showCorrect}
          correctAnswers={question.correctAnswers}
        />
      )}

      {question.type === 'image-with-text' && question.image && (
        <ImageQuestionWithTextOptions
          questionImage={question.image}
          options={question.options}
          selectedAnswers={selectedAnswers}
          onSelect={onAnswerSelect}
          showCorrect={showCorrect}
          correctAnswers={question.correctAnswers}
        />
      )}
    </div>
  );
}
