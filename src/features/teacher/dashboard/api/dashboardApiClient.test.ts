import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { dashboardApiClient } from './dashboardApiClient';
import type { DashboardApiResponse } from '../types/dashboard.types';

describe('DashboardApiClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(dashboardApiClient['api']);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('getDashboard', () => {
    it('should fetch teacher dashboard data', async () => {
      const mockDashboard: DashboardApiResponse = {
        data: {
          classroomOverview: {
            totalStudents: 120,
            totalClasses: 5,
            assignmentsCreated: 25,
            assignmentsNotGraded: 8,
            overdueCreated: 3,
            overdueNotGraded: 2,
          },
          tasks: {
            completed: 15,
            total: 20,
            upcomingTasks: [
              {
                _id: 'task-1',
                title: 'Grade Math Assignments',
                description: 'Grade JSS1 math assignments',
                taskType: 'grading',
                startDate: '2025-01-15T00:00:00.000Z',
                scheduleTime: '2025-01-15T10:00:00.000Z',
                repeat: 'none',
                status: 'pending',
              },
              {
                _id: 'task-2',
                title: 'Prepare Lesson Plan',
                description: 'Prepare lesson plan for next week',
                taskType: 'preparation',
                startDate: '2025-01-16T00:00:00.000Z',
                scheduleTime: '2025-01-16T14:00:00.000Z',
                repeat: 'weekly',
                status: 'pending',
              },
            ],
          },
          events: [
            {
              _id: 'event-1',
              description: 'Parent-Teacher Conference',
              receivers: 'All Parents',
              date: '2025-01-20',
            },
            {
              _id: 'event-2',
              description: 'Staff Meeting',
              receivers: 'All Teachers',
              date: '2025-01-18',
            },
          ],
        },
      };

      mockAxios.onGet('/teacher/dashboard').reply(200, mockDashboard);

      const result = await dashboardApiClient.getDashboard();

      expect(result).toEqual(mockDashboard);
      expect(mockAxios.history.get.length).toBe(1);
      expect(mockAxios.history.get[0].url).toBe('/teacher/dashboard');
    });

    it('should handle dashboard with empty data', async () => {
      const mockDashboard: DashboardApiResponse = {
        data: {
          classroomOverview: {
            totalStudents: 0,
            totalClasses: 0,
            assignmentsCreated: 0,
            assignmentsNotGraded: 0,
            overdueCreated: 0,
            overdueNotGraded: 0,
          },
          tasks: {
            completed: 0,
            total: 0,
            upcomingTasks: [],
          },
          events: [],
        },
      };

      mockAxios.onGet('/teacher/dashboard').reply(200, mockDashboard);

      const result = await dashboardApiClient.getDashboard();

      expect(result.data.classroomOverview.totalStudents).toBe(0);
      expect(result.data.tasks.upcomingTasks).toHaveLength(0);
      expect(result.data.events).toHaveLength(0);
    });

    it('should handle dashboard with high numbers', async () => {
      const mockDashboard: DashboardApiResponse = {
        data: {
          classroomOverview: {
            totalStudents: 500,
            totalClasses: 15,
            assignmentsCreated: 150,
            assignmentsNotGraded: 45,
            overdueCreated: 12,
            overdueNotGraded: 8,
          },
          tasks: {
            completed: 80,
            total: 100,
            upcomingTasks: [],
          },
          events: [],
        },
      };

      mockAxios.onGet('/teacher/dashboard').reply(200, mockDashboard);

      const result = await dashboardApiClient.getDashboard();

      expect(result.data.classroomOverview.totalStudents).toBe(500);
      expect(result.data.classroomOverview.assignmentsCreated).toBe(150);
      expect(result.data.tasks.completed).toBe(80);
    });

    it('should handle multiple upcoming tasks', async () => {
      const mockDashboard: DashboardApiResponse = {
        data: {
          classroomOverview: {
            totalStudents: 100,
            totalClasses: 4,
            assignmentsCreated: 20,
            assignmentsNotGraded: 5,
            overdueCreated: 1,
            overdueNotGraded: 1,
          },
          tasks: {
            completed: 10,
            total: 15,
            upcomingTasks: [
              {
                _id: 'task-1',
                title: 'Task 1',
                description: 'Description 1',
                taskType: 'grading',
                startDate: '2025-01-15T00:00:00.000Z',
                scheduleTime: '2025-01-15T10:00:00.000Z',
                repeat: 'none',
                status: 'pending',
              },
              {
                _id: 'task-2',
                title: 'Task 2',
                description: 'Description 2',
                taskType: 'meeting',
                startDate: '2025-01-16T00:00:00.000Z',
                scheduleTime: '2025-01-16T14:00:00.000Z',
                repeat: 'daily',
                status: 'pending',
              },
              {
                _id: 'task-3',
                title: 'Task 3',
                description: 'Description 3',
                taskType: 'preparation',
                startDate: '2025-01-17T00:00:00.000Z',
                scheduleTime: '2025-01-17T09:00:00.000Z',
                repeat: 'weekly',
                status: 'pending',
              },
            ],
          },
          events: [],
        },
      };

      mockAxios.onGet('/teacher/dashboard').reply(200, mockDashboard);

      const result = await dashboardApiClient.getDashboard();

      expect(result.data.tasks.upcomingTasks).toHaveLength(3);
      expect(result.data.tasks.upcomingTasks[0].title).toBe('Task 1');
      expect(result.data.tasks.upcomingTasks[1].repeat).toBe('daily');
      expect(result.data.tasks.upcomingTasks[2].taskType).toBe('preparation');
    });

    it('should handle multiple events', async () => {
      const mockDashboard: DashboardApiResponse = {
        data: {
          classroomOverview: {
            totalStudents: 100,
            totalClasses: 4,
            assignmentsCreated: 20,
            assignmentsNotGraded: 5,
            overdueCreated: 1,
            overdueNotGraded: 1,
          },
          tasks: {
            completed: 10,
            total: 15,
            upcomingTasks: [],
          },
          events: [
            {
              _id: 'event-1',
              description: 'Event 1',
              receivers: 'Group A',
              date: '2025-01-20',
            },
            {
              _id: 'event-2',
              description: 'Event 2',
              receivers: 'Group B',
              date: '2025-01-21',
            },
            {
              _id: 'event-3',
              description: 'Event 3',
              receivers: 'All',
              date: '2025-01-22',
            },
          ],
        },
      };

      mockAxios.onGet('/teacher/dashboard').reply(200, mockDashboard);

      const result = await dashboardApiClient.getDashboard();

      expect(result.data.events).toHaveLength(3);
      expect(result.data.events[0].description).toBe('Event 1');
      expect(result.data.events[1].receivers).toBe('Group B');
      expect(result.data.events[2].date).toBe('2025-01-22');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockAxios.onGet('/teacher/dashboard').networkError();

      await expect(dashboardApiClient.getDashboard()).rejects.toThrow();
    });

    it('should handle 401 unauthorized errors', async () => {
      mockAxios.onGet('/teacher/dashboard').reply(401, {
        message: 'Unauthorized',
      });

      await expect(dashboardApiClient.getDashboard()).rejects.toThrow();
    });

    it('should handle 500 server errors', async () => {
      mockAxios.onGet('/teacher/dashboard').reply(500, {
        message: 'Internal server error',
      });

      await expect(dashboardApiClient.getDashboard()).rejects.toThrow();
    });
  });
});
