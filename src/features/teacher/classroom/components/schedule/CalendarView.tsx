import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  type: 'assignment' | 'class' | 'trip' | 'quiz' | 'deadline';
  color: string;
}

const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

const getDayNames = (): string[] => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export default function CalendarView() {
  // State for current viewing month/year
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Mock calendar events based on the screenshot
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Assignment deadline is today',
      date: 3,
      type: 'deadline',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: '2', 
      title: 'Physics live class',
      date: 8,
      type: 'class',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: '3',
      title: 'Biology quiz due',
      date: 10,
      type: 'quiz',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: '4',
      title: 'Class trip',
      date: 11,
      type: 'trip',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: '5',
      title: 'Physics live class',
      date: 21,
      type: 'class',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: '6',
      title: 'Children\'s day',
      date: 27,
      type: 'trip',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: '7',
      title: 'Biology quiz due',
      date: 31,
      type: 'quiz',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const dayNames = getDayNames();

  // Filter events for current month
  const currentMonthEvents = mockEvents.filter(() => {
    // For demo purposes, show events in current month
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h3 className="text-xl font-semibold min-w-[200px] text-center">
              {getMonthName(currentMonth)} {currentYear}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <button 
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="p-3 bg-gray-50 text-center font-medium text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24 border-b border-r border-gray-100" />;
            }

            const dayDate = new Date(currentYear, currentMonth, day);
            const isCurrentDay = isToday(dayDate);
            
            // Filter events for this specific day
            const dayEvents = currentMonthEvents.filter(event => event.date === day);

            return (
              <div 
                key={index} 
                className="p-2 h-24 border-b border-r border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-orange-600 font-bold' : 'text-gray-900'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div 
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded truncate ${event.color}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Legend */}
      <div className="flex items-center space-x-6 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Event types:</span>
        {[
          { type: 'assignment', label: 'Assignment', color: 'bg-red-100' },
          { type: 'class', label: 'Live Class', color: 'bg-blue-100' },
          { type: 'quiz', label: 'Quiz', color: 'bg-yellow-100' },
          { type: 'trip', label: 'Trip/Event', color: 'bg-green-100' },
        ].map(({ type, label, color }) => (
          <div key={type} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}