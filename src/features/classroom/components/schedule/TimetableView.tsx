import { Plus } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  duration: string;
  color: string;
  icon: string;
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

        <button
          onClick={onAddTimetable}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{hasTimetable ? 'Edit timetable' : 'Add timetable'}</span>
        </button>
      </div>

      {/* Timetable Grid - Always Show Structure */}
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
              const subject = hasTimetable ? mockTimetableData[key] : null;
              
              return (
                <div key={key} className="p-2 h-24 flex items-center justify-center">
                  {subject ? (
                    <div className={`w-full h-full rounded-lg ${subject.color} p-3 flex flex-col justify-center items-center text-center`}>
                      <div className="w-5 h-5 mb-1 flex-shrink-0">
                        <img src={subject.icon} alt={subject.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs font-semibold text-gray-900 mb-1 leading-tight">
                        {subject.name}
                      </div>
                      <div className="text-xs text-gray-600 leading-tight">
                        {subject.duration}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}