import type { ActionConfig } from '@/common/components/dashboard';

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

// mockClassSchedule deleted - now using /timetable/teacher/today endpoint