// API matches - use these exact values
export type TaskType = 'Assignment' | 'Quiz' | 'Class' | 'Custom';
export type RepeatOption = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

// API Response - Direct from backend (with _id)
export interface ApiTask {
  _id: string;
  title: string;
  description: string;
  startDate: string;              // ISO 8601
  taskType: TaskType;
  scheduleTime: string;           // ISO 8601
  repeat: RepeatOption;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Frontend Task (with id mapped from _id for easier use)
export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  taskType: TaskType;
  scheduleTime: string;
  repeat: RepeatOption;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create Task Request (what we send to POST /api/v1/tasks)
export interface CreateTaskRequest {
  title: string;
  description: string;
  startDate: string;              // ISO 8601: "2025-01-15T00:00:00.000Z"
  scheduleTime: string;           // ISO 8601: "2025-01-15T14:30:00.000Z"
  taskType: TaskType;
  repeat: RepeatOption;
}

// Update Task Request (what we send to PUT /api/v1/tasks/:id)
export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  isCompleted?: boolean;
}

// API Response Types
export interface TaskResponse {
  data: {
    task: ApiTask;
  };
}

export interface TasksListResponse {
  data: {
    tasks: ApiTask[];
    total: number;
  };
}

// Form data (what CreateTaskPage collects before transforming for API)
export interface CreateTaskFormData {
  title: string;
  description: string;
  scheduleStartDate: string;      // Date from date picker: "2025-01-15"
  scheduleTime: string;           // Time from TimePicker: "1:30 PM"
  taskType: TaskType;
  customTaskType?: string;
  repeat: RepeatOption;
}