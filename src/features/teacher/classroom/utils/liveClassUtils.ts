import type { LiveClassResponse, LiveClassForUI, LiveClassFormData, CreateLiveClassRequest } from '../types/liveClass.types';

/**
 * Convert API response to UI format
 */
export const transformLiveClassForUI = (apiClass: LiveClassResponse): LiveClassForUI => {
  const scheduleDate = new Date(apiClass.scheduleTime);

  // Map API status to UI status
  const uiStatus = mapStatusToUI(apiClass.status, scheduleDate);

  return {
    id: apiClass._id,
    title: `${apiClass.subject} Live Session`,
    subject: apiClass.subject,
    description: apiClass.description,
    scheduleDate,
    duration: apiClass.duration,
    classLink: apiClass.classLink,
    status: uiStatus,
    time: formatTime(scheduleDate),
    dueDate: formatDate(scheduleDate),
    meetingId: apiClass.meetingId,
    recordingUrl: apiClass.recordingUrl,
  };
};

/**
 * Map API status to UI status
 */
const mapStatusToUI = (
  apiStatus: string,
  scheduleDate: Date
): 'now' | 'upcoming' | 'finished' | 'cancelled' => {
  if (apiStatus === 'cancelled') return 'cancelled';
  if (apiStatus === 'ended') return 'finished';

  const now = new Date();
  const scheduleTime = scheduleDate.getTime();
  const nowTime = now.getTime();

  // Live if within 30 minutes of start time
  const thirtyMinutes = 30 * 60 * 1000;
  if (Math.abs(scheduleTime - nowTime) < thirtyMinutes && apiStatus === 'live') {
    return 'now';
  }

  // Finished if past schedule time
  if (scheduleTime < nowTime) {
    return 'finished';
  }

  // Otherwise upcoming
  return 'upcoming';
};

/**
 * Format time to display string
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * Format date to display string
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Convert form data to API request
 */
export const transformFormToRequest = (
  formData: LiveClassFormData
): CreateLiveClassRequest => {
  // Combine date and time to ISO string
  const dateTimeString = `${formData.date}T${formData.time}:00Z`;

  // Format duration string
  const durationString = formatDuration(formData.durationHours, formData.durationMinutes);

  return {
    subject: formData.subjectName,
    description: formData.description,
    scheduleStartDate: formData.date, // "2024-01-15"
    scheduleTime: dateTimeString, // "2024-01-15T10:30:00Z"
    duration: durationString, // "1 hour 30 minutes"
    classLink: formData.classLink,
  };
};

/**
 * Format duration to string
 */
export const formatDuration = (hours: number, minutes: number): string => {
  if (hours === 0 && minutes === 0) {
    return '0 minutes';
  }

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }

  return parts.join(' ');
};

/**
 * Validate Google Meet link
 */
export const isValidGoogleMeetLink = (url: string): boolean => {
  const googleMeetPattern = /^https:\/\/meet\.google\.com\/[a-z\-]+$/i;
  return googleMeetPattern.test(url);
};

/**
 * Parse duration string to hours and minutes
 */
export const parseDuration = (durationString: string): { hours: number; minutes: number } => {
  const hourMatch = durationString.match(/(\d+)\s*hour/i);
  const minuteMatch = durationString.match(/(\d+)\s*minute/i);

  return {
    hours: hourMatch ? parseInt(hourMatch[1]) : 0,
    minutes: minuteMatch ? parseInt(minuteMatch[1]) : 0,
  };
};
