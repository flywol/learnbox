import { create } from 'zustand';
import { LiveClass, LiveClassState } from '../types/liveClass.types';
import { getClassStatus } from '../utils/liveClassUtils';
import { studentApiClient } from '@/features/student/api/studentApiClient';

function mapApiClass(item: any, index: number): LiveClass {
	return {
		id: item._id ?? item.id ?? String(index),
		subject: item.subject?.name ?? item.subjectName ?? item.subject ?? 'Unknown',
		teacher: item.teacher?.fullName ?? item.teacherName ?? item.teacher ?? '',
		startTime: item.startTime ?? item.scheduledAt ?? new Date().toISOString(),
		duration: item.duration ?? item.classDuration ?? '1 hour',
		classLink: item.classLink ?? item.meetingLink ?? item.link ?? '#',
		status: getClassStatus(item.startTime ?? item.scheduledAt ?? new Date().toISOString()),
	};
}

export const useLiveClassStore = create<LiveClassState>((set) => ({
	todaysClass: null,
	upcomingClasses: [],
	isLoading: false,
	error: null,

	fetchLiveClasses: async () => {
		set({ isLoading: true, error: null });
		try {
			const raw = await studentApiClient.getLiveClasses();
			const classes = raw.map(mapApiClass).filter((c) => c.status !== 'ended');
			const todaysClass =
				classes.find((c) => c.status === 'now' || c.status === 'starting-soon') ?? null;
			const upcomingClasses = classes.filter((c) => c.id !== todaysClass?.id);
			set({ todaysClass, upcomingClasses, isLoading: false });
		} catch {
			set({ isLoading: false, error: null });
		}
	},

	joinClass: (classLink: string) => {
		window.open(classLink, '_blank');
	},
}));
