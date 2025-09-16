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
  data: {
    subjects: Subject[];
  };
}

class SubjectsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Get subjects for a specific class
  async getSubjectsForClass(classId: string): Promise<Subject[]> {
    try {
      const response = await this.get<SubjectsResponse>(`/subjects/get/${classId}`);
      
      // Transform _id to id for frontend consistency
      const subjects = response.data.subjects.map((subject: any) => ({
        ...subject,
        id: subject._id || subject.id
      }));
      
      return subjects;
    } catch (error) {
      throw error;
    }
  }

  // Add subjects to a specific class
  async addSubjectsToClass(classId: string, subjects: AddSubjectsRequest): Promise<{ message: string }> {
    try {
      const response = await this.post<{ message: string }>(`/subjects/add/${classId}`, subjects);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const subjectsApiClient = new SubjectsApiClient();