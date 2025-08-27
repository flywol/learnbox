import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface AddEventFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export default function AddEventForm({ onCancel, onSubmit }: AddEventFormProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-3 items-center">
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <h3 className="text-xl font-semibold text-center">Add event</h3>
        <div />
      </div>

      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
          <textarea
            placeholder="Enter event description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
            maxLength={100}
          />
          <p className="text-gray-500 text-xs mt-1">Maximum 100 characters</p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
            />
            <CalendarIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none pr-10">
              <option value="">Select event type</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="class">Class</option>
              <option value="trip">School Trip</option>
              <option value="holiday">Holiday</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Specify Receiver */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specify receiver</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none pr-10">
              <option>Everyone</option>
              <option>Students</option>
              <option>Teachers</option>
              <option>Parents</option>
              <option>Specific Class</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Repeat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none pr-10">
              <option>Does not repeat</option>
              <option>Every day</option>
              <option>Every week</option>
              <option>Every month</option>
              <option>Every year</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Time (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time (Optional)</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              placeholder="Start time"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="time"
              placeholder="End time"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={onSubmit}
          className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Add Event
        </button>
      </div>
    </div>
  );
}