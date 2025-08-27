import { Assignment, Quiz, Lesson, ContentItem, LiveClass } from '../types/classroom.types';

export const mockData = {
  subjectData: {
    name: 'Biology',
    description: 'Explore the fascinating world of living organisms, from microscopic cells to complex ecosystems. Dive into the science of life, evolution, and the interconnectedness of all living things.',
    progress: 58,
    teacher: {
      name: 'Andrew Jones',
      avatar: '/assets/teacher-avatar.jpg'
    }
  },

  lessons: [
    { id: '1', number: 1, title: 'Introduction', lessonNumber: 'Lesson 1' },
    { id: '2', number: 2, title: 'Reproduction in Organisms', lessonNumber: 'Lesson 2' },
    { id: '3', number: 3, title: 'Reproduction in Organisms', lessonNumber: 'Lesson 3' },
    { id: '4', number: 4, title: 'Introduction', lessonNumber: 'Lesson 4' },
    { id: '5', number: 5, title: 'Introduction', lessonNumber: 'Lesson 5' },
    { id: '6', number: 6, title: 'Introduction', lessonNumber: 'Lesson 6' },
    { id: '7', number: 7, title: 'Introduction', lessonNumber: 'Lesson 7' },
    { id: '8', number: 8, title: 'Introduction', lessonNumber: 'Lesson 8' },
  ] as Lesson[],

  lessonContent: [
    { id: '1', title: 'Beginning of everything', description: 'Learn about how biology began', type: 'video', icon: '🎥' },
    { id: '2', title: 'Introduction', description: 'Learn about how biology began', type: 'document', icon: '📄' },
    { id: '3', title: 'Life and its characteristics', description: 'Learn about how biology began', type: 'video', icon: '🎥' },
    { id: '4', title: 'Introduction Quiz', description: 'Lesson 1 quiz', type: 'quiz', icon: '📊' },
    { id: '5', title: 'Introduction', description: 'Lesson 1 assignment', type: 'assignment', icon: '📝' },
    { id: '6', title: 'Introduction', description: 'Take note and download the resources', type: 'document', icon: '📄' }
  ] as ContentItem[],

  assignments: [
    { id: '1', title: 'Lesson 3 Assignment', dueDate: 'Due in 2hrs 30mins', status: 'active' },
    { id: '2', title: 'Lesson 2- Introduction', dueDate: 'Due in 2hrs 30mins', status: 'active' },
    { id: '3', title: 'Lesson 1', dueDate: 'Overdue', status: 'overdue' },
    { id: '4', title: 'Lesson 1- Introduction', dueDate: 'Expired', status: 'expired' },
    { id: '5', title: 'Week 2 Assignment', dueDate: 'Expired', status: 'expired' },
    { id: '6', title: 'Week 2 Assignment', dueDate: 'Expired', status: 'expired' },
  ] as Assignment[],

  quizzes: [
    { id: '1', title: 'Week 2 Quiz', dueDate: 'Due in 2hrs 30mins', status: 'active' },
    { id: '2', title: 'Week 2 Quiz', dueDate: 'Due in 2hrs 30mins', status: 'active' },
    { id: '3', title: 'Everyday physics', dueDate: 'Expired', status: 'expired' },
    { id: '4', title: 'Everyday physics', dueDate: 'Expired', status: 'expired' },
  ] as Quiz[],

  students: [
    { id: '1', name: 'Jane Doe', avatar: '/assets/student1.jpg', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
    { id: '2', name: 'James Doe', avatar: '/assets/student2.jpg', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'B' },
    { id: '3', name: 'James Doe', avatar: '/assets/student3.jpg', attendance: 0, assignment: 0, quiz: 0, caTest: 0, exam: 0, total: 0, grade: '--' },
  ],

  liveClasses: [
    { id: '1', title: 'Attend Live Class', subject: 'Physics - Now', status: 'now' },
    { id: '2', title: 'Next Live Class', subject: 'Physics - Due in 2 days', status: 'upcoming' },
    { id: '3', title: 'Introduction to Life & Living...', subject: 'Biology - Finished', status: 'finished' },
    { id: '4', title: 'Next Live Class', subject: 'Physics - Cancelled', status: 'cancelled' },
    { id: '5', title: 'Next Live Class', subject: 'Physics - Finished', status: 'finished' },
  ] as LiveClass[],
};