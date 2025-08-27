import { Plus } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  duration: string;
  color: string;
  icon?: string;
}

interface TimetableViewProps {
  selectedClass: string;
  hasTimetable: boolean;
  mockTimetableData: { [key: string]: Subject | null };
  onClassChange: (className: string) => void;
  onAddTimetable: () => void;
}

export default function TimetableView({
  selectedClass,
  hasTimetable,
  mockTimetableData,
  onClassChange,
  onAddTimetable,
}: TimetableViewProps) {
  const timeSlots = [
    '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', 
    '01:00pm', '02:00pm', '03:00pm'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const classes = ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];

  return (
    <div className="space-y-4">
      {/* Class Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Class:</span>
          <select 
            value={selectedClass} 
            onChange={(e) => onClassChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {hasTimetable && (
          <button
            onClick={onAddTimetable}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add timetable</span>
          </button>
        )}
      </div>

      {hasTimetable ? (
        /* Timetable Grid */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-6 gap-0 border-b border-gray-200">
            <div className="p-4 bg-gray-50 font-medium text-gray-700">Time</div>
            {days.map((day) => (
              <div key={day} className="p-4 bg-gray-50 font-medium text-gray-700 text-center">
                {day}
              </div>
            ))}
          </div>
          
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 gap-0 border-b border-gray-200 last:border-b-0">
              <div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm">
                {time}
              </div>
              {days.map((day) => {
                const key = `${day}-${time}`;
                const subject = mockTimetableData[key];
                
                return (
                  <div key={key} className="p-2 h-20 flex items-center justify-center">
                    {subject ? (
                      <div className={`w-full h-full rounded-lg border-2 ${subject.color} p-2 flex flex-col justify-center items-center text-center`}>
                        <div className="text-lg mb-1">{subject.icon}</div>
                        <div className="text-xs font-medium text-gray-700 truncate">
                          {subject.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {subject.duration}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Free</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        /* Empty Timetable State */
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No timetable yet</h3>
          <p className="text-gray-600 mb-6">
            Create a timetable to help students and teachers know their daily schedule
          </p>
          <button
            onClick={onAddTimetable}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create timetable
          </button>
        </div>
      )}
    </div>
  );
}