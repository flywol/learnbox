import type { TimetableData, TimetableGrid, TimetableGridItem } from '../types/timetable.types';

// Convert 24-hour time to 12-hour format for display
export function formatTimeFor12Hour(time24: string): string {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hour24 = parseInt(hours, 10);
  const isPM = hour24 >= 12;
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  
  return `${hour12.toString().padStart(2, '0')}:${minutes}${isPM ? 'pm' : 'am'}`;
}

// Convert 12-hour time to 24-hour format for API
export function formatTimeFor24Hour(time12: string): string {
  if (!time12) return '';
  
  const match = time12.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return time12; // Return as-is if not in expected format
  
  const [, hours, minutes, period] = match;
  let hour24 = parseInt(hours, 10);
  
  if (period.toLowerCase() === 'pm' && hour24 !== 12) {
    hour24 += 12;
  } else if (period.toLowerCase() === 'am' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
}

// Calculate duration between start and end time
export function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';
  
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  
  const diffMs = end.getTime() - start.getTime();
  const diffMins = diffMs / (1000 * 60);
  
  if (diffMins < 60) {
    return `${diffMins}mins`;
  }
  
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  
  if (minutes === 0) {
    return `${hours}hr${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}hr${hours > 1 ? 's' : ''} ${minutes}mins`;
}

// Subject colors for consistent UI display
const SUBJECT_COLOR_MAP: { [key: string]: string } = {
  'mathematics': 'bg-blue-100 text-blue-800',
  'math': 'bg-blue-100 text-blue-800',
  'english': 'bg-green-100 text-green-800',
  'biology': 'bg-orange-100 text-orange-800',
  'chemistry': 'bg-yellow-100 text-yellow-800',
  'physics': 'bg-purple-100 text-purple-800',
  'geography': 'bg-red-100 text-red-800',
  'history': 'bg-pink-100 text-pink-800',
  'computer': 'bg-indigo-100 text-indigo-800',
  'science': 'bg-cyan-100 text-cyan-800',
};

// Get color for subject based on name
export function getSubjectColor(subjectName: string): string {
  const normalizedName = subjectName.toLowerCase();
  
  // Check for exact matches or partial matches
  for (const [key, color] of Object.entries(SUBJECT_COLOR_MAP)) {
    if (normalizedName.includes(key)) {
      return color;
    }
  }
  
  // Return a default color if no match found
  const defaultColors = [
    'bg-gray-100 text-gray-800',
    'bg-slate-100 text-slate-800',
    'bg-zinc-100 text-zinc-800',
  ];
  
  const hash = subjectName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return defaultColors[Math.abs(hash) % defaultColors.length];
}

// Convert timetable data to grid format for display
export function convertTimetableToGrid(timetableData: TimetableData | null): TimetableGrid {
  if (!timetableData) return {};
  
  const grid: TimetableGrid = {};
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00'
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Initialize empty grid
  timeSlots.forEach(time => {
    days.forEach(day => {
      const key = `${day}-${formatTimeFor12Hour(time)}`;
      grid[key] = null;
    });
  });
  
  // Populate grid with subjects
  timetableData.subjectSchedules.forEach(subjectSchedule => {
    subjectSchedule.schedule.forEach(timeSlot => {
      // Find which display time slot this belongs to
      const startTime24 = timeSlot.startTime;
      const endTime24 = timeSlot.endTime;
      
      // Find the closest time slot
      const matchingTimeSlot = timeSlots.find(slot => {
        const slotTime = new Date(`1970-01-01T${slot}:00`);
        const startTime = new Date(`1970-01-01T${startTime24}:00`);
        const endTime = new Date(`1970-01-01T${endTime24}:00`);
        
        // Check if the slot time falls within the subject's time range
        return slotTime >= startTime && slotTime < endTime;
      });
      
      if (matchingTimeSlot) {
        const key = `${timeSlot.day}-${formatTimeFor12Hour(matchingTimeSlot)}`;
        
        const gridItem: TimetableGridItem = {
          subjectName: subjectSchedule.subjectName,
          duration: calculateDuration(startTime24, endTime24),
          color: getSubjectColor(subjectSchedule.subjectName),
          icon: getSubjectIcon(subjectSchedule.subjectName),
        };
        
        grid[key] = gridItem;
      }
    });
  });
  
  return grid;
}

// Get subject icon based on name
export function getSubjectIcon(subjectName: string): string | undefined {
  const normalizedName = subjectName.toLowerCase();
  
  const iconMap: { [key: string]: string } = {
    'math': '/assets/maths.svg',
    'english': '/assets/english.svg',
    'biology': '/assets/biology.svg',
    'chemistry': '/assets/chem.svg',
    'chem': '/assets/chem.svg',
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return icon;
    }
  }
  
  return undefined;
}

// Check if two time periods overlap
export function doTimePeriodsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(`1970-01-01T${start1}:00`);
  const e1 = new Date(`1970-01-01T${end1}:00`);
  const s2 = new Date(`1970-01-01T${start2}:00`);
  const e2 = new Date(`1970-01-01T${end2}:00`);
  
  return s1 < e2 && s2 < e1;
}

// Find conflicting time slots in timetable data
export function findTimeConflicts(timetableData: TimetableData): Array<{
  subjects: string[];
  day: string;
  timeRange: string;
}> {
  const conflicts: Array<{
    subjects: string[];
    day: string;
    timeRange: string;
  }> = [];
  
  const allSlots: Array<{
    subject: string;
    day: string;
    startTime: string;
    endTime: string;
  }> = [];
  
  // Collect all time slots
  timetableData.subjectSchedules.forEach(subjectSchedule => {
    subjectSchedule.schedule.forEach(timeSlot => {
      allSlots.push({
        subject: subjectSchedule.subjectName,
        day: timeSlot.day,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      });
    });
  });
  
  // Check for conflicts
  for (let i = 0; i < allSlots.length; i++) {
    for (let j = i + 1; j < allSlots.length; j++) {
      const slot1 = allSlots[i];
      const slot2 = allSlots[j];
      
      if (slot1.day === slot2.day && 
          doTimePeriodsOverlap(slot1.startTime, slot1.endTime, slot2.startTime, slot2.endTime)) {
        
        // Check if conflict already exists
        const existingConflict = conflicts.find(c => 
          c.day === slot1.day &&
          c.subjects.includes(slot1.subject) &&
          c.subjects.includes(slot2.subject)
        );
        
        if (!existingConflict) {
          conflicts.push({
            subjects: [slot1.subject, slot2.subject],
            day: slot1.day,
            timeRange: `${formatTimeFor12Hour(slot1.startTime > slot2.startTime ? slot1.startTime : slot2.startTime)} - ${formatTimeFor12Hour(slot1.endTime < slot2.endTime ? slot1.endTime : slot2.endTime)}`,
          });
        }
      }
    }
  }
  
  return conflicts;
}

// ===== TEACHER TIMETABLE UTILITIES =====

import type { TeacherClassSchedule, TransformedClassForGrid } from '../types/timetable.types';
import { SUBJECT_COLORS } from '../types/timetable.types';

/**
 * Check if a class has valid times (end time must be after start time)
 */
export function isValidClassTime(rawStartTime: string, rawEndTime: string): boolean {
  try {
    const start = new Date(`1970-01-01T${rawStartTime}:00`);
    const end = new Date(`1970-01-01T${rawEndTime}:00`);
    return end > start;
  } catch {
    return false;
  }
}

/**
 * Calculate duration in a human-readable format
 */
export function calculateClassDuration(rawStartTime: string, rawEndTime: string): string {
  if (!rawStartTime || !rawEndTime) return '';

  const start = new Date(`1970-01-01T${rawStartTime}:00`);
  const end = new Date(`1970-01-01T${rawEndTime}:00`);

  const diffMs = end.getTime() - start.getTime();
  const diffMins = diffMs / (1000 * 60);

  if (diffMins <= 0) return 'Invalid';

  if (diffMins < 60) {
    return `${diffMins}mins`;
  }

  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (minutes === 0) {
    return `${hours}hr${hours > 1 ? 's' : ''}`;
  }

  return `${hours}hr${hours > 1 ? 's' : ''} ${minutes}mins`;
}

/**
 * Round time to nearest hour for grid slot placement
 * e.g., "10:14" → "10:00", "14:45" → "15:00"
 */
export function roundToNearestHourSlot(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const roundedHour = minutes >= 30 ? hours + 1 : hours;
  return `${roundedHour.toString().padStart(2, '0')}:00`;
}

/**
 * Get consistent color for a subject based on its name
 */
export function getConsistentSubjectColor(subjectName: string): string {
  // Use a simple hash to get consistent color for same subject
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[index];
}

/**
 * Transform API class data to grid-ready format
 * Expands each class to separate entries for each arm
 */
export function transformClassForGrid(
  classData: TeacherClassSchedule
): TransformedClassForGrid[] {
  // Skip classes with invalid times
  if (!isValidClassTime(classData.rawStartTime, classData.rawEndTime)) {
    return [];
  }

  const { subjectName, rawStartTime, rawEndTime, classInfo } = classData;
  const className = classInfo.class;
  const arms = classInfo.arms;

  // If no arms, create one entry without arm
  if (!arms || arms.length === 0) {
    return [{
      subjectName,
      className,
      armName: '',
      displayClass: className,
      rawStartTime,
      rawEndTime,
      displayStartTime: formatTimeFor12Hour(rawStartTime),
      displayEndTime: formatTimeFor12Hour(rawEndTime),
      duration: calculateClassDuration(rawStartTime, rawEndTime),
      color: getConsistentSubjectColor(subjectName),
      gridSlot: roundToNearestHourSlot(rawStartTime),
    }];
  }

  // Create separate entry for each arm
  return arms.map(arm => ({
    subjectName,
    className,
    armName: arm.armName,
    displayClass: `${className} ${arm.armName}`,
    rawStartTime,
    rawEndTime,
    displayStartTime: formatTimeFor12Hour(rawStartTime),
    displayEndTime: formatTimeFor12Hour(rawEndTime),
    duration: calculateClassDuration(rawStartTime, rawEndTime),
    color: getConsistentSubjectColor(subjectName),
    gridSlot: roundToNearestHourSlot(rawStartTime),
  }));
}

/**
 * Transform weekly schedule to grid format
 */
export function transformWeeklyScheduleToGrid(
  schedule: {
    Monday: TeacherClassSchedule[];
    Tuesday: TeacherClassSchedule[];
    Wednesday: TeacherClassSchedule[];
    Thursday: TeacherClassSchedule[];
    Friday: TeacherClassSchedule[];
  }
): Record<string, TransformedClassForGrid[]> {
  const grid: Record<string, TransformedClassForGrid[]> = {};

  Object.entries(schedule).forEach(([day, classes]) => {
    classes.forEach(classData => {
      const transformedClasses = transformClassForGrid(classData);

      transformedClasses.forEach(transformedClass => {
        // Create grid key: "Day-TimeSlot" e.g., "Monday-10:00am"
        const gridKey = `${day}-${formatTimeFor12Hour(transformedClass.gridSlot)}`;

        if (!grid[gridKey]) {
          grid[gridKey] = [];
        }

        grid[gridKey].push(transformedClass);
      });
    });
  });

  return grid;
}