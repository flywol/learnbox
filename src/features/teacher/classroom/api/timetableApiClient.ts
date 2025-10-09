import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateTimetableRequest,
  CreateTimetableResponse,
  TimetableData,
  Subject,
  TodayClassesResponse,
  WeeklyScheduleResponse,
} from "../types/timetable.types";

// Interface for the class levels and arms response
interface ClassLevelWithArms {
  _id: string;
  levelName: string;
  class: string;
  school: string;
  arms: Array<{
    _id: string;
    armName: string;
    parentClass: string;
    school: string;
    studentCount: number;
    assignedTeachers: any[];
  }>;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
  teacherCount: number;
}

export interface ClassLevel {
  id: string; // The class._id for timetable API calls
  name: string; // Display name like "Primary 1"
  levelName: string; // e.g., "Primary Class"
  class: string; // e.g., "Primary 1"
  armCount: number; // Number of arms in this class
  studentCount: number;
  teacherCount: number;
}

class TimetableApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Create or update timetable
  async createTimetable(data: CreateTimetableRequest): Promise<TimetableData> {
    try {
      const response = await this.post<CreateTimetableResponse>("/timetable", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get timetable for a specific class
  async getTimetable(classId: string): Promise<TimetableData | null> {
    try {
      const response = await this.get<any>(`/timetable/class/${classId}`);
      
      // Check if response is an array of subject schedules directly
      if (Array.isArray(response) && response.length > 0) {
        // The API returns the subjectSchedules array directly
        const subjectSchedules = response;
        
        // Transform to our expected format
        return {
          classId: classId, // We have the classId from the parameter
          subjectSchedules: subjectSchedules.map(subject => ({
            subjectName: subject.subjectName,
            schedule: subject.schedule.map((slot: any) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime
            }))
          })),
        };
      }
      
      return null; // No timetable found
    } catch (error) {
      // Return null for 404 - no timetable exists yet
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Get available subjects (if endpoint exists)
  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await this.get<{ data: { subjects: any[] } }>("/subjects");
      const subjects = response.data.subjects;
      
      // Transform _id to id for frontend consistency
      return subjects.map((subject: any) => ({
        ...subject,
        id: subject._id
      }));
    } catch (error) {
      // Return default subjects if API doesn't exist
      return [
        { id: '1', name: 'Mathematics', color: 'bg-blue-100 text-blue-800', icon: '/assets/maths.svg' },
        { id: '2', name: 'English', color: 'bg-green-100 text-green-800', icon: '/assets/english.svg' },
        { id: '3', name: 'Biology', color: 'bg-orange-100 text-orange-800', icon: '/assets/biology.svg' },
        { id: '4', name: 'Chemistry', color: 'bg-yellow-100 text-yellow-800', icon: '/assets/chem.svg' },
        { id: '5', name: 'Physics', color: 'bg-purple-100 text-purple-800' },
        { id: '6', name: 'Geography', color: 'bg-red-100 text-red-800' },
        { id: '7', name: 'History', color: 'bg-pink-100 text-pink-800' },
        { id: '8', name: 'Computer Science', color: 'bg-indigo-100 text-indigo-800' },
      ];
    }
  }

  // Update timetable (same as create - API handles create/update)
  async updateTimetable(data: CreateTimetableRequest): Promise<TimetableData> {
    return this.createTimetable(data);
  }

  // Edit existing timetable by ID
  async editTimetable(timetableId: string, data: CreateTimetableRequest): Promise<TimetableData> {
    try {
      const response = await this.put<CreateTimetableResponse>(`/timetable/${timetableId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete timetable by ID
  async deleteTimetable(timetableId: string): Promise<void> {
    try {
      await this.delete(`/timetable/${timetableId}`);
    } catch (error) {
      throw error;
    }
  }

  // Get all class levels for timetable creation (focuses on class level, not individual arms)
  async getClassLevels(): Promise<ClassLevel[]> {
    try {
      const response = await this.get<{ data: { classLevels: ClassLevelWithArms[] } }>("/admin/class-levels-and-arms");
      const classLevels = response.data.classLevels || [];

      return classLevels.map(classLevel => ({
        id: classLevel._id, // Use class._id for timetable API calls
        name: classLevel.class, // Display name like "Primary 1"
        levelName: classLevel.levelName, // e.g., "Primary Class"
        class: classLevel.class, // e.g., "Primary 1"
        armCount: classLevel.arms.length, // Number of arms in this class
        studentCount: classLevel.studentCount,
        teacherCount: classLevel.teacherCount,
      }));
    } catch (error) {
      console.error('Failed to fetch class levels:', error);
      return [];
    }
  }

  // ===== TEACHER TIMETABLE ENDPOINTS =====

  /**
   * GET /api/v1/timetable/teacher/today
   * Get today's classes for the authenticated teacher
   */
  async getTodayClasses(): Promise<TodayClassesResponse['data']> {
    try {
      const response = await this.get<TodayClassesResponse>('/timetable/teacher/today');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch today\'s classes:', error);
      throw error;
    }
  }

  /**
   * GET /api/v1/timetable/teacher/weekly
   * Get weekly schedule for the authenticated teacher
   */
  async getWeeklySchedule(): Promise<WeeklyScheduleResponse['data']> {
    try {
      const response = await this.get<WeeklyScheduleResponse>('/timetable/teacher/weekly');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch weekly schedule:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const timetableApiClient = new TimetableApiClient();
export default timetableApiClient;