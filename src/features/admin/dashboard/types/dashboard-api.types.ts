// src/features/dashboard/types/dashboard-api.types.ts

export interface AllUsersResponse {
  data: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    activeUsers: number;
    newRegistrations: number;
  };
}

export interface ClassInformationResponse {
  data: {
    totalClasses: number;
    activeLearners: number;
  };
}

export interface DashboardStats {
  // User stats
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  activeUsers: number;
  newRegistrations: number;
  
  // Class stats
  totalClasses: number;
  activeLearners: number;
}

// Classes API Types
export interface CreateClassesRequest {
  classes: {
    levelName: string;
    class: string;
    arms: string[];
  }[];
}

export interface CreateClassesResponse {
  statusCode: number;
  message: string;
  data: {
    classes: {
      _id: string;
      levelName: string;
      class: string;
      arms: string[];
    }[];
  };
}

export interface AddClassArmsRequest {
  classId: string;
  armNames: string[];
}

export interface AddClassArmsResponse {
  statusCode: number;
  message: string;
  data: {
    class: {
      _id: string;
      levelName: string;
      class: string;
      arms: string[];
    };
  };
}

// Sessions API Types
export interface CreateSessionRequest {
  name: string;
  firstTermStartDate: string;
  firstTermEndDate: string;
  secondTermStartDate: string;
  secondTermEndDate: string;
  thirdTermStartDate: string;
  thirdTermEndDate: string;
  firstTermName: string;
  secondTermName: string;
  thirdTermName: string;
}

export interface CreateSessionResponse {
  statusCode: number;
  message: string;
  data: {
    session: {
      _id: string;
      name: string;
      firstTermStartDate: string;
      firstTermEndDate: string;
      secondTermStartDate: string;
      secondTermEndDate: string;
      thirdTermStartDate: string;
      thirdTermEndDate: string;
      firstTermName: string;
      secondTermName: string;
      thirdTermName: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}