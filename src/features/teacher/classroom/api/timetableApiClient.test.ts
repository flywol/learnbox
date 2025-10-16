import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { timetableApiClient } from './timetableApiClient';
import type { CreateTimetableRequest } from '../types/timetable.types';

describe('TimetableApiClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(timetableApiClient['api']);
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('createTimetable', () => {
    it('should create a timetable', async () => {
      const createData: CreateTimetableRequest = {
        classId: 'class-123',
        subjectSchedules: [
          {
            subjectName: 'Mathematics',
            schedule: [
              { day: 'Monday', startTime: '08:00', endTime: '09:00' },
              { day: 'Wednesday', startTime: '10:00', endTime: '11:00' },
            ],
          },
        ],
      };

      const mockResponse = {
        data: {
          classId: 'class-123',
          subjectSchedules: [
            {
              subjectName: 'Mathematics',
              schedule: [
                { day: 'Monday', startTime: '08:00', endTime: '09:00' },
                { day: 'Wednesday', startTime: '10:00', endTime: '11:00' },
              ],
            },
          ],
        },
      };

      mockAxios.onPost('/timetable').reply(200, mockResponse);

      const result = await timetableApiClient.createTimetable(createData);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.history.post.length).toBe(1);
    });
  });

  describe('getTimetable', () => {
    it('should fetch and transform timetable data', async () => {
      const mockApiResponse = [
        {
          subjectName: 'Mathematics',
          schedule: [
            { day: 'Monday', startTime: '08:00', endTime: '09:00' },
            { day: 'Wednesday', startTime: '10:00', endTime: '11:00' },
          ],
        },
        {
          subjectName: 'English',
          schedule: [
            { day: 'Tuesday', startTime: '09:00', endTime: '10:00' },
          ],
        },
      ];

      mockAxios.onGet('/timetable/class/class-123').reply(200, mockApiResponse);

      const result = await timetableApiClient.getTimetable('class-123');

      expect(result).not.toBeNull();
      expect(result?.classId).toBe('class-123');
      expect(result?.subjectSchedules).toHaveLength(2);
      expect(result?.subjectSchedules[0].subjectName).toBe('Mathematics');
      expect(result?.subjectSchedules[0].schedule).toHaveLength(2);
    });

    it('should return null for empty array response', async () => {
      mockAxios.onGet('/timetable/class/class-123').reply(200, []);

      const result = await timetableApiClient.getTimetable('class-123');

      expect(result).toBeNull();
    });

    it('should throw on other errors', async () => {
      mockAxios.onGet('/timetable/class/class-123').reply(500);

      await expect(timetableApiClient.getTimetable('class-123')).rejects.toThrow();
    });
  });

  describe('getSubjects', () => {
    it('should fetch and transform subjects', async () => {
      const mockApiResponse = {
        data: {
          subjects: [
            { _id: 'sub-1', name: 'Mathematics', color: 'blue' },
            { _id: 'sub-2', name: 'English', color: 'green' },
          ],
        },
      };

      mockAxios.onGet('/subjects').reply(200, mockApiResponse);

      const result = await timetableApiClient.getSubjects();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('sub-1');
      expect(result[0].name).toBe('Mathematics');
      expect(result[1].id).toBe('sub-2');
    });

    it('should return default subjects on error', async () => {
      mockAxios.onGet('/subjects').networkError();

      const result = await timetableApiClient.getSubjects();

      expect(result).toHaveLength(8);
      expect(result[0].name).toBe('Mathematics');
      expect(result[1].name).toBe('English');
    });
  });

  describe('updateTimetable', () => {
    it('should call createTimetable', async () => {
      const updateData: CreateTimetableRequest = {
        classId: 'class-123',
        subjectSchedules: [
          {
            subjectName: 'Mathematics',
            schedule: [{ day: 'Monday', startTime: '08:00', endTime: '09:00' }],
          },
        ],
      };

      const mockResponse = {
        data: updateData,
      };

      mockAxios.onPost('/timetable').reply(200, mockResponse);

      const result = await timetableApiClient.updateTimetable(updateData);

      expect(result).toEqual(updateData);
      expect(mockAxios.history.post.length).toBe(1);
    });
  });

  describe('editTimetable', () => {
    it('should edit timetable by ID', async () => {
      const editData: CreateTimetableRequest = {
        classId: 'class-123',
        subjectSchedules: [
          {
            subjectName: 'Mathematics',
            schedule: [{ day: 'Monday', startTime: '08:00', endTime: '09:00' }],
          },
        ],
      };

      const mockResponse = {
        data: editData,
      };

      mockAxios.onPut('/timetable/timetable-123').reply(200, mockResponse);

      const result = await timetableApiClient.editTimetable('timetable-123', editData);

      expect(result).toEqual(editData);
      expect(mockAxios.history.put.length).toBe(1);
      expect(mockAxios.history.put[0].url).toBe('/timetable/timetable-123');
    });
  });

  describe('deleteTimetable', () => {
    it('should delete timetable by ID', async () => {
      mockAxios.onDelete('/timetable/timetable-123').reply(200);

      await timetableApiClient.deleteTimetable('timetable-123');

      expect(mockAxios.history.delete.length).toBe(1);
      expect(mockAxios.history.delete[0].url).toBe('/timetable/timetable-123');
    });
  });

  describe('getClassLevels', () => {
    it('should fetch and transform class levels', async () => {
      const mockApiResponse = {
        data: {
          classLevels: [
            {
              _id: 'class-1',
              levelName: 'Primary Class',
              class: 'Primary 1',
              school: 'school-123',
              arms: [
                { _id: 'arm-1', armName: 'A', parentClass: 'class-1', school: 'school-123', studentCount: 30, assignedTeachers: [] },
                { _id: 'arm-2', armName: 'B', parentClass: 'class-1', school: 'school-123', studentCount: 28, assignedTeachers: [] },
              ],
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
              studentCount: 58,
              teacherCount: 5,
            },
            {
              _id: 'class-2',
              levelName: 'Primary Class',
              class: 'Primary 2',
              school: 'school-123',
              arms: [
                { _id: 'arm-3', armName: 'A', parentClass: 'class-2', school: 'school-123', studentCount: 25, assignedTeachers: [] },
              ],
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
              studentCount: 25,
              teacherCount: 4,
            },
          ],
        },
      };

      mockAxios.onGet('/admin/class-levels-and-arms').reply(200, mockApiResponse);

      const result = await timetableApiClient.getClassLevels();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('class-1');
      expect(result[0].name).toBe('Primary 1');
      expect(result[0].levelName).toBe('Primary Class');
      expect(result[0].armCount).toBe(2);
      expect(result[0].studentCount).toBe(58);
      expect(result[1].armCount).toBe(1);
    });

    it('should return empty array on error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAxios.onGet('/admin/class-levels-and-arms').networkError();

      const result = await timetableApiClient.getClassLevels();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getTodayClasses', () => {
    it('should fetch today\'s classes', async () => {
      const mockResponse = {
        data: {
          classes: [
            {
              _id: 'class-1',
              subject: 'Mathematics',
              class: 'JSS1-A',
              startTime: '08:00',
              endTime: '09:00',
              day: 'Monday',
            },
            {
              _id: 'class-2',
              subject: 'English',
              class: 'JSS2-B',
              startTime: '10:00',
              endTime: '11:00',
              day: 'Monday',
            },
          ],
        },
      };

      mockAxios.onGet('/timetable/teacher/today').reply(200, mockResponse);

      const result = await timetableApiClient.getTodayClasses();

      expect(result).toEqual(mockResponse.data);
      expect(result.classes).toHaveLength(2);
      expect(result.classes[0].subjectName).toBe('Mathematics');
    });

    it('should throw error and log on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAxios.onGet('/timetable/teacher/today').reply(500);

      await expect(timetableApiClient.getTodayClasses()).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getWeeklySchedule', () => {
    it('should fetch weekly schedule', async () => {
      const mockResponse = {
        data: {
          schedule: {
            Monday: [
              { subject: 'Mathematics', class: 'JSS1-A', startTime: '08:00', endTime: '09:00' },
            ],
            Tuesday: [
              { subject: 'English', class: 'JSS1-A', startTime: '09:00', endTime: '10:00' },
            ],
          },
        },
      };

      mockAxios.onGet('/timetable/teacher/weekly').reply(200, mockResponse);

      const result = await timetableApiClient.getWeeklySchedule();

      expect(result).toEqual(mockResponse.data);
      expect(result.schedule.Monday).toHaveLength(1);
      expect(result.schedule.Tuesday).toHaveLength(1);
    });

    it('should throw error and log on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAxios.onGet('/timetable/teacher/weekly').reply(500);

      await expect(timetableApiClient.getWeeklySchedule()).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
