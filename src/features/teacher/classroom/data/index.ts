import { Assignment, Quiz, Lesson, ContentItem, LiveClass, AssessmentStudent, AssessmentSummary } from '../types/classroom.types';

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
    {
      id: '1',
      title: 'Week 2 Quiz',
      dueDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueTime: '14:30',
      duration: 30,
      allowLateSubmission: true,
      status: 'published' as const,
      questions: [],
      subjectId: 'subject-1'
    },
    {
      id: '2',
      title: 'Week 2 Quiz',
      dueDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueTime: '16:00',
      duration: 30,
      allowLateSubmission: true,
      status: 'published' as const,
      questions: [],
      subjectId: 'subject-1'
    },
    {
      id: '3',
      title: 'Everyday physics',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueTime: '14:00',
      duration: 45,
      allowLateSubmission: false,
      status: 'archived' as const,
      questions: [],
      subjectId: 'subject-1'
    },
    {
      id: '4',
      title: 'Everyday physics',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueTime: '15:00',
      duration: 45,
      allowLateSubmission: false,
      status: 'archived' as const,
      questions: [],
      subjectId: 'subject-1'
    },
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

  assessmentSummary: {
    attendance: 12,
    assignments: 10,
    quizzes: 10,
    caTest: 20,
    exam: 60,
    total: 100,
    grades: 'A, B, C, D, E, F'
  } as AssessmentSummary,

  assessmentStudents: [
    { id: '1', name: 'Jane Doe', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=40&h=40&fit=crop&crop=face', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
    { id: '2', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'B' },
    { id: '3', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
    { id: '4', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'C' },
    { id: '5', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
    { id: '6', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
    { id: '7', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=40&h=40&fit=crop&crop=face', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
    { id: '8', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
    { id: '9', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
    { id: '10', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
    { id: '11', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
    { id: '12', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=40&h=40&fit=crop&crop=face', attendance: 50, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'B' },
    { id: '13', name: 'James Doe', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face', attendance: null, assignment: null, quiz: null, caTest: null, exam: null, total: null, grade: '--' },
  ] as AssessmentStudent[],
};