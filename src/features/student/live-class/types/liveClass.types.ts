export interface LiveClass {
  id: string;
  subject: string;
  teacher: string;
  startTime: string; // ISO string
  duration: string;
  classLink: string;
  status: 'now' | 'starting-soon' | 'upcoming' | 'ended';
}

export interface LiveClassState {
  todaysClass: LiveClass | null;
  upcomingClasses: LiveClass[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLiveClasses: () => Promise<void>;
  joinClass: (classLink: string) => void;
}
