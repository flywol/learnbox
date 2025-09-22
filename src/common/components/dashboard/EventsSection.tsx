import { Calendar, Clock, Users } from 'lucide-react';

// Event interface for shared use
export interface DashboardEvent {
  id: string;
  description: string;
  date: string;
  receivers: string;
}

interface EventsSectionProps {
  events?: DashboardEvent[];
  isLoading?: boolean;
  error?: string | null;
  maxEvents?: number;
}

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

// Event colors mapping
const EVENT_COLORS: Record<string, string> = {
  all: 'bg-blue-100 text-blue-600',
  teachers: 'bg-green-100 text-green-600',
  students: 'bg-purple-100 text-purple-600',
  parents: 'bg-yellow-100 text-yellow-600',
};

// Event Item Component
const EventItem = ({ event }: { event: DashboardEvent }) => {
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = eventDate.toDateString() === today.toDateString();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${EVENT_COLORS[event.receivers] || EVENT_COLORS.all}`}>
        <Calendar className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {event.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{isToday ? 'Today' : formatDate(eventDate)}</span>
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
export default function EventsSection({ 
  events = [], 
  isLoading = false, 
  error = null,
  maxEvents = 5 
}: EventsSectionProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  // Filter and sort events for dashboard display
  const upcomingEvents = events
    .filter((event: DashboardEvent) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a: DashboardEvent, b: DashboardEvent) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, maxEvents);

  if (upcomingEvents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {upcomingEvents.map((event: DashboardEvent) => (
        <EventItem key={event.id} event={event} />
      ))}
      
      {events.length > maxEvents && (
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 text-center">
            +{events.length - maxEvents} more events
          </p>
        </div>
      )}
    </div>
  );
}