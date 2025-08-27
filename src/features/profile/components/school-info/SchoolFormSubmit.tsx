interface SchoolFormSubmitProps {
  isSubmitting: boolean;
  submitText?: string;
  submittingText?: string;
}

export default function SchoolFormSubmit({
  isSubmitting,
  submitText = "Update School Information",
  submittingText = "Updating..."
}: SchoolFormSubmitProps) {
  return (
    <div className="flex justify-center pt-6">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full max-w-md px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting ? submittingText : submitText}
      </button>
    </div>
  );
}