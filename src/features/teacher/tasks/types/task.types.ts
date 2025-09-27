export type TaskType = 'Assignment' | 'Quiz' | 'Class' | 'Custom';

export type RepeatOption = 'Does not repeat' | 'Every day' | 'Every week' | 'Every month' | 'Every year';

export interface Task {
  id: string;
  title: string;
  description: string;
  scheduleStartDate: string;
  scheduleTime: string;
  taskType: TaskType;
  repeat: RepeatOption;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  scheduleStartDate: string;
  scheduleTime: string;
  taskType: TaskType;
  customTaskType?: string;
  repeat: RepeatOption;
}