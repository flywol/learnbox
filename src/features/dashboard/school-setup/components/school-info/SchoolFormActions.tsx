interface SchoolFormActionsProps {
  isValid: boolean;
  isSubmitting: boolean;
}

export default function SchoolFormActions({ isValid, isSubmitting }: SchoolFormActionsProps) {
  return (
    <div className="flex justify-end mt-8">
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          isValid && !isSubmitting
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        {isSubmitting ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}