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

    // Enhanced validation logging
    console.log('🔍 [SubjectsAPI] Request validation:', {
      classIdValid: !!classId && classId.length > 0,
      classArmIdValid: !!classArmId && classArmId.length > 0,
      dataValid: !!subjects && !!subjects.subjects,
      subjectsArrayValid: Array.isArray(subjects.subjects) && subjects.subjects.length > 0,
      fullEndpoint: `/subjects/add/${classId}/${classArmId}`,
      requestPayload: JSON.stringify(subjects, null, 2),
      parameterTypes: {
        classId: typeof classId,
        classArmId: typeof classArmId,
        subjects: typeof subjects
      },
      idAnalysis: {
        classIdLength: classId?.length || 0,
        classArmIdLength: classArmId?.length || 0,
        classIdPattern: /^[a-f\d]{24}$/i.test(classId) ? 'Valid MongoDB ObjectId' : 'Not MongoDB ObjectId pattern',
        classArmIdPattern: /^[a-f\d]{24}$/i.test(classArmId) ? 'Valid MongoDB ObjectId' : 'Not MongoDB ObjectId pattern'
      }
    });
    
    try {
      const startTime = performance.now();
      console.log('🌐 [SubjectsAPI] Making API request:', {
        method: 'POST',
        endpoint: `/subjects/add/${classId}/${classArmId}`,
        headers: 'Will include auth headers from base client',
        payload: subjects,
        timestamp: new Date().toISOString(),
        fullUrl: `${this.api.defaults.baseURL}/subjects/add/${classId}/${classArmId}`
      });

      const response = await this.post<{ message: string }>(`/subjects/add/${classId}/${classArmId}`, subjects);
      const endTime = performance.now();
      
      console.log('✅ [SubjectsAPI] Add subjects SUCCESS:', {
        endpoint: `/subjects/add/${classId}/${classArmId}`,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`,
        statusCode: 'N/A',
        message: response?.message || 'N/A',
        fullResponse: response,
        addedSubjects: subjects.subjects.length,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      return response;
      
    } catch (error: any) {
      const errorDetails = {
        classId,
        classArmId,
        subjects: subjects,
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorName: error?.name || 'UnknownError',
        errorCode: error?.code || 'N/A',
        statusCode: error?.response?.status || error?.status || 'N/A',
        responseData: error?.response?.data || error?.data || 'N/A',
        requestUrl: error?.config?.url || 'N/A',
        requestMethod: error?.config?.method || 'POST',
        endpoint: `/subjects/add/${classId}/${classArmId}`,
        isAxiosError: error?.isAxiosError || false,
        timestamp: new Date().toISOString(),
        httpDetails: {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          headers: error?.response?.headers,
          config: {
            url: error?.config?.url,
            method: error?.config?.method,
            data: error?.config?.data
          }
        }
      };

      console.error('❌ [SubjectsAPI] Add subjects FAILED:', errorDetails);

      // Additional specific error analysis
      if (error?.response?.status === 404) {
        console.error('🔍 [SubjectsAPI] 404 Analysis - Class arm not found:', {
          possibleCauses: [
            'Class ID does not exist in database',
            'Class arm ID does not exist for this class',
            'Mismatch between created class IDs and expected IDs',
            'Backend database not updated after class creation',
            'Wrong ID format (expecting MongoDB ObjectId)',
            'Class arm relationship not properly established'
          ],
          classIdFormat: typeof classId,
          classArmIdFormat: typeof classArmId,
          classIdValue: classId,
          classArmIdValue: classArmId,
          suggestedActions: [
            'Verify class was created successfully',
            'Check if arm was created with correct class relationship',
            'Confirm ID formats match backend expectations',
            'Try refetching class data to get updated IDs'
          ],
          idPatternAnalysis: {
            classIdIsObjectId: /^[a-f\d]{24}$/i.test(classId),
            classArmIdIsObjectId: /^[a-f\d]{24}$/i.test(classArmId),
            classIdContainsSlash: classId.includes('/'),
            classArmIdContainsSlash: classArmId.includes('/')
          }
        });
      }

      if (error?.response?.status === 500) {
        console.error('🔍 [SubjectsAPI] 500 Analysis - Server error:', {
          possibleCauses: [
            'Database connection issues',
            'Internal server validation failure',
            'Backend code error in subject creation logic'
          ],
          responseMessage: error?.response?.data?.message || 'No error message'
        });
      }

      throw error;
    }
  }
}

// Export singleton instance
export const subjectsApiClient = new SubjectsApiClient();