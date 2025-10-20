import { create } from 'zustand';
import { LiveClass, LiveClassState } from '../types/liveClass.types';
import { getClassStatus } from '../utils/liveClassUtils';

// Mock live classes
const mockLiveClasses: LiveClass[] = [
  {
    id: 'class-1',
    subject: 'Physics',
    teacher: 'Mr. Akande',
    startTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 mins from now
    duration: '1 hour',
    classLink: 'https://meet.google.com/abc-defg-hij',
    status: 'starting-soon',
  },
  {
    id: 'class-2',
    subject: 'Mathematics',
    teacher: 'Mrs. Johnson',
    startTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours from now
    duration: '1 hour 30 minutes',
    classLink: 'https://meet.google.com/xyz-uvwx-yz',
    status: 'upcoming',
  },
  {
    id: 'class-3',
    subject: 'English',
    teacher: 'Ms. Williams',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    duration: '1 hour',
    classLink: 'https://meet.google.com/eng-lish-cls',
    status: 'upcoming',
  },
  {
    id: 'class-4',
    subject: 'Chemistry',
    teacher: 'Dr. Brown',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: '1 hour 30 minutes',
    classLink: 'https://meet.google.com/che-mist-ry',
    status: 'upcoming',
  },
  {
    id: 'class-5',
    subject: 'Biology',
    teacher: 'Mr. Davis',
    startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: '1 hour',
    classLink: 'https://meet.google.com/bio-logy-cls',
    status: 'upcoming',
  },
  {
    id: 'class-6',
    subject: 'History',
    teacher: 'Mrs. Taylor',
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days from now
    duration: '1 hour',
    classLink: 'https://meet.google.com/his-tory-cls',
    status: 'upcoming',
  },
];

export const useLiveClassStore = create<LiveClassState>((set) => ({
  todaysClass: null,
  upcomingClasses: [],
  isLoading: false,
  error: null,

  fetchLiveClasses: async () => {
    set({ isLoading: true, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update statuses based on current time
    const updatedClasses = mockLiveClasses.map((cls) => ({
      ...cls,
      status: getClassStatus(cls.startTime),
    }));

    // Filter out ended classes
    const activeClasses = updatedClasses.filter((cls) => cls.status !== 'ended');

    // Find today's class (the next class that's happening now or starting soon)
    const todaysClass = activeClasses.find(
      (cls) => cls.status === 'now' || cls.status === 'starting-soon'
    ) || null;

    // Get upcoming classes (exclude today's class)
    const upcomingClasses = activeClasses.filter(
      (cls) => cls.id !== todaysClass?.id
    );

    set({
      todaysClass,
      upcomingClasses,
      isLoading: false,
    });
  },

  joinClass: (classLink: string) => {
    // Open class link in new tab
    window.open(classLink, '_blank');
  },
}));
