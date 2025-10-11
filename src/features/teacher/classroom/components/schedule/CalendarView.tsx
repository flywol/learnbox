import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock live class data
const mockLiveClasses = [
  {
    id: '1',
    title: 'Mathematics Live Session',
    subject: 'Mathematics',
    class: 'Primary 1 A',
    date: '2025-01-15',
    startTime: '09:00',
    endTime: '10:00',
    status: 'upcoming' as const,
    description: 'Algebra basics and problem solving'
  },
  {
    id: '2',
    title: 'English Grammar Class',
    subject: 'English',
    class: 'Primary 1 B',
    date: '2025-01-15',
    startTime: '11:00',
    endTime: '12:00',
    status: 'now' as const,
    description: 'Parts of speech and sentence structure'
  },
  {
    id: '3',
    title: 'Science Experiment',
    subject: 'Basic Science',
    class: 'Primary 2 A',
    date: '2025-01-16',
    startTime: '14:00',
    endTime: '15:00',
    status: 'upcoming' as const,
    description: 'Simple chemical reactions'
  },
  {
    id: '4',
    title: 'History Discussion',
    subject: 'History',
    class: 'Primary 1 A',
    date: '2025-01-14',
    startTime: '10:00',
    endTime: '11:00',
    status: 'finished' as const,
    description: 'Ancient civilizations overview'
  }
];

const EVENT_COLORS = {
  upcoming: 'bg-blue-100 text-blue-800',
  now: 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800'
};

// Helper functions
const getMonthName = (month: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
};

const getDayNames = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString();
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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
  const currentMonthEvents = mockLiveClasses.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
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
        
        <button
          onClick={() => alert('Create live class functionality coming soon!')}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Live Class</span>
        </button>
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
            const dayEvents = currentMonthEvents.filter((event) => {
              const eventDate = new Date(event.date);
              return isSameDay(eventDate, dayDate);
            });

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
                      className={`text-xs px-2 py-1 rounded truncate ${EVENT_COLORS[event.status]}`}
                      title={`${event.title} - ${event.class}\n${event.startTime} - ${event.endTime}`}
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
        <span className="text-sm font-medium text-gray-600">Live class status:</span>
        {[
          { type: 'upcoming', label: 'Upcoming' },
          { type: 'now', label: 'Live Now' },
          { type: 'finished', label: 'Finished' },
          { type: 'cancelled', label: 'Cancelled' },
        ].map(({ type, label }) => (
          <div key={type} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${EVENT_COLORS[type as keyof typeof EVENT_COLORS].split(' ')[0]}`} />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}