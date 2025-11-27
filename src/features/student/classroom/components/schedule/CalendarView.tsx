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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center font-semibold text-gray-400 text-xs uppercase tracking-wider">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-32 bg-gray-50/50 rounded-xl" />;
            }

            const dayEvents = getEventsForDay(day);
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`p-2 h-32 rounded-xl border transition-all cursor-pointer flex flex-col group ${
                    isToday ? 'bg-orange-50/30 border-orange-200' : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-orange-500 text-white' : 'text-gray-700 group-hover:bg-gray-100'
                    }`}>
                        {day}
                    </span>
                    {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
                            {dayEvents.length}
                        </span>
                    )}
                </div>
                
                <div className="space-y-1 overflow-y-auto custom-scrollbar">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-[10px] px-2 py-1 rounded-md truncate border ${
                          event.type === 'assignment' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          event.type === 'class' ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-purple-50 text-purple-700 border-purple-100'
                      }`}
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
