import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { lessonsApiClient } from './lessonsApiClient';
import type { CreateLessonRequest, UpdateLessonRequest, LessonResponse } from './lessonsApiClient';

describe('LessonsApiClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(lessonsApiClient['api']);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('createLesson', () => {
    it('should create a lesson with all required fields', async () => {
      const createData: CreateLessonRequest = {
        title: 'Introduction to Algebra',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        contentType: 'video',
        contentTitle: 'Algebra Basics',
        contentDescription: 'Learn the fundamentals of algebra',
      };

      const mockResponse: LessonResponse = {
        id: 'lesson-1',
        title: 'Introduction to Algebra',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        contentType: 'video',
        contentTitle: 'Algebra Basics',
        contentDescription: 'Learn the fundamentals of algebra',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onPost('/lessons').reply(200, mockResponse);

      const result = await lessonsApiClient.createLesson(createData);

      expect(result).toEqual(mockResponse);
      expect(mockAxios.history.post.length).toBe(1);
      expect(mockAxios.history.post[0].headers?.['Content-Type']).toContain('multipart/form-data');
    });

    it('should create a lesson with optional fields', async () => {
      const createData: CreateLessonRequest = {
        title: 'Introduction to Algebra',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        classArm: 'A',
        contentType: 'assignment',
        contentTitle: 'Algebra Assignment',
        contentDescription: 'Complete algebra problems',
        assignmentTitle: 'Homework 1',
        assignmentDescription: 'Solve problems 1-10',
        assignmentDueDate: '20/01/2025',
        assignmentDueTime: '23:59',
        acceptLateSubmissions: true,
      };

      const mockResponse: LessonResponse = {
        id: 'lesson-1',
        ...createData,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onPost('/lessons').reply(200, mockResponse);

      const result = await lessonsApiClient.createLesson(createData);

      expect(result.assignmentTitle).toBe('Homework 1');
      expect(result.acceptLateSubmissions).toBe(true);
    });

    it('should handle file uploads', async () => {
      const file = new File(['content'], 'lesson.pdf', { type: 'application/pdf' });

      const createData: CreateLessonRequest = {
        title: 'Introduction to Algebra',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        contentType: 'file',
        contentTitle: 'Algebra Notes',
        contentDescription: 'Lecture notes',
        file,
      };

      const mockResponse: LessonResponse = {
        id: 'lesson-1',
        title: 'Introduction to Algebra',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        contentType: 'file',
        contentTitle: 'Algebra Notes',
        contentDescription: 'Lecture notes',
        fileUrl: 'https://example.com/lesson.pdf',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onPost('/lessons').reply(200, mockResponse);

      const result = await lessonsApiClient.createLesson(createData);

      expect(result.fileUrl).toBe('https://example.com/lesson.pdf');
    });
  });

  describe('getLessons', () => {
    it('should fetch all lessons', async () => {
      const mockLessons = {
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introduction to Algebra',
            number: '1',
            startDate: '15/01/2025',
            subject: 'subject-123',
            class: 'class-456',
            contentType: 'video',
            contentTitle: 'Algebra Basics',
            contentDescription: 'Learn algebra',
            createdAt: '2025-01-10T00:00:00Z',
            updatedAt: '2025-01-10T00:00:00Z',
          },
        ],
      };

      mockAxios.onGet('/lessons').reply(200, mockLessons);

      const result = await lessonsApiClient.getLessons();

      expect(result).toEqual(mockLessons);
      expect(mockAxios.history.get.length).toBe(1);
    });
  });

  describe('getLesson', () => {
    it('should fetch and transform a specific lesson', async () => {
      const mockApiResponse = {
        data: {
          lesson: {
            _id: 'lesson-1',
            title: 'Introduction to Algebra',
            number: '1',
            startDate: '2025-01-15T00:00:00Z',
            subject: { name: 'Mathematics' },
            class: { class: 'JSS1' },
            classArm: { armName: 'A' },
            content: {
              type: 'video',
              title: 'Algebra Basics',
              description: 'Learn algebra',
              url: 'https://example.com/video.mp4',
            },
            assignment: {
              title: 'Homework 1',
              description: 'Solve problems',
              dueDate: '20/01/2025',
              dueTime: '23:59',
              acceptLateSubmissions: true,
              fileUrl: 'https://example.com/assignment.pdf',
            },
            createdAt: '2025-01-10T00:00:00Z',
            updatedAt: '2025-01-10T00:00:00Z',
          },
        },
      };

      mockAxios.onGet('/lessons/lesson-1').reply(200, mockApiResponse);

      const result = await lessonsApiClient.getLesson('lesson-1');

      expect(result.id).toBe('lesson-1');
      expect(result.title).toBe('Introduction to Algebra');
      expect(result.subject).toBe('Mathematics');
      expect(result.class).toBe('JSS1');
      expect(result.classArm).toBe('A');
      expect(result.contentType).toBe('video');
      expect(result.fileUrl).toBe('https://example.com/video.mp4');
      expect(result.assignmentTitle).toBe('Homework 1');
      expect(result.acceptLateSubmissions).toBe(true);
    });

    it('should handle lesson without populated fields', async () => {
      const mockApiResponse = {
        data: {
          lesson: {
            _id: 'lesson-1',
            title: 'Simple Lesson',
            number: '2',
            startDate: '2025-01-16T00:00:00Z',
            subject: 'subject-id',
            class: 'class-id',
            createdAt: '2025-01-10T00:00:00Z',
            updatedAt: '2025-01-10T00:00:00Z',
          },
        },
      };

      mockAxios.onGet('/lessons/lesson-1').reply(200, mockApiResponse);

      const result = await lessonsApiClient.getLesson('lesson-1');

      expect(result.subject).toBe('subject-id');
      expect(result.class).toBe('class-id');
      expect(result.contentType).toBe('file');
    });
  });

  describe('updateLesson', () => {
    it('should update a lesson', async () => {
      const updateData: UpdateLessonRequest = {
        title: 'Updated Lesson Title',
        contentDescription: 'Updated description',
      };

      const mockResponse: LessonResponse = {
        id: 'lesson-1',
        title: 'Updated Lesson Title',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        contentType: 'video',
        contentTitle: 'Algebra Basics',
        contentDescription: 'Updated description',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-11T00:00:00Z',
      };

      mockAxios.onPut('/lessons/lesson-1').reply(200, mockResponse);

      const result = await lessonsApiClient.updateLesson('lesson-1', updateData);

      expect(result.title).toBe('Updated Lesson Title');
      expect(result.contentDescription).toBe('Updated description');
      expect(mockAxios.history.put[0].headers?.['Content-Type']).toContain('multipart/form-data');
    });
  });

  describe('deleteLesson', () => {
    it('should delete a lesson', async () => {
      mockAxios.onDelete('/lessons/lesson-1').reply(200);

      await lessonsApiClient.deleteLesson('lesson-1');

      expect(mockAxios.history.delete.length).toBe(1);
      expect(mockAxios.history.delete[0].url).toBe('/lessons/lesson-1');
    });
  });

  describe('getLessonsByClassAndSubject', () => {
    it('should fetch lessons by class and subject', async () => {
      const mockApiResponse = {
        data: {
          lessons: [
            {
              _id: 'lesson-1',
              title: 'Lesson 1',
              number: '1',
              startDate: '2025-01-15',
              subject: 'subject-123',
              class: 'class-456',
              content: {
                type: 'video',
                title: 'Video Title',
                description: 'Description',
                url: 'https://example.com/video.mp4',
              },
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
        },
      };

      mockAxios.onGet('/lessons/class/class-456/subject/subject-123').reply(200, mockApiResponse);

      const result = await lessonsApiClient.getLessonsByClassAndSubject('class-456', 'subject-123');

      expect(result.lessons).toHaveLength(1);
      expect(result.lessons[0].id).toBe('lesson-1');
      expect(result.lessons[0].contentType).toBe('video');
    });

    it('should fetch lessons with class arm parameter', async () => {
      const mockApiResponse = {
        data: {
          lessons: [
            {
              _id: 'lesson-1',
              title: 'Lesson 1',
              number: '1',
              startDate: '2025-01-15',
              subject: 'subject-123',
              class: 'class-456',
              classArm: 'arm-789',
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
        },
      };

      mockAxios
        .onGet('/lessons/class/class-456/subject/subject-123?classArmId=arm-789')
        .reply(200, mockApiResponse);

      const result = await lessonsApiClient.getLessonsByClassAndSubject(
        'class-456',
        'subject-123',
        'arm-789'
      );

      expect(result.lessons[0].classArm).toBe('arm-789');
      expect(mockAxios.history.get[0].url).toContain('classArmId=arm-789');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockAxios.onPost('/lessons').networkError();

      const createData: CreateLessonRequest = {
        title: 'Test',
        number: '1',
        startDate: '15/01/2025',
        subject: 'subject-123',
        class: 'class-456',
        contentType: 'video',
        contentTitle: 'Test',
        contentDescription: 'Test',
      };

      await expect(lessonsApiClient.createLesson(createData)).rejects.toThrow();
    });

    it('should handle 404 errors', async () => {
      mockAxios.onGet('/lessons/non-existent').reply(404);

      await expect(lessonsApiClient.getLesson('non-existent')).rejects.toThrow();
    });
  });
});
