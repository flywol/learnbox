import { Calendar } from 'lucide-react';

// Mock data for student timetable - keeping until timetable endpoint is provided
const mockTimetableData = {
  'Monday-08:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', icon: '📐' },
  'Tuesday-08:00am': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', icon: '📚' },
  'Wednesday-08:00am': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', icon: '🧬' },
  'Friday-08:00am': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', icon: '⚗️' },

  'Tuesday-09:00am': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', icon: '🧬' },
  'Thursday-09:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', icon: '📐' },

  'Monday-10:00am': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', icon: '📚' },
  'Wednesday-10:00am': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', icon: '⚗️' },
  'Friday-10:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', icon: '📐' },

  'Tuesday-11:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', icon: '📐' },

  'Monday-12:00pm': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', icon: '⚗️' },
  'Wednesday-12:00pm': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', icon: '📐' },
  'Thursday-12:00pm': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', icon: '🧬' },

  'Tuesday-01:00pm': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', icon: '📚' },
  'Thursday-01:00pm': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', icon: '📚' },

  'Monday-02:00pm': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', icon: '🧬' },
  'Wednesday-02:00pm': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', icon: '⚗️' },

  'Tuesday-03:00pm': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', icon: '⚗️' },
  'Thursday-03:00pm': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', icon: '📐' },
};

export default function TimetableView() {
  const timeSlots = [
    '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm',
    '01:00pm', '02:00pm', '03:00pm'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900 text-sm">Your Weekly Timetable</h4>
          <p className="text-blue-700 text-sm mt-1">
            View your class schedule for the week. Tap on any subject to see more details.
          </p>
        </div>
      </div>

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
            <div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm flex items-center">
              <span className="flex items-center">
                <span className="mr-1">⏰</span>
                {time}
              </span>
            </div>
            {days.map((day) => {
              const key = `${day}-${time}`;
              const subject = mockTimetableData[key as keyof typeof mockTimetableData];

              return (
                <div key={key} className="p-2 h-24 flex items-center justify-center">
                  {subject ? (
                    <div
                      className={`w-full h-full rounded-lg ${subject.color} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
                      title={`${subject.subjectName} - ${subject.duration}`}
                    >
                      <div className="text-lg mb-1">
                        {subject.icon}
                      </div>
                      <div className="text-xs font-semibold mb-1 leading-tight">
                        {subject.subjectName}
                      </div>
                      <div className="text-xs opacity-75 leading-tight">
                        {subject.duration}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      —
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 flex-wrap text-sm text-gray-600">
        <span className="font-medium">Your subjects:</span>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-blue-100" />
          <span>Further Mathematics</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-green-100" />
          <span>English</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-orange-100" />
          <span>Biology</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-yellow-100" />
          <span>Chemistry</span>
        </div>
      </div>
    </div>
  );
}
