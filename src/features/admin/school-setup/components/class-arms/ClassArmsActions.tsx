interface ClassArmsActionsProps {
  onPreviousStep: () => void;
  onComplete: () => void;
  isCompleting: boolean;
}

export default function ClassArmsActions({ 
  onPreviousStep, 
  onComplete, 
  isCompleting 
}: ClassArmsActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <button
        type="button"
        onClick={onPreviousStep}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        disabled={isCompleting}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onComplete}
        disabled={isCompleting}
        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isCompleting ? "Completing Setup..." : "Complete Setup"}
      </button>
    </div>
  );
}