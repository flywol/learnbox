// Utility functions for date conversion between API format (DD/MM/YYYY) and JavaScript Date objects

/**
 * Convert API date format (DD/MM/YYYY) to JavaScript Date object
 */
export function apiDateToDate(apiDate: string): Date {
  const [day, month, year] = apiDate.split('/').map(num => parseInt(num, 10));
  const result = new Date(year, month - 1, day); // month is 0-indexed in JS Date
  console.log('apiDateToDate conversion:', { input: apiDate, output: result.toISOString(), day, month, year });
  return result;
}

/**
 * Convert JavaScript Date object to API format (DD/MM/YYYY)
 */
export function dateToApiDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // month is 0-indexed
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

/**
 * Convert HTML input date format (YYYY-MM-DD) to API format (DD/MM/YYYY)
 */
export function inputDateToApiDate(inputDate: string): string {
  const [year, month, day] = inputDate.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Convert API date format (DD/MM/YYYY) to HTML input format (YYYY-MM-DD)
 */
export function apiDateToInputDate(apiDate: string): string {
  const [day, month, year] = apiDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Get today's date in API format (DD/MM/YYYY)
 */
export function getTodayInApiFormat(): string {
  return dateToApiDate(new Date());
}

/**
 * Check if two dates are the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get month name from month number (0-indexed)
 */
export function getMonthName(monthIndex: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[monthIndex];
}

/**
 * Get abbreviated day names for calendar headers
 */
export function getDayNames(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}