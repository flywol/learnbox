/**
 * Task utility functions for formatting and calculations
 */

/**
 * Convert form time (12-hour format) and date to ISO 8601 format
 * @param date - Date string from date picker (e.g., "2025-01-15")
 * @param time - Time string from TimePicker (e.g., "1:30 PM")
 * @returns ISO 8601 datetime string (e.g., "2025-01-15T13:30:00Z")
 */
export function formatTimeForApi(date: string, time: string): string {
  const [timePart, period] = time.split(' ');
  let [hour, minute] = timePart.split(':').map(Number);

  // Convert to 24-hour format
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');

  return `${date}T${hourStr}:${minuteStr}:00Z`;
}

/**
 * Format date for API (ensure it's ISO 8601 with time at 00:00:00)
 * @param date - Date string from date picker (e.g., "2025-01-15")
 * @returns ISO 8601 datetime string (e.g., "2025-01-15T00:00:00Z")
 */
export function formatDateForApi(date: string): string {
  return `${date}T00:00:00Z`;
}

/**
 * Calculate time label for task display
 * @param scheduleTime - ISO 8601 datetime string
 * @returns Object with label and urgency flag
 */
export function calculateTimeLabel(scheduleTime: string): { label: string; urgent: boolean } {
  const now = new Date();
  const taskTime = new Date(scheduleTime);
  const diffMs = taskTime.getTime() - now.getTime();

  // Overdue
  if (diffMs < 0) {
    return { label: "Overdue", urgent: true };
  }

  // Within 15 minutes - show as "Now"
  if (diffMs < 15 * 60 * 1000) {
    return { label: "Now", urgent: true };
  }

  // Within 1 hour - show minutes
  if (diffMs < 60 * 60 * 1000) {
    const mins = Math.floor(diffMs / (60 * 1000));
    return { label: `Due in ${mins}min${mins !== 1 ? 's' : ''}`, urgent: true };
  }

  // Within 24 hours - show hours and minutes
  if (diffMs < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const mins = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    return {
      label: `Due in ${hours}hr${hours !== 1 ? 's' : ''} ${mins}min${mins !== 1 ? 's' : ''}`,
      urgent: diffMs < 3 * 60 * 60 * 1000  // Urgent if less than 3 hours
    };
  }

  // Tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  if (taskTime >= tomorrow && taskTime < dayAfterTomorrow) {
    const timeStr = taskTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { label: `Tomorrow at ${timeStr}`, urgent: false };
  }

  // Within a week - show day name and time
  if (diffMs < 7 * 24 * 60 * 60 * 1000) {
    const dayName = taskTime.toLocaleDateString('en-US', { weekday: 'short' });
    const timeStr = taskTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { label: `${dayName} at ${timeStr}`, urgent: false };
  }

  // Future - show date
  const dateStr = taskTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  return { label: dateStr, urgent: false };
}

/**
 * Parse ISO time to 12-hour format for display
 * @param isoTime - ISO 8601 datetime string
 * @returns Time in 12-hour format (e.g., "1:30 PM")
 */
export function parseTimeFromApi(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get friendly repeat label
 * @param repeat - API repeat value
 * @returns User-friendly label
 */
export function getRepeatLabel(repeat: string): string {
  const labels: Record<string, string> = {
    none: 'Does not repeat',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  };
  return labels[repeat] || repeat;
}
