import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface ClassSchedule {
  time: string;
  subject?: string;
  duration?: string;
  classCode?: string;
  isEmpty?: boolean;
}

interface RecentClassesSectionProps {
  classes: ClassSchedule[];
  selectedDay?: string;
  onDayChange?: (day: string) => void;
}

export default function RecentClassesSection({
  classes,
  selectedDay = 'Today',
  onDayChange,
}: RecentClassesSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dayOptions = ['Today', 'Tomorrow', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const subjectColors: Record<string, string> = {
    English: 'bg-blue-500',
    Mathematics: 'bg-green-500',
    Physics: 'bg-purple-500',
    Chemistry: 'bg-red-500',
    Biology: 'bg-yellow-500',
  };

  const getClassColor = (subject?: string) =>
    subjectColors[subject as keyof typeof subjectColors] || 'bg-gray-500';

  const scheduledCount = classes.filter((c) => !c.isEmpty).length;

  return (
    <div className="bg-white rounded-2xl border border-[#d6d6d6]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2b2b2b]">Recent classes</h2>
          <p className="text-sm text-[#969696] mt-0.5">
            You have {scheduledCount} class{scheduledCount !== 1 ? 'es' : ''} today
          </p>
        </div>

        {/* Day selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#ffefe9] rounded-full text-sm font-semibold text-[#2b2b2b] hover:bg-orange-100 transition-colors"
          >
            {selectedDay}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {dayOptions.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    onDayChange?.(day);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    day === selectedDay ? 'bg-orange-50 text-[#fd5d26] font-medium' : 'text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule list */}
      <div className="px-5 pb-5 space-y-3">
        {classes.map((classItem, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-16 text-sm font-medium text-[#2b2b2b] flex-shrink-0">
              {classItem.time}
            </span>

            {classItem.isEmpty ? (
              <>
                <span className="text-[#fd5d26] text-xs font-bold">»</span>
                <div className="flex-1 border-b border-dashed border-gray-300" />
              </>
            ) : (
              <>
                <span className="text-[#fd5d26] text-xs font-bold">»</span>
                <div className="flex-1 border border-[#d6d6d6] rounded-xl px-3 py-2 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getClassColor(classItem.subject)}`}
                  >
                    <span className="text-white text-xs font-medium">
                      {classItem.subject?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#2b2b2b] text-sm truncate">
                      {classItem.subject}
                    </p>
                    <p className="text-xs text-[#6b6b6b] truncate">
                      {[classItem.duration, classItem.classCode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {classes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No classes scheduled</p>
            <p className="text-gray-400 text-xs mt-1">Your schedule will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
