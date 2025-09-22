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

  // Get subjects for a specific class and arm
  async getSubjectsForClass(classId: string, classArmId: string): Promise<Subject[]> {
    const response = await this.get<SubjectsResponse>(`/subjects/get/${classId}/${classArmId}`);
    
    // Transform _id to id for frontend consistency
    const subjects = response.data.subjects.map((subject: any) => ({
      ...subject,
      id: subject._id || subject.id
    }));
    
    return subjects;
  }

  // Add subjects to a specific class and arm
  async addSubjectsToClass(classId: string, classArmId: string, subjects: AddSubjectsRequest): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(`/subjects/add/${classId}/${classArmId}`, subjects);
    return response;
  }
}

// Export singleton instance
export const subjectsApiClient = new SubjectsApiClient();