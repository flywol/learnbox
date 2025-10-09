import type { ActionConfig } from '@/common/components/dashboard';
import type { ClassSchedule } from '../components/RecentClassesSection';

export const teacherActionCards: ActionConfig[] = [
  {
    iconSrc: '/assets/add-new.svg',
    title: 'Add live class',
    description: 'Start a live class session with your students',
    onClick: () => {/* TODO: Implement live class */},
    buttonText: 'Add'
  },
  {
    iconSrc: '/assets/add-new2.svg',
    title: 'Add new assignment',
    description: 'Create and assign homework to your students',
    onClick: () => {/* TODO: Implement add assignment */},
    buttonText: 'Add'
  },
  {
    iconSrc: '/assets/add-new.svg',
    title: 'Take attendance',
    description: 'Mark student attendance for today\'s classes',
    onClick: () => {/* TODO: Implement attendance */},
    buttonText: 'Start'
  }
];

export const mockClassSchedule: ClassSchedule[] = [
  {
    time: '08:00am',
    subject: 'English',
    classCode: 'JSS A',
    isEmpty: false
  },
  {
    time: '09:00am',
    isEmpty: true
  },
  {
    time: '10:00am',
    subject: 'English',
    duration: '45mins',
    classCode: 'SS3',
    isEmpty: false
  },
  {
    time: '11:00am',
    isEmpty: true
  },
  {
    time: '12:00pm',
    subject: 'English',
    duration: '30mins', 
    classCode: 'JSS2B',
    isEmpty: false
  },
  {
    time: '01:00pm',
    isEmpty: true
  },
  {
    time: '02:00pm',
    subject: 'English',
    classCode: 'SS1',
    isEmpty: false
  }
];

export const mockTeacherStats = {
  // Classroom Overview Stats (from screenshot)
  totalStudents: 100,
  totalClasses: 4,
  assignmentCreated: 20,
  notGraded: 20,
  quizCreated: 10,
  notGradedQuiz: 20,
  
  // Tasks Progress
  completedTasks: 2,
  totalTasks: 5,
  
  // Additional teacher-specific stats
  parentContacts: 23,
  newStudents: 5,
  subjectsTaught: 2,
  lessonsToday: 4
};