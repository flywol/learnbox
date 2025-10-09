// Teacher Dashboard API Types

export interface ClassroomOverview {
  totalStudents: number;
  totalClasses: number;
  assignmentsCreated: number;
  assignmentsNotGraded: number;
  overdueCreated: number;
  overdueNotGraded: number;
}

export interface UpcomingTask {
  _id: string;
  title: string;
  description: string;
  taskType: string;
  startDate: string;
  scheduleTime: string;
  repeat: string;
  status: string;
}

export interface TasksSummary {
  completed: number;
  total: number;
  upcomingTasks: UpcomingTask[];
}

export interface DashboardEvent {
  _id: string;
  description: string;
  receivers: string;
  date: string;
}

export interface DashboardData {
  classroomOverview: ClassroomOverview;
  tasks: TasksSummary;
  events: DashboardEvent[];
}

export interface DashboardApiResponse {
  data: DashboardData;
}
