// Timetable API Types
export interface TimeSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // Format: "HH:mm" (24-hour)
  endTime: string; // Format: "HH:mm" (24-hour)
}

export interface SubjectSchedule {
  subjectName: string;
  schedule: TimeSlot[];
}

export interface CreateTimetableRequest {
  classId: string;
  classArmId?: string;
  subjectSchedules: SubjectSchedule[];
}

export interface CreateTimetableResponse {
  message: string;
  data: TimetableData;
}

// Actual API response structure (returns array)
export interface ActualTimeSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // Format: "HH:mm" (24-hour)
  endTime: string; // Format: "HH:mm" (24-hour)
  _id: string;
}

export interface ActualSubjectSchedule {
  subjectName: string;
  schedule: ActualTimeSlot[];
  _id: string;
}

export interface ActualTimetableData {
  _id: string;
  subjectSchedules: ActualSubjectSchedule[];
  class: {
    _id: string;
    levelName: string;
    class: string;
    school: string;
    arms: Array<{
      id: string;
      armName: string;
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
  school: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API returns array of timetables
export type GetTimetableResponse = ActualTimetableData[];

export interface GetTimetableResponseLegacy {
  message: string;
  data: {
    timetable: TimetableData | null;
  };
}

export interface TimetableData {
  _id?: string;
  classId: string;
  subjectSchedules: SubjectSchedule[];
  createdAt?: string;
  updatedAt?: string;
}

// UI Types for form management
export interface TimetableFormData {
  classId: string;
  subjects: SubjectFormData[];
}

export interface SubjectFormData {
  id: string; // For UI tracking
  subjectName: string;
  timeSlots: TimeSlotFormData[];
}

export interface TimeSlotFormData {
  id: string; // For UI tracking
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | '';
  startTime: string;
  endTime: string;
}

// Grid display types (for TimetableView)
export interface TimetableGridItem {
  subjectName: string;
  duration: string;
  color: string;
  icon?: string;
}

export type TimetableGrid = { [key: string]: TimetableGridItem | null };

// Available subjects type
export interface Subject {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Constants
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00'
] as const;

export const SUBJECT_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800', 
  'bg-yellow-100 text-yellow-800',
  'bg-orange-100 text-orange-800',
  'bg-red-100 text-red-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
] as const;