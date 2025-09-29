import BaseApiClient from '@/common/api/baseApiClient';

export interface CreateLessonRequest {
  title: string;
  number: string;
  startDate: string; // DD/MM/YYYY format
  subject: string;
  class: string;
  classArm?: string;
  contentType: 'video' | 'file' | 'assignment' | 'quiz';
  contentTitle: string;
  contentDescription: string;
  file?: File;
  assignmentTitle?: string;
  assignmentDescription?: string;
  assignmentDueDate?: string; // DD/MM/YYYY format
  assignmentDueTime?: string;
  acceptLateSubmissions?: boolean;
  assignmentFile?: File;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

export interface LessonResponse {
  id: string;
  title: string;
  number: string;
  startDate: string;
  subject: string;
  class: string;
  classArm?: string;
  contentType: string;
  contentTitle: string;
  contentDescription: string;
  fileUrl?: string;
  assignmentTitle?: string;
  assignmentDescription?: string;
  assignmentDueDate?: string;
  assignmentDueTime?: string;
  acceptLateSubmissions?: boolean;
  assignmentFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetLessonsResponse {
  lessons: LessonResponse[];
}

const createFormData = (data: CreateLessonRequest | UpdateLessonRequest): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value as string);
      }
    }
  });
  
  return formData;
};

class LessonsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  async createLesson(data: CreateLessonRequest): Promise<LessonResponse> {
    const formData = createFormData(data);
    return this.post('/lessons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getLessons(): Promise<GetLessonsResponse> {
    return this.get('/lessons');
  }

  async getLesson(id: string): Promise<LessonResponse> {
    return this.get(`/lessons/${id}`);
  }

  async updateLesson(id: string, data: UpdateLessonRequest): Promise<LessonResponse> {
    const formData = createFormData(data);
    return this.put(`/lessons/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteLesson(id: string): Promise<void> {
    return this.delete(`/lessons/${id}`);
  }

  async getLessonsByClassAndSubject(
    classId: string, 
    subjectId: string, 
    classArmId?: string
  ): Promise<GetLessonsResponse> {
    const params = new URLSearchParams();
    if (classArmId) {
      params.append('classArmId', classArmId);
    }
    
    const queryString = params.toString();
    const url = `/lessons/class/${classId}/subject/${subjectId}${queryString ? `?${queryString}` : ''}`;
    
    return this.get(url);
  }
}

export const lessonsApiClient = new LessonsApiClient();