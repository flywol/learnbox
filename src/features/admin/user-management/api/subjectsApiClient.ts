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
    console.log('🔍 [SubjectsAPI] Getting subjects for class:', { classId, classArmId });
    
    try {
      const startTime = performance.now();
      const response = await this.get<SubjectsResponse>(`/subjects/get/${classId}/${classArmId}`);
      const endTime = performance.now();
      
      console.log('📊 [SubjectsAPI] Raw API response:', {
        endpoint: `/subjects/get/${classId}/${classArmId}`,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`,
        rawResponse: response,
        subjectsCount: response.subjects?.length || 0
      });
      
      // Transform _id to id for frontend consistency
      const subjects = response.subjects.map((subject: any, index) => {
        const transformed = {
          ...subject,
          id: subject._id || subject.id
        };
        
        console.log(`📝 [SubjectsAPI] Transformed subject ${index + 1}:`, {
          original: subject,
          transformed: transformed,
          hasIdField: !!subject.id,
          has_IdField: !!subject._id
        });
        
        return transformed;
      });
      
      console.log('✅ [SubjectsAPI] Final subjects array:', {
        totalSubjects: subjects.length,
        subjects: subjects,
        subjectNames: subjects.map(s => s.name),
        subjectIds: subjects.map(s => s.id)
      });
      
      return subjects;
      
    } catch (error) {
      console.error('❌ [SubjectsAPI] Error fetching subjects:', {
        classId,
        classArmId,
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        endpoint: `/subjects/get/${classId}/${classArmId}`
      });
      throw error;
    }
  }

  // Add subjects to a specific class and arm
  async addSubjectsToClass(classId: string, classArmId: string, subjects: AddSubjectsRequest): Promise<{ message: string }> {
    console.log('➕ [SubjectsAPI] Adding subjects to class:', {
      classId,
      classArmId,
      subjectsToAdd: subjects,
      subjectCount: subjects.subjects.length,
      subjectNames: subjects.subjects.map(s => s.name)
    });
    
    try {
      const startTime = performance.now();
      const response = await this.post<{ message: string }>(`/subjects/add/${classId}/${classArmId}`, subjects);
      const endTime = performance.now();
      
      console.log('✅ [SubjectsAPI] Successfully added subjects:', {
        endpoint: `/subjects/add/${classId}/${classArmId}`,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`,
        response: response,
        addedSubjects: subjects.subjects.length
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ [SubjectsAPI] Error adding subjects:', {
        classId,
        classArmId,
        subjects: subjects,
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        endpoint: `/subjects/add/${classId}/${classArmId}`
      });
      throw error;
    }
  }
}

// Export singleton instance
export const subjectsApiClient = new SubjectsApiClient();