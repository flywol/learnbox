/**
 * Calculate time remaining until class starts
 */
export function getTimeRemaining(startTime: string): string {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start.getTime() - now.getTime();

  if (diff < 0) return 'Now';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0 && minutes === 0) return 'Now';
  if (hours === 0) return `${minutes}min${minutes > 1 ? 's' : ''}`;
  if (minutes === 0) return `${hours}hr${hours > 1 ? 's' : ''}`;

  return `${hours}hr${hours > 1 ? 's' : ''} ${minutes}min${minutes > 1 ? 's' : ''}`;
}

/**
 * Get class status based on start time
 */
export function getClassStatus(startTime: string): 'now' | 'starting-soon' | 'upcoming' | 'ended' {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start.getTime() - now.getTime();

  const fifteenMins = 15 * 60 * 1000;
  const thirtyMins = 30 * 60 * 1000;

  // Class ended
  if (diff < -thirtyMins) return 'ended';

  // Class is happening now (within 15 mins of start or already started)
  if (diff <= fifteenMins && diff >= -fifteenMins) return 'now';

  // Class starting soon (within 30 mins)
  if (diff > 0 && diff <= thirtyMins) return 'starting-soon';

  // Class is upcoming
  return 'upcoming';
}

/**
 * Get status message for today's class card
 */
export function getStatusMessage(status: string, subject: string): string {
  switch (status) {
    case 'now':
      return `${subject} Class is happening now!`;
    case 'starting-soon':
      return `${subject} Class is starting soon`;
    case 'upcoming':
      return `${subject} Class is scheduled`;
    default:
      return 'No class scheduled';
  }
}

/**
 * Format class list item title
 */
export function getClassItemTitle(status: string): string {
  if (status === 'now') return 'Attend Live Class';
  return 'Next Live Class';
}

/**
 * Get display time for upcoming class
 */
export function getDisplayTime(startTime: string, status: string): string {
  if (status === 'now') return 'Now';
  return `Due in ${getTimeRemaining(startTime)}`;
}
