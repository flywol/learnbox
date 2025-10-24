import { ChevronsRight } from 'lucide-react';

// Mock data for student timetable - keeping until timetable endpoint is provided
const mockTimetableData = {
  'Monday-08:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-blue-500' },
  'Tuesday-08:00am': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', borderColor: 'border-l-4 border-green-500', iconBg: 'bg-green-500' },
  'Wednesday-08:00am': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', borderColor: 'border-l-4 border-orange-500', iconBg: 'bg-orange-500' },
  'Friday-08:00am': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-l-4 border-yellow-500', iconBg: 'bg-yellow-500' },

  'Tuesday-09:00am': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', borderColor: 'border-l-4 border-orange-500', iconBg: 'bg-orange-500' },
  'Thursday-09:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-blue-500' },

  'Monday-10:00am': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', borderColor: 'border-l-4 border-green-500', iconBg: 'bg-green-500' },
  'Wednesday-10:00am': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-l-4 border-yellow-500', iconBg: 'bg-yellow-500' },
  'Friday-10:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-blue-500' },

  'Tuesday-11:00am': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-blue-500' },

  'Monday-12:00pm': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-l-4 border-yellow-500', iconBg: 'bg-yellow-500' },
  'Wednesday-12:00pm': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-blue-500' },
  'Thursday-12:00pm': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', borderColor: 'border-l-4 border-orange-500', iconBg: 'bg-orange-500' },

  'Tuesday-01:00pm': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', borderColor: 'border-l-4 border-green-500', iconBg: 'bg-green-500' },
  'Thursday-01:00pm': { subjectName: 'English', duration: '1hr 30mins', color: 'bg-green-100 text-green-700', borderColor: 'border-l-4 border-green-500', iconBg: 'bg-green-500' },

  'Monday-02:00pm': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', borderColor: 'border-l-4 border-orange-500', iconBg: 'bg-orange-500' },
  'Wednesday-02:00pm': { subjectName: 'Biology', duration: '50mins', color: 'bg-orange-100 text-orange-700', borderColor: 'border-l-4 border-orange-500', iconBg: 'bg-orange-500' },

  'Tuesday-03:00pm': { subjectName: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-l-4 border-yellow-500', iconBg: 'bg-yellow-500' },
  'Thursday-03:00pm': { subjectName: 'Further M...', duration: '1hr', color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-4 border-blue-500', iconBg: 'bg-blue-500' },
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
                <div key={key} className="p-2 h-24 flex items-center justify-center">
                  {subject ? (
                    <div
                      className={`w-full h-full rounded-lg ${subject.color} ${subject.borderColor} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
                      title={`${subject.subjectName} - ${subject.duration}`}
                    >
                      <div className={`w-6 h-6 ${subject.iconBg} rounded-full mb-1 flex items-center justify-center`}>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="text-xs font-semibold mb-1 leading-tight">
                        {subject.subjectName}
                      </div>
                      <div className="text-xs opacity-75 leading-tight">
                        {subject.duration}
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
