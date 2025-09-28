import { Clock } from 'lucide-react';

interface TimetableGridItem {
  subjectName: string;
  duration: string;
  color: string;
  icon?: string;
}

type TimetableGrid = { [key: string]: TimetableGridItem | null };

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
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-lg font-medium text-gray-900">Your Teaching Schedule</span>
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
                      className={`w-full h-full rounded-lg ${subject.color} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md cursor-pointer`}
                      title={`${subject.subjectName} on ${day} at ${time}`}
                    >
                      <div className="text-lg mb-1 flex-shrink-0">
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
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-300 text-xs">Free</div>
                    </div>
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