import { Clock } from 'lucide-react';

interface AddTimetableFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export default function AddTimetableForm({ onCancel, onSubmit }: AddTimetableFormProps) {
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
        <h3 className="text-xl font-semibold text-center">Add timetable</h3>
        <div />
      </div>

      <div className="space-y-6">
        {/* First Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value="Biology"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            readOnly
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500">
              <option>Day</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Schedule start time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
            />
            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Schedule end time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
              />
              <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm">
              -
            </button>
            <button className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-sm">
              +
            </button>
          </div>
        </div>

        {/* Second Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            placeholder="Enter subject name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500">
              <option>Day</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Schedule start time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
            />
            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Schedule end time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
              />
              <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm">
              -
            </button>
          </div>
        </div>

        {/* Additional subject slots can be added dynamically */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500">
                <option>Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Schedule start time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
              />
              <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Schedule end time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                />
                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <button className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm">
                -
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500">
                <option>Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Schedule start time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
              />
              <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Schedule end time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                />
                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <button className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm">
                -
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={onSubmit}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        Save timetable
      </button>
    </div>
  );
}