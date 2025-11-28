import { create } from 'zustand';
import {
  StudentSubject,
  StudentLesson,
  StudentQuiz,
  StudentAssignment,
  ClassSchedule,
  ForumMessage,
} from '../types/classroom.types';

interface ClassroomState {
  subjects: StudentSubject[];
  lessons: Record<string, StudentLesson[]>; // subjectId -> lessons
  quizzes: StudentQuiz[];
  assignments: StudentAssignment[];
  schedules: ClassSchedule[];
  forumMessages: Record<string, ForumMessage[]>; // lessonId -> messages

  // Actions
  getSubjectById: (id: string) => StudentSubject | undefined;
  getLessonsBySubject: (subjectId: string) => StudentLesson[];
  getQuizzesBySubject: (subjectId: string) => StudentQuiz[];
  markLessonComplete: (lessonId: string, subjectId: string) => void;
  markContentItemComplete: (lessonId: string, subjectId: string, contentItemId: string) => void;
  addForumMessage: (lessonId: string, message: Omit<ForumMessage, 'id' | 'timestamp'>) => void;
}

// Mock subjects data
const mockSubjects: StudentSubject[] = [
  {
    id: 'subject-1',
    name: 'Biology',
    icon: '🧬',
    bgColor: 'bg-green-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-2',
    name: 'Further Mathematics',
    icon: '📐',
    bgColor: 'bg-red-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 56,
  },
  {
    id: 'subject-3',
    name: 'English',
    icon: '📚',
    bgColor: 'bg-blue-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-4',
    name: 'Chemistry',
    icon: '⚗️',
    bgColor: 'bg-purple-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-5',
    name: 'Economics',
    icon: '💰',
    bgColor: 'bg-teal-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 56,
  },
  {
    id: 'subject-6',
    name: 'Geography',
    icon: '🌍',
    bgColor: 'bg-lime-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-7',
    name: 'Civic Education',
    icon: '🏛️',
    bgColor: 'bg-indigo-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 56,
  },
  {
    id: 'subject-8',
    name: 'Mathematics',
    icon: '🔢',
    bgColor: 'bg-orange-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-9',
    name: 'Computer Science',
    icon: '💻',
    bgColor: 'bg-rose-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-10',
    name: 'Agriculture',
    icon: '🌾',
    bgColor: 'bg-green-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 56,
  },
  {
    id: 'subject-11',
    name: 'History',
    icon: '📜',
    bgColor: 'bg-cyan-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
  {
    id: 'subject-12',
    name: 'Food and Nutrition',
    icon: '🍎',
    bgColor: 'bg-pink-100',
    teacher: 'Andrew Jones',
    currentLesson: 9,
    totalLessons: 16,
    progressPercentage: 58,
  },
];

// Mock lessons for Biology
const mockBiologyLessons: StudentLesson[] = [
  {
    id: 'lesson-1',
    number: 1,
    title: 'Introduction',
    description: 'Introduction to Biology',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    isLocked: false,
    isCompleted: true,
    contentItems: [
      {
        id: 'content-1',
        type: 'video',
        title: 'Beginning of everything',
        description: 'Learn about how biology began',
        isCompleted: true,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        notes: 'This introductory video covers the origin of life on Earth and the fundamental principles that govern all living organisms.',
      },
      {
        id: 'content-2',
        type: 'document',
        title: 'When did all life begin?',
        description: 'Read about the origin of life on Earth',
        isCompleted: true,
        content: `<h2>The Origin of Life</h2>
<p>Life on Earth is thought to have begun approximately 3.5 to 4 billion years ago. The earliest evidence of life comes from fossilized microorganisms found in hydrothermal vent precipitates.</p>

<h3>Key Milestones:</h3>
<ul>
  <li><strong>4.6 billion years ago:</strong> Earth forms</li>
  <li><strong>4.0 billion years ago:</strong> First organic molecules</li>
  <li><strong>3.5 billion years ago:</strong> First prokaryotic cells</li>
  <li><strong>2.0 billion years ago:</strong> First eukaryotic cells</li>
</ul>

<p>The exact mechanisms of how life began remain one of science's greatest mysteries, with several competing theories including the primordial soup hypothesis and hydrothermal vent theory.</p>`,
      },
      {
        id: 'content-3',
        type: 'video',
        title: 'Life and its characteristics',
        description: 'Understand what defines living organisms',
        isCompleted: false,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        notes: 'This video explores the seven characteristics of life: movement, respiration, sensitivity, growth, reproduction, excretion, and nutrition.',
      },
      {
        id: 'content-4',
        type: 'quiz',
        title: 'Introduction Quiz',
        description: 'Week 1 quiz - Test your knowledge',
        isCompleted: false,
      },
      {
        id: 'content-5',
        type: 'assignment',
        title: 'Introduction Assignment',
        description: 'Week 1 assignment - Submit your work',
        isCompleted: false,
        content: `<h3>Assignment: The Characteristics of Life</h3>
<p><strong>Due Date:</strong> End of Week 1</p>

<h4>Instructions:</h4>
<ol>
  <li>Choose three living organisms from different kingdoms (e.g., plant, animal, fungi)</li>
  <li>For each organism, explain how it demonstrates ALL seven characteristics of life</li>
  <li>Include at least one diagram or illustration for each organism</li>
  <li>Write 300-500 words per organism</li>
</ol>

<p><strong>Submission Format:</strong> PDF or Word document</p>`,
        attachments: [
          {
            name: 'Assignment Template.docx',
            url: '#',
          },
          {
            name: 'Grading Rubric.pdf',
            url: '#',
          },
        ],
      },
      {
        id: 'content-6',
        type: 'document',
        title: 'Evolution',
        description: 'Now learn how living things have evolved',
        isCompleted: false,
        content: `<h2>Evolution: The Unifying Theory of Biology</h2>
<p>Evolution is the process by which populations of organisms change over successive generations. It is driven by mechanisms such as natural selection, genetic drift, and gene flow.</p>

<h3>Charles Darwin's Observations:</h3>
<p>In 1859, Charles Darwin published "On the Origin of Species," which introduced the theory of evolution by natural selection. His observations of finches in the Galápagos Islands provided crucial evidence for this theory.</p>

<h3>Key Concepts:</h3>
<ul>
  <li><strong>Natural Selection:</strong> Organisms better adapted to their environment tend to survive and reproduce more successfully</li>
  <li><strong>Adaptation:</strong> Traits that increase an organism's fitness in its environment</li>
  <li><strong>Common Descent:</strong> All life on Earth shares a common ancestor</li>
</ul>`,
        attachments: [
          {
            name: 'Evolution Timeline.pdf',
            url: '#',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Reproduction in Organisms',
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: false,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Reproduction in Organisms',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: false,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Introduction',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: false,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Introduction',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now - LOCKED
    isLocked: true,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-6',
    number: 6,
    title: 'Introduction',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now - LOCKED
    isLocked: true,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-7',
    number: 7,
    title: 'Introduction',
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: true,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-8',
    number: 8,
    title: 'Introduction',
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: true,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-9',
    number: 9,
    title: 'Introduction',
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: true,
    isCompleted: false,
    contentItems: [],
  },
  {
    id: 'lesson-10',
    number: 10,
    title: 'Introduction',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: true,
    isCompleted: false,
    contentItems: [],
  },
];

// Mock quizzes
const mockQuizzes: StudentQuiz[] = [
  {
    id: 'quiz-1',
    title: 'Week 2 Quiz',
    subjectId: 'subject-1',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '14:00',
    duration: 20,
    status: 'pending',
  },
  {
    id: 'quiz-2',
    title: 'Everyday physics',
    subjectId: 'subject-1',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '12:00',
    duration: 25,
    status: 'submitted',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'quiz-3',
    title: 'Everyday physics',
    subjectId: 'subject-1',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '10:00',
    duration: 30,
    status: 'graded',
    score: 60,
    totalPoints: 100,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock assignments
const mockAssignments: StudentAssignment[] = [
  {
    id: 'assignment-1',
    title: 'Week 2 Assignment',
    subjectId: 'subject-1',
    subjectName: 'Biology',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    status: 'pending',
    description: 'Complete questions on photosynthesis',
  },
  {
    id: 'assignment-2',
    title: 'Week 5- Introduction',
    subjectId: 'subject-8',
    subjectName: 'Mathematics',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    status: 'pending',
  },
  {
    id: 'assignment-3',
    title: 'Assignment Deadline',
    subjectId: 'subject-3',
    subjectName: 'English',
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'submitted',
    submittedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'assignment-4',
    title: 'Everyday physics',
    subjectId: 'subject-4',
    subjectName: 'Physics',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'graded',
    score: 50,
    totalPoints: 100,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'assignment-5',
    title: 'Everyday physics',
    subjectId: 'subject-4',
    subjectName: 'Physics',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'graded',
    score: 85,
    totalPoints: 100,
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock schedules
const mockSchedules: ClassSchedule[] = [
  {
    id: 'schedule-1',
    subjectId: 'subject-1',
    subjectName: 'Biology',
    teacher: 'Andrew Jones',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Room 101',
  },
  {
    id: 'schedule-2',
    subjectId: 'subject-8',
    subjectName: 'Mathematics',
    teacher: 'Andrew Jones',
    day: 'Monday',
    startTime: '10:15',
    endTime: '11:15',
    location: 'Room 102',
  },
  {
    id: 'schedule-3',
    subjectId: 'subject-3',
    subjectName: 'English',
    teacher: 'Andrew Jones',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Room 103',
  },
];

// Mock forum messages
const mockForumMessages: Record<string, ForumMessage[]> = {
  'lesson-1': [
    {
      id: 'msg-1',
      senderId: 'teacher-1',
      senderName: 'Mr Akande',
      senderRole: 'TEACHER',
      message: 'Do you all understand?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-2',
      senderId: 'student-2',
      senderName: 'Praise Peters',
      senderRole: 'STUDENT',
      message: 'Can you explain it sir?',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-3',
      senderId: 'teacher-1',
      senderName: 'Mr Akande',
      senderRole: 'TEACHER',
      message: 'Do you all understand?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const useClassroomStore = create<ClassroomState>((set, get) => ({
  subjects: mockSubjects,
  lessons: {
    'subject-1': mockBiologyLessons,
  },
  quizzes: mockQuizzes,
  assignments: mockAssignments,
  schedules: mockSchedules,
  forumMessages: mockForumMessages,

  getSubjectById: (id: string) => {
    return get().subjects.find((subject) => subject.id === id);
  },

  getLessonsBySubject: (subjectId: string) => {
    return get().lessons[subjectId] || [];
  },

  getQuizzesBySubject: (subjectId: string) => {
    return get().quizzes.filter((quiz) => quiz.subjectId === subjectId);
  },

  markLessonComplete: (lessonId: string, subjectId: string) => {
    set((state) => {
      const subjectLessons = state.lessons[subjectId] || [];
      const updatedLessons = subjectLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
      );

      return {
        lessons: {
          ...state.lessons,
          [subjectId]: updatedLessons,
        },
      };
    });
  },

  markContentItemComplete: (lessonId: string, subjectId: string, contentItemId: string) => {
    set((state) => {
      const subjectLessons = state.lessons[subjectId] || [];
      const updatedLessons = subjectLessons.map((lesson) => {
        if (lesson.id === lessonId) {
          const updatedContentItems = lesson.contentItems.map((item) =>
            item.id === contentItemId ? { ...item, isCompleted: true } : item
          );
          return { ...lesson, contentItems: updatedContentItems };
        }
        return lesson;
      });

      return {
        lessons: {
          ...state.lessons,
          [subjectId]: updatedLessons,
        },
      };
    });
  },

  addForumMessage: (lessonId: string, message: Omit<ForumMessage, 'id' | 'timestamp'>) => {
    set((state) => {
      const lessonMessages = state.forumMessages[lessonId] || [];
      const newMessage: ForumMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      return {
        forumMessages: {
          ...state.forumMessages,
          [lessonId]: [...lessonMessages, newMessage],
        },
      };
    });
  },
}));
