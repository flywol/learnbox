import BaseApiClient from "@/common/api/baseApiClient";

export interface Subject {
  id: string;
  name: string;
}

export interface AddSubjectsRequest {
  subjects: Array<{
    name: string;
  }>;
}

export interface SubjectsResponse {
  subjects: Subject[];
}

class SubjectsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Get subjects for a specific class and arm
  async getSubjectsForClass(classId: string, classArmId: string): Promise<Subject[]> {
    
    try {
      const response = await this.get<SubjectsResponse>(`/subjects/get/${classId}/${classArmId}`);
      
      // Transform _id to id for frontend consistency
      const subjects = response.subjects.map((subject: any) => {
        return {
          ...subject,
          id: subject._id || subject.id
        };
      });
      
      
      return subjects;
      
    } catch (error) {
      throw error;
    }
  }

  // Add subjects to a specific class and arm
  async addSubjectsToClass(classId: string, classArmId: string, subjects: AddSubjectsRequest): Promise<{ message: string }> {

    
    try {
      const response = await this.post<{ message: string }>(`/subjects/add/${classId}/${classArmId}`, subjects);
      
      return response;
      
    } catch (error: any) {
      throw error;
    }
  }
}

// Export singleton instance
export const subjectsApiClient = new SubjectsApiClient();