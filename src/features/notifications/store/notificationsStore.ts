import { create } from "zustand";
import { Notification } from "../types/notification.types";
import { notificationsApiClient } from "../api/notificationsApiClient";

interface NotificationsState {
	// Core state
	notifications: Notification[];
	isLoading: boolean;
	error: string | null;
	hasHydrated: boolean;

	// Actions
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
	// Initial state
	notifications: [],
	isLoading: false,
	error: null,
	hasHydrated: false,

	// Hydration management
	setHasHydrated: (value) => {
		console.log("💧 Notifications setHasHydrated:", value);
		set({ hasHydrated: value });
	},

	// Fetch all notifications
	fetchNotifications: async () => {
		const state = get();
		if (state.isLoading) return;

		try {
			console.log("📡 Fetching notifications...");
			set({ isLoading: true, error: null });

			const response = await notificationsApiClient.getAllNotifications();
			const notifications = response.data.notifications;

			set({
				notifications,
				isLoading: false,
				error: null,
			});

			console.log(`✅ Fetched ${notifications.length} notifications`);
		} catch (error: any) {
			console.error("❌ Failed to fetch notifications:", error);
			set({
				isLoading: false,
				error: error.message || "Failed to fetch notifications",
			});
		}
	},

	// Mark single notification as read
	markAsRead: async (notificationId: string) => {
		try {
			console.log("📡 Marking notification as read:", notificationId);

			await notificationsApiClient.markAsRead(notificationId);

			// Update local state
			set((state) => ({
				notifications: state.notifications.map((notification) =>
					notification.id === notificationId
						? { ...notification, isRead: true }
						: notification
				),
			}));

			console.log("✅ Notification marked as read");
		} catch (error: any) {
			console.error("❌ Failed to mark notification as read:", error);
			set({ error: error.message || "Failed to mark notification as read" });
		}
	},

	// Mark all notifications as read
	markAllAsRead: async () => {
		const state = get();
		const unreadNotifications = state.notifications.filter(n => !n.isRead);

		if (unreadNotifications.length === 0) return;

		try {
			console.log("📡 Marking all notifications as read...");
			set({ isLoading: true, error: null });

			// Mark all unread notifications as read
			const promises = unreadNotifications.map(notification =>
				notificationsApiClient.markAsRead(notification.id)
			);

			await Promise.all(promises);

			// Update local state
			set((state) => ({
				notifications: state.notifications.map((notification) => ({
					...notification,
					isRead: true,
				})),
				isLoading: false,
			}));

			console.log("✅ All notifications marked as read");
		} catch (error: any) {
			console.error("❌ Failed to mark all notifications as read:", error);
			set({
				isLoading: false,
				error: error.message || "Failed to mark all notifications as read",
			});
		}
	},

	// Get unread count
	getUnreadCount: () => {
		const state = get();
		return state.notifications.filter(n => !n.isRead).length;
	},

	// Get recent notifications (for dropdown)
	getRecentNotifications: (count = 3) => {
		const state = get();
		return state.notifications
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			.slice(0, count);
	},

	// Error management
	setError: (error) => set({ error }),
	clearError: () => set({ error: null }),
}));