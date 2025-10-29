import { ChevronsRight } from 'lucide-react';

// Mock data for student timetable - keeping until timetable endpoint is provided
const mockTimetableData = {
  'Monday-08:00am': { subjectName: 'Further M...', duration: '1hr', icon: '📚', iconColor: 'text-blue-600' },
  'Tuesday-08:00am': { subjectName: 'English', duration: '1hr 30mins', icon: '🟢', iconColor: 'text-green-600' },
  'Wednesday-08:00am': { subjectName: 'Biology', duration: '50mins', icon: '🧬', iconColor: 'text-orange-600' },
  'Friday-08:00am': { subjectName: 'Chemistry', duration: '50mins', icon: '🧪', iconColor: 'text-yellow-600' },

  'Tuesday-09:00am': { subjectName: 'Biology', duration: '50mins', icon: '🧬', iconColor: 'text-orange-600' },
  'Thursday-09:00am': { subjectName: 'Further M...', duration: '1hr', icon: '📚', iconColor: 'text-blue-600' },

  'Monday-10:00am': { subjectName: 'English', duration: '1hr 30mins', icon: '🟢', iconColor: 'text-green-600' },
  'Wednesday-10:00am': { subjectName: 'Chemistry', duration: '50mins', icon: '🧪', iconColor: 'text-yellow-600' },
  'Friday-10:00am': { subjectName: 'Further M...', duration: '1hr', icon: '📚', iconColor: 'text-blue-600' },

  'Tuesday-11:00am': { subjectName: 'Further M...', duration: '1hr', icon: '📚', iconColor: 'text-blue-600' },

  'Monday-12:00pm': { subjectName: 'Chemistry', duration: '50mins', icon: '🧪', iconColor: 'text-yellow-600' },
  'Wednesday-12:00pm': { subjectName: 'Further M...', duration: '1hr', icon: '📚', iconColor: 'text-blue-600' },
  'Thursday-12:00pm': { subjectName: 'Biology', duration: '50mins', icon: '🧬', iconColor: 'text-orange-600' },

  'Tuesday-01:00pm': { subjectName: 'English', duration: '1hr 30mins', icon: '🟢', iconColor: 'text-green-600' },
  'Thursday-01:00pm': { subjectName: 'English', duration: '1hr 30mins', icon: '🟢', iconColor: 'text-green-600' },

  'Monday-02:00pm': { subjectName: 'Biology', duration: '50mins', icon: '🧬', iconColor: 'text-orange-600' },
  'Wednesday-02:00pm': { subjectName: 'Biology', duration: '50mins', icon: '🧬', iconColor: 'text-orange-600' },

  'Tuesday-03:00pm': { subjectName: 'Chemistry', duration: '50mins', icon: '🧪', iconColor: 'text-yellow-600' },
  'Thursday-03:00pm': { subjectName: 'Further M...', duration: '1hr', icon: '📚', iconColor: 'text-blue-600' },
};

export default function TimetableView() {
  const timeSlots = [
    '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm',
    '01:00pm', '02:00pm', '03:00pm'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-4">
      {/* Timetable Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-0 border-b border-gray-200">
          <div className="p-4 bg-gray-50 font-medium text-gray-700">Time</div>
          {days.map((day) => (
            <div key={day} className="p-4 bg-gray-50 font-medium text-gray-700 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-6 gap-0 border-b border-gray-200 last:border-b-0">
            <div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm flex items-center gap-2">
              <span>{time}</span>
              <ChevronsRight className="w-4 h-4 text-orange-500" />
            </div>
            {days.map((day) => {
              const key = `${day}-${time}`;
              const subject = mockTimetableData[key as keyof typeof mockTimetableData];

              return (
                <div key={key} className="p-3 h-24 flex items-center justify-center">
                  {subject ? (
                    <div
                      className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2.5 transition-all hover:shadow-md cursor-pointer min-w-0"
                      title={`${subject.subjectName} - ${subject.duration}`}
                    >
                      <div className="text-2xl flex-shrink-0">
                        {subject.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 leading-tight truncate">
                          {subject.subjectName}
                        </div>
                        <div className="text-xs text-gray-500 leading-tight mt-0.5">
                          {subject.duration}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
