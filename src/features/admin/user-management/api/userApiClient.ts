import BaseApiClient from "@/common/api/baseApiClient";
import type { ClassLevelData, ClassArmData, UserListItem, DetailedUser } from "../types/user.types";
import type { CreateUserFormData } from "../schemas/userSchema";

class UserApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Create a new user
  async createUser(userData: CreateUserFormData): Promise<{ message: string }> {
    try {
      
      // Transform data to match API expectations  
      const { assignedClassArms, ...transformData } = userData as any;
      
      // Handle field transformations
      let transformedData: any = {
        ...transformData,
        role: userData.role.toLowerCase() // Convert to lowercase for API
      };

      // Transform parentGuardianName -> parentName for API (for students)
      if (userData.role === "Student" && (userData as any).parentGuardianName) {
        const { parentGuardianName, ...restData } = transformedData;
        transformedData = {
          ...restData,
          parentName: parentGuardianName
        };
      }

      // Transform assignedClasses -> assignedClass for API (only for teachers)
      if (userData.role === "Teacher" && (userData as any).assignedClasses) {
        const { assignedClasses, ...restData } = transformedData;
        transformedData = {
          ...restData,
          assignedClass: assignedClasses
        };
      }

      // Determine endpoint based on user role
      let endpoint: string;
      const role = userData.role as "Student" | "Teacher" | "Parent";
      switch (role) {
        case "Student":
          endpoint = "/admin/add-student";
          break;
        case "Teacher":
          endpoint = "/admin/add-teacher";
          break;
        case "Parent":
          endpoint = "/admin/add-parent";
          break;
        default:
          throw new Error(`Unknown user role: ${role}`);
      }

      const response = await this.post<{ message: string }>(endpoint, transformedData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all students (for parent linking)
  async getStudents(): Promise<any[]> {
    try {
      const response = await this.get<{ data: { students: any[] } }>("/admin/all-students");
      const students = response.data.students || [];
      
      // Transform _id to id for frontend consistency
      return students.map((student: any) => ({
        ...student,
        id: student._id
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all classes (for teacher assignment)
  async getClasses(): Promise<any[]> {
    try {
      const response = await this.get<{ classes: any[] }>("/classes");
      return response.classes;
    } catch (error) {
      throw error;
    }
  }

  // Get all class levels
  async getClassLevels(): Promise<any[]> {
    try {
      const response = await this.get<{ data: ClassLevelData[] }>("/classes/levels/get-all");
      
      // BaseApiClient already extracts the data, so response is the actual data object
      const levels = Array.isArray(response.data) ? response.data : [];
      
      // Transform arms array to map armName to name for consistency
      const transformedLevels = levels.map((level: any) => ({
        ...level,
        id: level._id, // Map MongoDB _id to id for frontend consistency
        arms: level.arms && Array.isArray(level.arms) 
          ? level.arms.map((arm: any) => ({
              ...arm,
              id: arm.id, // Use the existing id field, not _id
              name: arm.armName
            }))
          : level.arms
      }));
      
      return transformedLevels;
    } catch (error) {
      throw error;
    }
  }

  // Get all class arms
  async getClassArms(): Promise<any[]> {
    try {
      const response = await this.get<{ data: ClassArmData[] }>("/classes/arms/get-all");
      // BaseApiClient already extracts the data, so response is the actual data object
      const arms = Array.isArray(response.data) ? response.data : [];
      
      // Map armName to name for frontend consistency
      return arms.map((arm: any) => ({
        ...arm,
        id: arm._id, // Map MongoDB _id to id for frontend consistency
        name: arm.armName
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all users list
  async getAllUsers(): Promise<UserListItem[]> {
    try {
      const response = await this.get<{ data: { users: any[] } }>("/admin/all-users-list");
      const users = response.data.users || [];
      
      // Transform _id to id for frontend consistency
      return users.map((user: any) => ({
        ...user,
        id: user._id
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<DetailedUser> {
    try {
      const response = await this.get<{ data: { user: any } }>(`/admin/students/${userId}`);
      const user = response.data.user;
      
      // Transform _id to id for frontend consistency
      return {
        ...user,
        id: user._id
      };
    } catch (error) {
      throw error;
    }
  }

  // Update student
  async updateStudent(studentId: string, data: any): Promise<{ message: string }> {
    try {
      const response = await this.put<{ message: string }>(`/admin/update-student/${studentId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update teacher
  async updateTeacher(teacherId: string, data: any): Promise<{ message: string }> {
    try {
      const response = await this.put<{ message: string }>(`/admin/update-teacher/${teacherId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update parent
  async updateParent(parentId: string, data: any): Promise<{ message: string }> {
    try {
      const response = await this.put<{ message: string }>(`/admin/update-parent/${parentId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update user (role-based routing)
  async updateUser(userId: string, data: any, role: string): Promise<{ message: string }> {
    try {
      switch (role.toLowerCase()) {
        case 'student':
          return await this.updateStudent(userId, data);
        case 'teacher':
          return await this.updateTeacher(userId, data);
        case 'parent':
          return await this.updateParent(userId, data);
        default:
          throw new Error(`Update not supported for role: ${role}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const userApiClient = new UserApiClient();