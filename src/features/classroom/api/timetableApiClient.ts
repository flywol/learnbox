import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateTimetableRequest,
  CreateTimetableResponse,
  GetTimetableResponse,
  TimetableData,
  Subject,
} from "../types/timetable.types";

// Import types for class data
interface ClassLevelData {
  id: string;
  levelName: string;
  class: string;
  arms: any;
}

interface ClassArmData {
  id: string;
  armName: string;
}

export interface ClassWithArm {
  id: string; // This will be the parentClass._id for timetable API calls
  name: string;
  levelName: string;
  class: string;
  armName: string;
  armId?: string; // The actual arm._id if needed
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
      const response = await this.get<GetTimetableResponse>(`/timetable/${classId}`);
      return response.data.timetable;
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
      const response = await this.get<{ data: { subjects: Subject[] } }>("/subjects");
      return response.data.subjects;
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

  // Get all class levels
  async getClassLevels(): Promise<ClassLevelData[]> {
    try {
      const response = await this.get<{ data: ClassLevelData[] }>("/classes/levels/get-all");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  // Get all class arms
  async getClassArms(): Promise<ClassArmData[]> {
    try {
      const response = await this.get<{ data: ClassArmData[] }>("/classes/arms/get-all");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  // Get combined classes with their arms for display
  async getClassesWithArms(): Promise<ClassWithArm[]> {
    try {
      // Use the correct endpoint that returns arms with embedded parentClass data
      const response = await this.get<{ data: any[] }>("/classes/arms/get-all");
      const classArms = Array.isArray(response.data) ? response.data : [];

      return classArms.map(arm => ({
        id: arm.parentClass._id, // Use parentClass._id for timetable API calls
        name: `${arm.parentClass.class} ${arm.armName}`, // e.g., "Primary 1 Joy"
        levelName: arm.parentClass.levelName,
        class: arm.parentClass.class,
        armName: arm.armName,
        armId: arm._id, // Keep arm ID for reference if needed
      }));
    } catch (error) {
      console.error('Failed to fetch class arms:', error);
      return [];
    }
  }
}

// Export singleton instance
export const timetableApiClient = new TimetableApiClient();
export default timetableApiClient;