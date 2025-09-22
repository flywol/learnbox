interface EditFormActionsProps {
  onCancel: () => void;
  loading: boolean;
}

export default function EditFormActions({ onCancel, loading }: EditFormActionsProps) {
  return (
    <div className="flex justify-between pt-6 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Saving changes..." : "Save changes"}
      </button>
    </div>
  );
}