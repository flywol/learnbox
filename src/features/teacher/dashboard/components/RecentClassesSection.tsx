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
  selectedDay = "Today",
  onDayChange
}: RecentClassesSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dayOptions = ["Today", "Tomorrow", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getClassIcon = (subject?: string) => {
    // Return a colored circle based on subject
    const colors = {
      'English': 'bg-blue-500',
      'Mathematics': 'bg-green-500', 
      'Physics': 'bg-purple-500',
      'Chemistry': 'bg-red-500',
      'Biology': 'bg-yellow-500',
    };
    
    return colors[subject as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent classes</h2>
        
        {/* Day Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
                    day === selectedDay ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule List */}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-4">
          You have {classes.filter(c => !c.isEmpty).length} classes today
        </div>
        
        <div className="space-y-3">
          {classes.map((classItem, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Time */}
              <div className="w-16 text-sm font-medium text-gray-700">
                {classItem.time}
              </div>
              
              {/* Arrow */}
              <div className="text-orange-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Class Details or Empty Slot */}
              <div className="flex-1">
                {classItem.isEmpty ? (
                  <div className="border-b border-dashed border-gray-300 h-px"></div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Subject Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getClassIcon(classItem.subject)}`}>
                      <span className="text-white text-xs font-medium">
                        {classItem.subject?.charAt(0) || 'C'}
                      </span>
                    </div>
                    
                    {/* Class Info */}
                    <div>
                      <div className="font-medium text-gray-900">{classItem.subject}</div>
                      <div className="text-xs text-gray-500">
                        {classItem.duration && `${classItem.duration}, `}
                        {classItem.classCode}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
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