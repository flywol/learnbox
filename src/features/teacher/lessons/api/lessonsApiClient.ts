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
    try {
      const formData = createFormData(data);
      return this.post('/lessons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      // Fallback to localStorage for now
      const mockLesson: LessonResponse = {
        id: `local-lesson-${Date.now()}`,
        title: data.title,
        number: data.number,
        startDate: data.startDate,
        subject: data.subject,
        class: data.class,
        classArm: data.classArm,
        contentType: data.contentType,
        contentTitle: data.contentTitle,
        contentDescription: data.contentDescription,
        assignmentTitle: data.assignmentTitle,
        assignmentDescription: data.assignmentDescription,
        assignmentDueDate: data.assignmentDueDate,
        assignmentDueTime: data.assignmentDueTime,
        acceptLateSubmissions: data.acceptLateSubmissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const stored = localStorage.getItem(`lessons_${data.subject}`);
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(mockLesson);
      localStorage.setItem(`lessons_${data.subject}`, JSON.stringify(existing));
      
      return mockLesson;
    }
  }

  async getLessons(): Promise<GetLessonsResponse> {
    return this.get('/lessons');
  }

  async getLesson(id: string): Promise<LessonResponse> {
    const response: any = await this.get(`/lessons/${id}`);
    const lesson = response.data.lesson;
    
    // Transform API response to match expected interface
    return {
      id: lesson._id,
      title: lesson.title,
      number: lesson.number,
      startDate: new Date(lesson.startDate).toLocaleDateString(),
      subject: lesson.subject?.name || lesson.subject,
      class: lesson.class?.class || lesson.class,
      classArm: lesson.classArm?.armName || lesson.classArm,
      contentType: lesson.content?.type || 'file',
      contentTitle: lesson.content?.title || lesson.title,
      contentDescription: lesson.content?.description || '',
      fileUrl: lesson.content?.url,
      assignmentTitle: lesson.assignment?.title,
      assignmentDescription: lesson.assignment?.description,
      assignmentDueDate: lesson.assignment?.dueDate,
      assignmentDueTime: lesson.assignment?.dueTime,
      acceptLateSubmissions: lesson.assignment?.acceptLateSubmissions,
      assignmentFileUrl: lesson.assignment?.fileUrl,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt
    };
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

    const response: any = await this.get(url);
    
    // Transform API response to match expected interface
    return {
      lessons: response.data.lessons.map((lesson: any) => ({
        id: lesson._id,
        title: lesson.title,
        number: parseInt(lesson.number, 10),
        startDate: lesson.startDate,
        subject: lesson.subject,
        class: lesson.class,
        classArm: lesson.classArm,
        contentType: lesson.content?.type || 'file',
        contentTitle: lesson.content?.title || lesson.title,
        contentDescription: lesson.content?.description || '',
        fileUrl: lesson.content?.url,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      }))
    };
  }
}

export const lessonsApiClient = new LessonsApiClient();