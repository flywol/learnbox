import { Plus, Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'class' | 'quiz' | 'trip' | 'holiday';
}

interface CalendarViewProps {
  events: Event[]; // Currently using mock data, events prop for future use
  onAddEvent: () => void;
}

const getEventTypeColor = (type: Event['type']) => {
  const colors = {
    assignment: 'bg-blue-100 text-blue-800',
    class: 'bg-green-100 text-green-800',  
    quiz: 'bg-yellow-100 text-yellow-800',
    trip: 'bg-purple-100 text-purple-800',
    holiday: 'bg-red-100 text-red-800',
  };
  return colors[type] || colors.assignment;
};

// Utility function for future use
// const getEventTypeLabel = (type: Event['type']) => {
//   const labels = {
//     assignment: 'Assignment',
//     class: 'Class',
//     quiz: 'Quiz',
//     trip: 'Trip',
//     holiday: 'Holiday',
//   };
//   return labels[type] || labels.assignment;
// };

export default function CalendarView({ events: _events, onAddEvent }: CalendarViewProps) {
  // Mock calendar data for demonstration
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Math Assignment Due',
      date: '2024-01-15',
      type: 'assignment',
    },
    {
      id: '2', 
      title: 'Biology Quiz',
      date: '2024-01-17',
      type: 'quiz',
    },
    {
      id: '3',
      title: 'School Trip',
      date: '2024-01-20',
      type: 'trip',
    },
  ];

  // Generate calendar grid (simplified version)
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <button
          onClick={onAddEvent}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add event</span>
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
            const isToday = day === today.getDate();
            const dayEvents = mockEvents.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getDate() === day && 
                     eventDate.getMonth() === currentMonth &&
                     eventDate.getFullYear() === currentYear;
            });

            return (
              <div 
                key={index} 
                className={`p-2 h-24 border-b border-r border-gray-100 ${
                  day ? 'hover:bg-gray-50 cursor-pointer' : ''
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div 
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded truncate ${getEventTypeColor(event.type)}`}
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
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Legend */}
      <div className="flex items-center space-x-6">
        <span className="text-sm font-medium text-gray-600">Event types:</span>
        {[
          { type: 'assignment', label: 'Assignment' },
          { type: 'quiz', label: 'Quiz' },
          { type: 'trip', label: 'Trip' },
          { type: 'holiday', label: 'Holiday' },
        ].map(({ type, label }) => (
          <div key={type} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${getEventTypeColor(type as Event['type']).split(' ')[0]}`} />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}