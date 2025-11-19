import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // Format: "HH:MM" (e.g., "01:30")
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  showLabel?: boolean;
}

export default function TimePicker({
  value,
  onChange,
  label = 'Time',
  error,
  placeholder = 'Select time',
  showLabel = true
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse value when it changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hour = parseInt(h);

      if (hour === 0) {
        setHours('12');
        setPeriod('AM');
      } else if (hour < 12) {
        setHours(hour.toString());
        setPeriod('AM');
      } else if (hour === 12) {
        setHours('12');
        setPeriod('PM');
      } else {
        setHours((hour - 12).toString());
        setPeriod('PM');
      }

      setMinutes(m);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = () => {
    if (hours && minutes) {
      let hour24 = parseInt(hours);

      if (period === 'AM') {
        if (hour24 === 12) hour24 = 0;
      } else {
        if (hour24 !== 12) hour24 += 12;
      }

      const timeString = `${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      onChange(timeString);
      setIsOpen(false);
    }
  };

  const displayValue = value
    ? `${hours || '00'}:${minutes || '00'} ${period}`
    : '';

  return (
    <div className="relative" ref={dropdownRef}>
      {showLabel && label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-2">Enter time</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="HH"
                  className="w-full px-3 py-2 border border-orange-500 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 text-center mt-1">Hour</p>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value.padStart(2, '0'))}
                  placeholder="MM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 text-center mt-1">Minute</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setPeriod('AM')}
                  className={`px-3 py-1 rounded text-sm ${
                    period === 'AM'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('PM')}
                  className={`px-3 py-1 rounded text-sm ${
                    period === 'PM'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSelect}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              disabled={!hours || !minutes}
            >
              Select
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
