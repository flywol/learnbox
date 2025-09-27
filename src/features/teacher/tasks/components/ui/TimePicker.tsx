import { useState } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  error?: string;
}

export default function TimePicker({ value, onChange, placeholder = "Schedule time", error }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('1');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Parse existing value when component mounts or value changes
  useState(() => {
    if (value) {
      const [time, periodPart] = value.split(' ');
      const [h, m] = time.split(':');
      setHour(h);
      setMinute(m);
      setPeriod(periodPart as 'AM' | 'PM');
    }
  });

  const handleTimeSelect = () => {
    const formattedTime = `${hour}:${minute} ${period}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  const displayTime = value || placeholder;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer flex items-center justify-between ${
          error ? 'border-red-300' : 'border-gray-300'
        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {displayTime}
        </span>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Input Time Picker
            </h3>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Enter time</p>
            
            <div className="flex items-center gap-2 mb-4">
              {/* Hour Input */}
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-16 h-12 text-center border-2 border-orange-500 rounded text-lg font-medium"
                  maxLength={2}
                />
                <span className="text-xs text-gray-500 mt-1">Hour</span>
              </div>

              <span className="text-2xl font-bold text-gray-600">:</span>

              {/* Minute Input */}
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-16 h-12 text-center border border-gray-300 rounded text-lg font-medium bg-gray-100"
                  maxLength={2}
                />
                <span className="text-xs text-gray-500 mt-1">Minute</span>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setPeriod('AM')}
                  className={`px-3 py-2 text-sm rounded-t ${
                    period === 'AM' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('PM')}
                  className={`px-3 py-2 text-sm rounded-b ${
                    period === 'PM' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <Clock className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTimeSelect}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
}