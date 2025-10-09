import { Calendar } from 'lucide-react';

interface TimetableGridItem {
  subjectName: string;
  duration: string;
  color: string;
  icon?: string;
}

type TimetableGrid = { [key: string]: TimetableGridItem | null };

// Loading component
const LoadingTimetable = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-6 gap-4 mb-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, j) => (
              <div key={j} className="h-20 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyTimetable = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <div className="w-32 h-24 mx-auto mb-4">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
    </div>
    <h3 className="text-base font-medium text-gray-900 mb-2">No timetable available</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mx-auto">
      Your teaching schedule will appear here once it's been created by the admin.
    </p>
  </div>
);

export default function TimetableView() {
  const timeSlots = [
    '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm',
    '01:00pm', '02:00pm', '03:00pm'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Mock teacher timetable data based on the screenshots
  const mockTimetableGrid: TimetableGrid = {
    'Monday-08:00am': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    'Monday-10:00am': {
      subjectName: 'English',
      duration: '1hr',
      color: 'bg-green-100 text-green-800',
      icon: '📖'
    },
    'Monday-12:00pm': {
      subjectName: 'Chemistry',
      duration: '1hr',
      color: 'bg-red-100 text-red-800',
      icon: '🧪'
    },
    'Tuesday-09:00am': {
      subjectName: 'Biology',
      duration: '1hr',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🧬'
    },
    'Tuesday-11:00am': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    'Tuesday-01:00pm': {
      subjectName: 'English',
      duration: '1hr',
      color: 'bg-green-100 text-green-800',
      icon: '📖'
    },
    'Tuesday-02:00pm': {
      subjectName: 'Biology',
      duration: '1hr',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🧬'
    },
    'Tuesday-03:00pm': {
      subjectName: 'Chemistry',
      duration: '1hr',
      color: 'bg-red-100 text-red-800',
      icon: '🧪'
    },
    'Wednesday-08:00am': {
      subjectName: 'Biology',
      duration: '1hr',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🧬'
    },
    'Wednesday-10:00am': {
      subjectName: 'Chemistry',
      duration: '1hr',
      color: 'bg-red-100 text-red-800',
      icon: '🧪'
    },
    'Wednesday-12:00pm': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    'Thursday-09:00am': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    'Thursday-10:00am': {
      subjectName: 'Chemistry',
      duration: '1hr',
      color: 'bg-red-100 text-red-800',
      icon: '🧪'
    },
    'Thursday-01:00pm': {
      subjectName: 'English',
      duration: '1hr',
      color: 'bg-green-100 text-green-800',
      icon: '📖'
    },
    'Thursday-03:00pm': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    'Friday-08:00am': {
      subjectName: 'Chemistry',
      duration: '1hr',
      color: 'bg-red-100 text-red-800',
      icon: '🧪'
    },
    'Friday-10:00am': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    'Friday-11:00am': {
      subjectName: 'Further M...',
      duration: '1hr',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    }
  };

  // Mock data - using mock until teacher endpoint is provided
  const isLoading = false;
  const hasTimetable = Object.keys(mockTimetableGrid).length > 0;

  if (isLoading) {
    return <LoadingTimetable />;
  }

  return (
    <div className="space-y-4">
      {/* Timetable Content */}
      {!hasTimetable ? (
        <EmptyTimetable />
      ) : (
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
              <div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm">
                {time}
              </div>
              {days.map((day) => {
                const key = `${day}-${time}`;
                const subject = mockTimetableGrid[key];

                return (
                  <div key={key} className="p-2 h-24 flex items-center justify-center">
                    {subject ? (
                      <div
                        className={`w-full h-full rounded-lg ${subject.color} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
                        title={`${subject.subjectName} on ${day} at ${time}`}
                      >
                        {subject.icon && (
                          <div className="text-lg mb-1 flex-shrink-0">
                            {subject.icon}
                          </div>
                        )}
                        <div className="text-xs font-semibold mb-1 leading-tight">
                          {subject.subjectName.length > 10 ?
                            `${subject.subjectName.substring(0, 10)}...` :
                            subject.subjectName
                          }
                        </div>
                        <div className="text-xs opacity-75 leading-tight">
                          {subject.duration}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-300 text-xs">-</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}