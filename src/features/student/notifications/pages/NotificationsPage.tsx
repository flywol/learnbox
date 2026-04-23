import { Bell, Loader2, Check } from "lucide-react";
import { useEffect } from "react";
import { useNotificationsStore } from "../store/notificationsStore";
import { formatTimeAgo } from "../utils/formatTime";
import { Notification } from "../types/notification.types";

export default function NotificationsPage() {
	const {
		notifications,
		isLoading,
		error,
		fetchNotifications,
		getUnreadCount,
		markAsRead,
		markAllAsRead,
		clearError,
	} = useNotificationsStore();

	const unreadCount = getUnreadCount();

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const handleNotificationClick = async (notification: Notification) => {
		if (!notification.isRead) {
			await markAsRead(notification.id);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between px-8 py-5 border-b border-[#eeeeee]">
				<div className="flex items-center gap-3">
					<h1 className="text-xl font-bold text-[#2b2b2b]">Notifications</h1>
					{isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#fd5d26]" />}
				</div>
				{unreadCount > 0 && !isLoading && (
					<button
						onClick={() => markAllAsRead()}
						className="text-sm font-semibold text-[#fd5d26] hover:text-[#e84d17] transition-colors"
					>
						Mark all as read
					</button>
				)}
			</div>

			{error && (
				<div className="px-8 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between gap-4">
					<p className="text-red-600 text-sm">{error}</p>
					<div className="flex gap-3">
						<button onClick={clearError} className="text-red-500 text-sm hover:text-red-700">Dismiss</button>
						<button onClick={fetchNotifications} className="text-red-600 text-sm font-medium hover:text-red-700">Retry</button>
					</div>
				</div>
			)}

			{/* List */}
			<div>
				{isLoading && notifications.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16 gap-3">
						<Loader2 className="w-8 h-8 animate-spin text-[#fd5d26]" />
						<p className="text-[#838383]">Loading notifications...</p>
					</div>
				)}

				{!isLoading && notifications.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20 gap-4">
						<div className="w-16 h-16 bg-[#eeeeee] rounded-full flex items-center justify-center">
							<Bell className="w-8 h-8 text-[#838383]" />
						</div>
						<div className="text-center">
							<p className="text-base font-semibold text-[#2b2b2b]">No notifications</p>
							<p className="text-sm text-[#838383] mt-1">You're all caught up!</p>
						</div>
					</div>
				)}

				{!isLoading && notifications.map((notification) => (
					<div
						key={notification.id}
						onClick={() => handleNotificationClick(notification)}
						className={`flex items-start gap-4 px-8 py-4 border-b border-[#eeeeee] cursor-pointer transition-colors hover:bg-[#eeeeee]/40 ${
							!notification.isRead ? "bg-[#fff8f5]" : "bg-white"
						}`}
					>
						{/* Avatar */}
						<div className="w-10 h-10 rounded-full bg-[#d6e4f0] flex items-center justify-center flex-shrink-0 overflow-hidden">
							<span className="text-sm font-semibold text-[#2b2b2b]">
								{notification.title.charAt(0).toUpperCase()}
							</span>
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-bold text-[#2b2b2b] leading-snug">
								{notification.message}
							</p>
							<p className="text-sm text-[#838383] mt-0.5 truncate">{notification.title}</p>
						</div>

						{/* Time + indicator */}
						<div className="flex flex-col items-end gap-1.5 flex-shrink-0">
							<span className="text-xs text-[#838383] whitespace-nowrap">
								{formatTimeAgo(notification.created_at)}
							</span>
							{!notification.isRead ? (
								<span className="w-2 h-2 bg-[#fd5d26] rounded-full" />
							) : (
								<Check className="w-3.5 h-3.5 text-[#fd5d26]" />
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
