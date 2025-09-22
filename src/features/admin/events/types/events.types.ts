// Event API types - using exact API format
export interface CreateEventRequest {
  description: string;
  receivers: 'all' | 'parents' | 'students' | 'teachers';
  date: string; // Format: DD/MM/YYYY
  repeat: 'no' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface EventResponse {
  id: string;
  description: string;
  receivers: 'all' | 'parents' | 'students' | 'teachers';
  date: string; // Format: DD/MM/YYYY
  repeat: 'no' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  school: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetEventsResponse {
  data: {
    events: EventResponse[];
  };
}

export interface CreateEventResponse {
  data: EventResponse;
}

// Form types for AddEventForm
export interface EventFormData {
  description: string;
  receivers: 'all' | 'parents' | 'students' | 'teachers';
  date: string; // Will be converted to DD/MM/YYYY format
  repeat: 'no' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  startTime?: string;
  endTime?: string;
}

// UI types for calendar display
export interface CalendarEvent {
  id: string;
  description: string;
  date: Date; // Converted from API DD/MM/YYYY format
  receivers: 'all' | 'parents' | 'students' | 'teachers';
  repeat: 'no' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  originalApiDate: string; // Keep original DD/MM/YYYY format
}

// Dropdown option types
export const RECEIVER_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: 'parents' as const, label: 'Parents' },
  { value: 'students' as const, label: 'Students' },
  { value: 'teachers' as const, label: 'Teachers' },
];

export const REPEAT_OPTIONS = [
  { value: 'no' as const, label: 'Does not repeat' },
  { value: 'daily' as const, label: 'Daily' },
  { value: 'weekly' as const, label: 'Weekly' },
  { value: 'monthly' as const, label: 'Monthly' },
  { value: 'yearly' as const, label: 'Yearly' },
];

// Utility type for event colors based on receiver type
export const EVENT_COLORS = {
  all: 'bg-blue-100 text-blue-800',
  parents: 'bg-green-100 text-green-800',
  students: 'bg-yellow-100 text-yellow-800',
  teachers: 'bg-purple-100 text-purple-800',
} as const;