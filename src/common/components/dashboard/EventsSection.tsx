import { Calendar } from 'lucide-react';

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

const LoadingState = () => (
  <div className="space-y-3 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse border border-gray-200 rounded-xl h-[72px] flex overflow-hidden">
        <div className="w-16 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 px-3 flex flex-col justify-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Calendar className="w-8 h-8 text-red-500 mb-2" />
    <h3 className="text-base font-medium text-gray-900 mb-2">Unable to load events</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm">{message}</p>
  </div>
);

const EventItem = ({ event }: { event: DashboardEvent }) => {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="bg-white border border-[#d6d6d6] rounded-xl h-[72px] overflow-hidden flex">
      <div className="bg-[#ffefe9] w-16 flex-shrink-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#2b2b2b] leading-[1.4]">{day}</span>
        <span className="text-xs text-[#2b2b2b]">{month}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center px-3 min-w-0">
        <p className="text-[18px] font-bold text-[#2b2b2b] truncate leading-snug">
          {event.description}
        </p>
        <p className="text-xs text-[#6b6b6b] truncate">Further details would be announced soon</p>
      </div>
    </div>
  );
};

export default function EventsSection({
  events = [],
  isLoading = false,
  error = null,
  maxEvents = 5,
}: EventsSectionProps) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, maxEvents);

  if (upcomingEvents.length === 0) return <EmptyState />;

  return (
    <div className="space-y-3">
      {upcomingEvents.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
      {events.length > maxEvents && (
        <p className="text-xs text-gray-500 text-center py-2">
          +{events.length - maxEvents} more events
        </p>
      )}
    </div>
  );
}
