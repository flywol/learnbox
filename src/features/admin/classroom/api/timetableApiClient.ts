import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateTimetableRequest,
  CreateTimetableResponse,
  TimetableData,
  Subject,
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
    const response = await this.post<CreateTimetableResponse>("/timetable", data);
    return response.data;
  }

  // Get timetable for a specific class and class arm
  async getTimetable(classId: string, classArmId: string): Promise<TimetableData | null> {
    try {
      const response = await this.get<any>(`/timetable/class/${classId}/${classArmId}`);
      
      // Check if response has data property
      if (response.data && Array.isArray(response.data)) {
        const subjectSchedules = response.data;
        
        return {
          classId: classId,
          subjectSchedules: subjectSchedules.map((subject: any) => ({
            subjectName: subject.subjectName,
            schedule: subject.schedule.map((slot: any) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime
            }))
          })),
        };
      }
      
      // Check if response is an array directly
      if (Array.isArray(response)) {
        return {
          classId: classId,
          subjectSchedules: response.map(subject => ({
            subjectName: subject.subjectName,
            schedule: subject.schedule.map((slot: any) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime
            }))
          })),
        };
      }
      
      return null;
    } catch (error) {
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
      console.log('API not available, using default subjects:', error);
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
    const response = await this.put<CreateTimetableResponse>(`/timetable/${timetableId}`, data);
    return response.data;
  }

  // Delete timetable by ID
  async deleteTimetable(timetableId: string): Promise<void> {
    await this.delete(`/timetable/${timetableId}`);
  }

  // Get all class levels for timetable creation (focuses on class level, not individual arms)
  async getClassLevels(): Promise<ClassLevel[]> {
    try {
      const response = await this.get<{ data: { classLevels: ClassLevelWithArms[] } }>("/admin/class-levels-and-arms");
      const classLevels = response.data.classLevels || [];

      return classLevels.map(classLevel => ({
        id: classLevel._id,
        name: classLevel.class,
        levelName: classLevel.levelName,
        class: classLevel.class,
        armCount: classLevel.arms.length,
        studentCount: classLevel.studentCount,
        teacherCount: classLevel.teacherCount,
      }));
    } catch (error) {
      console.error('Failed to fetch class levels:', error);
      return [];
    }
  }

  // Get class arms for a specific class
  async getClassArms(classId: string): Promise<Array<{id: string; name: string}>> {
    try {
      const response = await this.get<{ data: { classLevels: ClassLevelWithArms[] } }>("/admin/class-levels-and-arms");
      const classLevels = response.data.classLevels || [];
      const classLevel = classLevels.find(cl => cl._id === classId);

      if (classLevel && classLevel.arms.length > 0) {
        return classLevel.arms.map(arm => ({
          id: arm._id,
          name: arm.armName
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch class arms:', error);
      return [];
    }
  }
  // Get class levels with their arms for dropdown
  async getClassLevelsWithArms(): Promise<Array<{id: string; name: string; arms: Array<{id: string; name: string}>}>> {
    try {
      const response = await this.get<{ data: { classLevels: ClassLevelWithArms[] } }>("/admin/class-levels-and-arms");
      const classLevels = response.data.classLevels || [];

      return classLevels.map(classLevel => ({
        id: classLevel._id,
        name: classLevel.class,
        arms: classLevel.arms.map(arm => ({
          id: arm._id,
          name: arm.armName
        }))
      }));
    } catch (error) {
      console.error('Failed to fetch class levels with arms:', error);
      return [];
    }
  }
}

// Export singleton instance
export const timetableApiClient = new TimetableApiClient();
export default timetableApiClient;