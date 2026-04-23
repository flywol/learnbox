import { create } from "zustand";
import { Notification } from "../types/notification.types";
import { studentApiClient } from "@/features/student/api/studentApiClient";

interface NotificationsState {
	notifications: Notification[];
	isLoading: boolean;
	error: string | null;
	hasHydrated: boolean;

	fetchNotifications: () => Promise<void>;
	markAsRead: (notificationId: string) => Promise<void>;
	markAllAsRead: () => Promise<void>;
	getUnreadCount: () => number;
	getRecentNotifications: (count?: number) => Notification[];
	setError: (error: string | null) => void;
	clearError: () => void;
	setHasHydrated: (value: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
	notifications: [],
	isLoading: false,
	error: null,
	hasHydrated: false,

	setHasHydrated: (value) => set({ hasHydrated: value }),

	fetchNotifications: async () => {
		if (get().isLoading) return;
		try {
			set({ isLoading: true, error: null });
			const notifications = await studentApiClient.getNotifications();
			set({ notifications, isLoading: false });
		} catch (error: any) {
			set({ isLoading: false, error: error.message || "Failed to fetch notifications" });
		}
	},

	markAsRead: async (notificationId: string) => {
		try {
			await studentApiClient.markNotificationRead(notificationId);
			set((state) => ({
				notifications: state.notifications.map((n) =>
					n.id === notificationId ? { ...n, isRead: true } : n
				),
			}));
		} catch (error: any) {
			set({ error: error.message || "Failed to mark notification as read" });
		}
	},

	markAllAsRead: async () => {
		const unread = get().notifications.filter((n) => !n.isRead);
		if (unread.length === 0) return;
		try {
			set({ isLoading: true });
			await studentApiClient.markAllNotificationsRead();
			set((state) => ({
				notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
				isLoading: false,
			}));
		} catch (error: any) {
			set({ isLoading: false, error: error.message || "Failed to mark all as read" });
		}
	},

	getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,

	getRecentNotifications: (count = 3) =>
		[...get().notifications]
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			.slice(0, count),

	setError: (error) => set({ error }),
	clearError: () => set({ error: null }),
}));
