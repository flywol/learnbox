import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { tasksApiClient } from './tasksApiClient';
import type { CreateTaskRequest, UpdateTaskRequest, ApiTask } from '../types/task.types';

describe('TasksApiClient', () => {
  let mockAxios: MockAdapter;

  const mockApiTask: ApiTask = {
    _id: 'task-123',
    title: 'Grade Assignments',
    description: 'Grade JSS1 math assignments',
    taskType: 'Assignment',
    startDate: '2025-01-15',
    scheduleTime: '10:00',
    repeat: 'none',
    isCompleted: false,
    userId: 'user-123',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
    __v: 0,
  };

  beforeEach(() => {
    mockAxios = new MockAdapter(tasksApiClient['api']);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('getAllTasks', () => {
    it('should fetch all tasks and transform them', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks').reply(200, mockResponse);

      const result = await tasksApiClient.getAllTasks();

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe('task-123');
      expect(result.tasks[0]).not.toHaveProperty('_id');
      expect(result.tasks[0]).not.toHaveProperty('__v');
      expect(result.tasks[0]).not.toHaveProperty('userId');
      expect(result.total).toBe(1);
    });
  });

  describe('getTaskById', () => {
    it('should fetch a specific task by ID', async () => {
      const mockResponse = {
        data: {
          task: mockApiTask,
        },
      };

      mockAxios.onGet('/tasks/task-123').reply(200, mockResponse);

      const result = await tasksApiClient.getTaskById('task-123');

      expect(result.id).toBe('task-123');
      expect(result.title).toBe('Grade Assignments');
    });
  });

  describe('getTodaysTasks', () => {
    it('should fetch today\'s tasks', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/today').reply(200, mockResponse);

      const result = await tasksApiClient.getTodaysTasks();

      expect(result.tasks).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockAxios.history.get[0].url).toBe('/tasks/today');
    });
  });

  describe('getUpcomingTasks', () => {
    it('should fetch upcoming tasks with default days', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/upcoming?days=7').reply(200, mockResponse);

      const result = await tasksApiClient.getUpcomingTasks();

      expect(result.tasks).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe('/tasks/upcoming?days=7');
    });

    it('should fetch upcoming tasks with custom days', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/upcoming?days=14').reply(200, mockResponse);

      const result = await tasksApiClient.getUpcomingTasks(14);

      expect(result.tasks).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe('/tasks/upcoming?days=14');
    });
  });

  describe('getOverdueTasks', () => {
    it('should fetch overdue tasks', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/overdue').reply(200, mockResponse);

      const result = await tasksApiClient.getOverdueTasks();

      expect(result.tasks).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getCompletedTasks', () => {
    it('should fetch completed tasks', async () => {
      const completedTask = { ...mockApiTask, isCompleted: true };
      const mockResponse = {
        data: {
          tasks: [completedTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/completed').reply(200, mockResponse);

      const result = await tasksApiClient.getCompletedTasks();

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].isCompleted).toBe(true);
    });
  });

  describe('getPendingTasks', () => {
    it('should fetch pending tasks', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/pending').reply(200, mockResponse);

      const result = await tasksApiClient.getPendingTasks();

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].isCompleted).toBe(false);
    });
  });

  describe('getTasksByType', () => {
    it('should fetch tasks by task type', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/by-type/grading').reply(200, mockResponse);

      const result = await tasksApiClient.getTasksByType('grading');

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].taskType).toBe('grading');
      expect(mockAxios.history.get[0].url).toBe('/tasks/by-type/grading');
    });
  });

  describe('getTasksByRepeat', () => {
    it('should fetch tasks by repeat type', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks/by-repeat/daily').reply(200, mockResponse);

      const result = await tasksApiClient.getTasksByRepeat('daily');

      expect(result.tasks).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe('/tasks/by-repeat/daily');
    });
  });

  describe('getTasksByDateRange', () => {
    it('should fetch tasks by date range', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios
        .onGet('/tasks/by-date-range?startDate=2025-01-01&endDate=2025-01-31')
        .reply(200, mockResponse);

      const result = await tasksApiClient.getTasksByDateRange('2025-01-01', '2025-01-31');

      expect(result.tasks).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe(
        '/tasks/by-date-range?startDate=2025-01-01&endDate=2025-01-31'
      );
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createData: CreateTaskRequest = {
        title: 'New Task',
        description: 'Task description',
        taskType: 'Class',
        startDate: '2025-01-20',
        scheduleTime: '14:00',
        repeat: 'weekly',
      };

      const mockResponse = {
        data: {
          task: {
            ...mockApiTask,
            title: 'New Task',
            taskType: 'Class',
          },
        },
      };

      mockAxios.onPost('/tasks').reply(200, mockResponse);

      const result = await tasksApiClient.createTask(createData);

      expect(result.id).toBe('task-123');
      expect(result.title).toBe('New Task');
      expect(mockAxios.history.post.length).toBe(1);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updateData: UpdateTaskRequest = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const mockResponse = {
        data: {
          task: {
            ...mockApiTask,
            title: 'Updated Task',
            description: 'Updated description',
          },
        },
      };

      mockAxios.onPut('/tasks/task-123').reply(200, mockResponse);

      const result = await tasksApiClient.updateTask('task-123', updateData);

      expect(result.id).toBe('task-123');
      expect(result.title).toBe('Updated Task');
      expect(result.description).toBe('Updated description');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockAxios.onDelete('/tasks/task-123').reply(200);

      await tasksApiClient.deleteTask('task-123');

      expect(mockAxios.history.delete.length).toBe(1);
      expect(mockAxios.history.delete[0].url).toBe('/tasks/task-123');
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion status', async () => {
      const mockResponse = {
        data: {
          task: {
            ...mockApiTask,
            isCompleted: true,
          },
        },
      };

      mockAxios.onPatch('/tasks/task-123/toggle-completion').reply(200, mockResponse);

      const result = await tasksApiClient.toggleCompletion('task-123');

      expect(result.id).toBe('task-123');
      expect(result.isCompleted).toBe(true);
      expect(mockAxios.history.patch.length).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockAxios.onGet('/tasks').networkError();

      await expect(tasksApiClient.getAllTasks()).rejects.toThrow();
    });

    it('should handle 404 errors', async () => {
      mockAxios.onGet('/tasks/non-existent').reply(404);

      await expect(tasksApiClient.getTaskById('non-existent')).rejects.toThrow();
    });

    it('should handle 500 errors', async () => {
      mockAxios.onPost('/tasks').reply(500);

      const createData: CreateTaskRequest = {
        title: 'Test',
        description: 'Test',
        taskType: 'Quiz',
        startDate: '2025-01-15',
        scheduleTime: '10:00',
        repeat: 'none',
      };

      await expect(tasksApiClient.createTask(createData)).rejects.toThrow();
    });
  });

  describe('Task Transformation', () => {
    it('should remove internal fields from transformed tasks', async () => {
      const mockResponse = {
        data: {
          tasks: [mockApiTask],
          total: 1,
        },
      };

      mockAxios.onGet('/tasks').reply(200, mockResponse);

      const result = await tasksApiClient.getAllTasks();
      const task = result.tasks[0];

      expect(task).toHaveProperty('id');
      expect(task).not.toHaveProperty('_id');
      expect(task).not.toHaveProperty('__v');
      expect(task).not.toHaveProperty('userId');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('taskType');
      expect(task).toHaveProperty('status');
    });
  });
});
