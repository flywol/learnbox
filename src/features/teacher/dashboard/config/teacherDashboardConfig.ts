import type { ActionConfig } from '@/common/components/dashboard';

export const createTeacherActionCards = (handlers: {
  onAddLiveClass: () => void;
}): ActionConfig[] => [
  {
    iconSrc: '/assets/teaching1.png',
    title: 'Add live class',
    description: 'Start a live class session with your students',
    onClick: handlers.onAddLiveClass,
    buttonText: 'Add'
  },
  {
    iconSrc: '/assets/assignment1.png',
    title: 'Add new assignment',
    description: 'Create and assign homework to your students',
    onClick: () => {/* TODO: Implement add assignment */},
    buttonText: 'Add'
  },
  {
    iconSrc: '/assets/rollCall1.png',
    title: 'Take attendance',
    description: 'Mark student attendance for today\'s classes',
    onClick: () => {/* TODO: Implement attendance */},
    buttonText: 'Start'
  }
];

// mockClassSchedule deleted - now using /timetable/teacher/today endpoint