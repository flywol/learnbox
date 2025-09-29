import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { eventsApiClient } from '@/features/admin/events/api/eventsApiClient';
import { apiDateToDate, getMonthName, getDayNames, isToday as checkIsToday, isSameDay } from '@/features/admin/events/utils/dateUtils';
import { EVENT_COLORS } from '@/features/admin/events/types/events.types';
import type { EventResponse } from '@/features/admin/events/types/events.types';

interface CalendarViewProps {
  events?: EventResponse[]; // Optional prop for future use, we'll use API data
}

// Loading component
const LoadingCalendar = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-7 gap-4 mb-4">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// Error component
const CalendarError = ({ message }: { message: string }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-gray-400">Calendar</h3>
      <button
        disabled
        className="flex items-center space-x-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        <span>Add event</span>
      </button>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load calendar</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  </div>
);

export default function CalendarView(_props: CalendarViewProps) {
  const navigate = useNavigate();
  // State for current viewing month/year
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Fetch events from API
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsApiClient.getEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (gcTime is the new name for cacheTime in React Query v5)
  });

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
  const currentMonthEvents = events?.filter((event: EventResponse) => {
    const eventDate = apiDateToDate(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }) || [];

  if (isLoading) {
    return <LoadingCalendar />;
  }

  if (error) {
    return <CalendarError message="Please try refreshing the page" />;
  }

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
          onClick={() => navigate('/admin/classroom/add-event')}
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
            if (!day) {
              return <div key={index} className="h-24 border-b border-r border-gray-100" />;
            }

            const dayDate = new Date(currentYear, currentMonth, day);
            const isCurrentDay = checkIsToday(dayDate);
            
            // Filter events for this specific day
            const dayEvents = currentMonthEvents.filter((event: EventResponse) => {
              const eventDate = apiDateToDate(event.date);
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
                  {dayEvents.slice(0, 2).map((event: EventResponse) => (
                    <div 
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded truncate ${EVENT_COLORS[event.receivers as keyof typeof EVENT_COLORS]}`}
                      title={event.description}
                    >
                      {event.description}
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
        <span className="text-sm font-medium text-gray-600">Event audiences:</span>
        {[
          { type: 'all', label: 'All' },
          { type: 'students', label: 'Students' },
          { type: 'teachers', label: 'Teachers' },
          { type: 'parents', label: 'Parents' },
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