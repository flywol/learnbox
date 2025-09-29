import BaseApiClient from '@/common/api/baseApiClient';

export interface ClassResponse {
  id: string;
  name: string;
  level: string;
  arms?: {
    id: string;
    name: string;
  }[];
}

export interface SubjectResponse {
  _id: string;
  name: string;
  classRef?: string | null;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TeacherSubjectsClassesResponse {
  assignedSubjects: SubjectResponse[];
  classes?: ClassResponse[];
}

class SubjectsClassesApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  async getTeacherSubjectsAndClasses(): Promise<TeacherSubjectsClassesResponse> {
    return this.get('/teacher/subjects-classes');
  }
}

export const subjectsClassesApiClient = new SubjectsClassesApiClient();