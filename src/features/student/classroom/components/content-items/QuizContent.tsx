import { BarChart3 } from "lucide-react";
import { LessonContentItem } from "../../types/classroom.types";

interface QuizContentProps {
  contentItem: LessonContentItem;
}

export default function QuizContent({ contentItem }: QuizContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Quiz Header */}
      <div className="flex items-start gap-4">
        <div className="bg-purple-100 p-4 rounded-xl">
          <BarChart3 className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{contentItem.title}</h2>
          {contentItem.description && (
            <p className="text-gray-600 text-lg mt-2">{contentItem.description}</p>
          )}
        </div>
      </div>

      {/* Quiz Placeholder - Will integrate with existing quiz system */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Quiz: {contentItem.title}</p>
          <p className="text-gray-500 mb-6">{contentItem.description}</p>

          {/* This will integrate with the existing StudentQuizTakingPage */}
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Start Quiz
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Quiz integration coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
