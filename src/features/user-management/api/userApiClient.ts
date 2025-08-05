import BaseApiClient from "@/common/api/baseApiClient";
import type { CreateUserData, ClassLevelData, ClassArmData, UserListItem, DetailedUser } from "../types/user.types";

class UserApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Create a new user
  async createUser(userData: CreateUserData): Promise<{ message: string }> {
    try {
      console.log("📡 API: createUser called", userData);
      
      // Transform data to match API expectations  
      const { password, assignedClassArms, ...dataWithoutPassword } = userData as any;
      
      // Handle field transformations
      let transformedData: any = {
        ...dataWithoutPassword,
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
      console.log("✅ API: createUser success", response);
      return response;
    } catch (error) {
      console.error("❌ API: createUser failed:", error);
      throw error;
    }
  }

  // Get all students (for parent linking)
  async getStudents(): Promise<any[]> {
    try {
      console.log("📡 API: getStudents called");
      const response = await this.get<{ data: { students: any[] } }>("/admin/all-students");
      console.log("✅ API: getStudents success", response);
      return response.data.students || [];
    } catch (error) {
      console.error("❌ API: getStudents failed:", error);
      throw error;
    }
  }

  // Get all classes (for teacher assignment)
  async getClasses(): Promise<any[]> {
    try {
      console.log("📡 API: getClasses called");
      const response = await this.get<{ classes: any[] }>("/classes");
      console.log("✅ API: getClasses success", response);
      return response.classes;
    } catch (error) {
      console.error("❌ API: getClasses failed:", error);
      throw error;
    }
  }

  // Get all class levels
  async getClassLevels(): Promise<any[]> {
    try {
      console.log("📡 API: getClassLevels called");
      const response = await this.get<{ data: ClassLevelData[] }>("/classes/levels/get-all");
      console.log("✅ API: getClassLevels success", response);
      // BaseApiClient already extracts the data, so response is the actual data object
      const levels = Array.isArray(response.data) ? response.data : [];
      
      // Transform arms array to map armName to name for consistency
      return levels.map(level => ({
        ...level,
        arms: level.arms && Array.isArray(level.arms) 
          ? level.arms.map((arm: any) => ({
              ...arm,
              name: arm.armName
            }))
          : level.arms
      }));
    } catch (error) {
      console.error("❌ API: getClassLevels failed:", error);
      throw error;
    }
  }

  // Get all class arms
  async getClassArms(): Promise<any[]> {
    try {
      console.log("📡 API: getClassArms called");
      const response = await this.get<{ data: ClassArmData[] }>("/classes/arms/get-all");
      console.log("✅ API: getClassArms success", response);
      // BaseApiClient already extracts the data, so response is the actual data object
      const arms = Array.isArray(response.data) ? response.data : [];
      
      // Map armName to name for frontend consistency
      return arms.map(arm => ({
        ...arm,
        name: arm.armName
      }));
    } catch (error) {
      console.error("❌ API: getClassArms failed:", error);
      throw error;
    }
  }

  // Get all users list
  async getAllUsers(): Promise<UserListItem[]> {
    try {
      console.log("📡 API: getAllUsers called");
      const response = await this.get<{ data: { users: UserListItem[] } }>("/admin/all-users-list");
      console.log("✅ API: getAllUsers success", response);
      return response.data.users || [];
    } catch (error) {
      console.error("❌ API: getAllUsers failed:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<DetailedUser> {
    try {
      console.log("📡 API: getUserById called", userId);
      const response = await this.get<{ data: { user: DetailedUser } }>(`/admin/user-by-id/${userId}`);
      console.log("✅ API: getUserById success", response);
      return response.data.user;
    } catch (error) {
      console.error("❌ API: getUserById failed:", error);
      throw error;
    }
  }

  // Update student
  async updateStudent(studentId: string, data: any): Promise<{ message: string }> {
    try {
      console.log("📡 API: updateStudent called", studentId, data);
      const response = await this.put<{ message: string }>(`/admin/update-student/${studentId}`, data);
      console.log("✅ API: updateStudent success", response);
      return response;
    } catch (error) {
      console.error("❌ API: updateStudent failed:", error);
      throw error;
    }
  }

  // Update teacher
  async updateTeacher(teacherId: string, data: any): Promise<{ message: string }> {
    try {
      console.log("📡 API: updateTeacher called", teacherId, data);
      const response = await this.put<{ message: string }>(`/admin/update-teacher/${teacherId}`, data);
      console.log("✅ API: updateTeacher success", response);
      return response;
    } catch (error) {
      console.error("❌ API: updateTeacher failed:", error);
      throw error;
    }
  }

  // Update parent
  async updateParent(parentId: string, data: any): Promise<{ message: string }> {
    try {
      console.log("📡 API: updateParent called", parentId, data);
      const response = await this.put<{ message: string }>(`/admin/update-parent/${parentId}`, data);
      console.log("✅ API: updateParent success", response);
      return response;
    } catch (error) {
      console.error("❌ API: updateParent failed:", error);
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
      console.error("❌ API: updateUser failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const userApiClient = new UserApiClient();