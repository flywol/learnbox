import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock events data - keeping until events endpoint is provided
const mockEvents = [
  { id: '1', date: '2025-10-03', description: 'Assignment deadline is today', type: 'assignment' },
  { id: '2', date: '2025-10-08', description: 'Physics live class', type: 'class' },
  { id: '3', date: '2025-10-11', description: 'Class trip', type: 'event' },
  { id: '4', date: '2025-10-10', description: 'Biology quiz due', type: 'assignment' },
  { id: '5', date: '2025-10-21', description: 'Physics live class', type: 'class' },
  { id: '6', date: '2025-10-27', description: "Children's day", type: 'event' },
  { id: '7', date: '2025-10-31', description: 'Biology quiz due', type: 'assignment' },
];

export default function CalendarView() {
  // State for current viewing month/year
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Filter events for specific day
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => event.date === dateStr);
  };

  // Check if date has events (for red highlighting)
  const hasEvents = (day: number) => {
    const dayEvents = getEventsForDay(day);
    return dayEvents.length > 0;
  };

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
              {monthNames[currentMonth]} {currentYear}
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
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-28 rounded-lg" style={{ backgroundColor: '#FFF5F0' }} />;
            }

            const dayEvents = getEventsForDay(day);
            const hasEvent = hasEvents(day);

            return (
              <div
                key={index}
                className="p-3 h-28 rounded-lg hover:opacity-90 cursor-pointer transition-all"
                style={{ backgroundColor: '#FFEFE9' }}
              >
                <div className={`text-sm mb-2 ${
                  hasEvent ? 'font-bold text-gray-900' : 'font-normal text-gray-600'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-white rounded-full px-2 py-1 text-gray-700 leading-tight truncate"
                      title={event.description}
                    >
                      {event.description}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
