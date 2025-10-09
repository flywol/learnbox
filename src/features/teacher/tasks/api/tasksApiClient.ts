import BaseApiClient from '@/common/api/baseApiClient';
import type {
  ApiTask,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TasksListResponse,
} from '../types/task.types';

class TasksApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  /**
   * Transform API task (_id) to frontend task (id)
   */
  private transformTask(apiTask: ApiTask): Task {
    const { _id, __v, userId, ...rest } = apiTask;
    return {
      id: _id,
      ...rest,
    };
  }

  /**
   * GET /api/v1/tasks
   * Get all tasks for the authenticated user
   */
  async getAllTasks(): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>('/tasks');
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/:id
   * Get a specific task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    const response = await this.get<TaskResponse>(`/tasks/${id}`);
    return this.transformTask(response.data.task);
  }

  /**
   * GET /api/v1/tasks/today
   * Get today's tasks
   */
  async getTodaysTasks(): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>('/tasks/today');
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/upcoming?days={days}
   * Get upcoming tasks (default: 7 days ahead)
   */
  async getUpcomingTasks(days: number = 7): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>(`/tasks/upcoming?days=${days}`);
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/overdue
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>('/tasks/overdue');
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/completed
   * Get completed tasks
   */
  async getCompletedTasks(): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>('/tasks/completed');
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/pending
   * Get pending (incomplete) tasks
   */
  async getPendingTasks(): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>('/tasks/pending');
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/by-type/{taskType}
   * Get tasks by task type
   */
  async getTasksByType(taskType: string): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>(`/tasks/by-type/${taskType}`);
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/by-repeat/{repeat}
   * Get tasks by repeat type
   */
  async getTasksByRepeat(repeat: string): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>(`/tasks/by-repeat/${repeat}`);
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * GET /api/v1/tasks/by-date-range?startDate={startDate}&endDate={endDate}
   * Get tasks within a date range
   */
  async getTasksByDateRange(
    startDate: string,
    endDate: string
  ): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.get<TasksListResponse>(
      `/tasks/by-date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return {
      tasks: response.data.tasks.map(task => this.transformTask(task)),
      total: response.data.total,
    };
  }

  /**
   * POST /api/v1/tasks
   * Create a new task
   */
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await this.post<TaskResponse>('/tasks', data);
    return this.transformTask(response.data.task);
  }

  /**
   * PUT /api/v1/tasks/:id
   * Update a task
   */
  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await this.put<TaskResponse>(`/tasks/${id}`, data);
    return this.transformTask(response.data.task);
  }

  /**
   * DELETE /api/v1/tasks/:id
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    await this.delete(`/tasks/${id}`);
  }

  /**
   * PATCH /api/v1/tasks/:id/toggle-completion
   * Toggle task completion status
   */
  async toggleCompletion(id: string): Promise<Task> {
    const response = await this.patch<TaskResponse>(`/tasks/${id}/toggle-completion`);
    return this.transformTask(response.data.task);
  }
}

export const tasksApiClient = new TasksApiClient();
