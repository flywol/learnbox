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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-px bg-gray-100">
          <div className="p-4 bg-white font-semibold text-gray-900 text-sm">Time</div>
          {days.map((day) => (
            <div key={day} className="p-4 bg-white font-semibold text-gray-900 text-sm text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="bg-gray-100 gap-px grid">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-6 gap-px bg-gray-100">
            <div className="p-4 bg-white font-medium text-gray-500 text-xs flex items-center gap-2">
              <span>{time}</span>
              <ChevronsRight className="w-3 h-3 text-gray-300" />
            </div>
            {days.map((day) => {
              const key = `${day}-${time}`;
              const subject = mockTimetableData[key as keyof typeof mockTimetableData];

              return (
                <div key={key} className="p-2 bg-white h-28 flex items-center justify-center relative group">
                  {subject ? (
                    <div
                      className="w-full h-full bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex flex-col gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group-hover:bg-orange-50"
                      title={`${subject.subjectName} - ${subject.duration}`}
                    >
                      <div className="flex items-start justify-between">
                         <div className="text-xl">{subject.icon}</div>
                         <div className="text-[10px] font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
                            {subject.duration}
                         </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">
                          {subject.subjectName}
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="w-full h-full rounded-xl border border-dashed border-gray-100 hover:border-gray-200 transition-colors" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
