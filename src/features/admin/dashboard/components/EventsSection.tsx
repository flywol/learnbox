import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Users } from 'lucide-react';
import { eventsApiClient } from '@/features/events/api/eventsApiClient';
import { apiDateToDate, formatDateForDisplay, isToday } from '@/features/events/utils/dateUtils';
import { EVENT_COLORS } from '@/features/events/types/events.types';
import type { EventResponse } from '@/features/events/types/events.types';

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="w-32 h-24 mx-auto mb-4">
      <img 
        src="/assets/events-empty.svg" 
        alt="No events" 
        className="w-full h-full object-contain"
      />
    </div>
    <h3 className="text-base font-medium text-gray-900 mb-2">No upcoming event</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm">Events will appear here when created</p>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

// Error State Component
const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="text-red-500 mb-2">
      <Calendar className="w-8 h-8" />
    </div>
    <h3 className="text-base font-medium text-gray-900 mb-2">Unable to load events</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm">{message}</p>
  </div>
);

// Event Item Component
const EventItem = ({ event }: { event: EventResponse }) => {
  const eventDate = apiDateToDate(event.date);
  const today = isToday(eventDate);
  
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${EVENT_COLORS[event.receivers]}`}>
        <Calendar className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {event.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{today ? 'Today' : formatDateForDisplay(eventDate)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <span className="capitalize">{event.receivers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Events Section Component
export default function EventsSection() {
  console.log('EventsSection component rendered');
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => {
      console.log('Events query function called');
      return eventsApiClient.getEvents();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  console.log('EventsSection state:', { events, isLoading, error });

  // Filter and sort events for dashboard display
  const upcomingEvents = events
    ?.filter((event: EventResponse) => {
      const eventDate = apiDateToDate(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('Filtering event:', { 
        eventDate: eventDate.toISOString(), 
        today: today.toISOString(), 
        eventDateString: event.date,
        isUpcoming: eventDate >= today 
      });
      return eventDate >= today;
    })
    .sort((a: EventResponse, b: EventResponse) => {
      const dateA = apiDateToDate(a.date);
      const dateB = apiDateToDate(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5) || []; // Show max 5 upcoming events

  console.log('Upcoming events after filtering:', upcomingEvents);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message="Please try refreshing the page" />;
  }

  if (upcomingEvents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {upcomingEvents.map((event: EventResponse) => (
        <EventItem key={event.id} event={event} />
      ))}
      
      {events && events.length > 5 && (
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 text-center">
            +{events.length - 5} more events
          </p>
        </div>
      )}
    </div>
  );
}