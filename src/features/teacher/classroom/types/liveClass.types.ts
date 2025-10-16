// API Request/Response Types
export interface CreateLiveClassRequest {
  subject: string; // Subject name
  description: string;
  scheduleStartDate: string; // Format: "2024-01-15"
  scheduleTime: string; // Format: "2024-01-15T10:30:00Z" (ISO 8601)
  duration: string; // Format: "1 hour 30 minutes" or "90 minutes"
  classLink: string; // Google Meet link
}

export interface UpdateLiveClassRequest {
  subject?: string;
  description?: string;
  scheduleStartDate?: string;
  scheduleTime?: string;
  duration?: string;
  classLink?: string;
  subjectId?: string;
  class?: string;
  classArm?: string;
  status?: LiveClassStatus;
  meetingId?: string; // Optional teacher reference
  recordingUrl?: string; // Upload after class
}

export type LiveClassStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';

export interface LiveClassResponse {
  _id: string;
  subject: string;
  description: string;
  scheduleStartDate: string;
  scheduleTime: string;
  duration: string;
  classLink: string;
  subjectId: string;
  class: string;
  classArm: string;
  status: LiveClassStatus;
  teacher: string;
  school: string;
  meetingId?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveClassListResponse {
  data: {
    liveClasses: LiveClassResponse[];
    total: number;
  };
}

export interface UpcomingLiveClassResponse extends LiveClassResponse {
  timeRemaining: string; // e.g., "2 hours 30 minutes"
}

export interface UpcomingLiveClassListResponse {
  data: {
    liveClasses: UpcomingLiveClassResponse[];
    total: number;
  };
}

// Form Types
export interface LiveClassFormData {
  subjectId: string;
  subjectName: string; // For display
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  durationHours: number;
  durationMinutes: number;
  classLink: string;
  meetingId?: string; // Optional
}

// UI Helper Types
export interface LiveClassForUI {
  id: string;
  title: string; // Derived from subject name
  subject: string;
  description: string;
  scheduleDate: Date;
  duration: string;
  classLink: string;
  status: 'now' | 'upcoming' | 'finished' | 'cancelled'; // Map from API status
  time: string; // Display format "10:30 AM"
  dueDate: string; // Display format
  meetingId?: string;
  recordingUrl?: string;
}
