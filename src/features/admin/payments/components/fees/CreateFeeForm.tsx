import { Upload } from 'lucide-react';

interface CreateFeeFormProps {
  onCancel: () => void;
  classLevels: string[];
  sessions: string[];
  terms: string[];
  feeTypes: string[];
}

export default function CreateFeeForm({ 
  onCancel, 
  classLevels, 
  sessions, 
  terms, 
  feeTypes 
}: CreateFeeFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Create New Fee</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Class Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class level
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
              <option value="">Select class level</option>
              {classLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
              <option value="">Select session</option>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
              <option value="">Select term</option>
              {terms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fee type
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
              <option value="">Select fee type</option>
              {feeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₦)
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload fee document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOC, DOCX (max. 10MB)
            </p>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Choose File
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Create Fee
          </button>
        </div>
      </div>
    </div>
  );
}