import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNotificationsStore } from "../store/notificationsStore";
import { formatTimeAgo } from "../utils/formatTime";
import { Notification } from "../types/notification.types";

interface NotificationDropdownProps {
	onNotificationPageClick: () => void;
}

export default function NotificationDropdown({ onNotificationPageClick }: NotificationDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const {
		notifications,
		isLoading,
		error,
		fetchNotifications,
		getUnreadCount,
		getRecentNotifications,
		markAsRead
	} = useNotificationsStore();

	const recentNotifications = getRecentNotifications(3);
	const unreadCount = getUnreadCount();

	// Fetch notifications on mount
	useEffect(() => {
		if (notifications.length === 0) {
			fetchNotifications();
		}
	}, [notifications.length, fetchNotifications]);

	const handleNotificationClick = async (notification: Notification) => {
		if (!notification.isRead) {
			await markAsRead(notification.id);
		}
		onNotificationPageClick();
	};

	return (
		<div className="relative">
			<button
				className="p-2 hover:bg-gray-100 rounded-lg relative"
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				onClick={onNotificationPageClick}
			>
				<Bell className="w-5 h-5 text-gray-600" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div
					className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}
				>
					<div className="p-4 border-b border-gray-100">
						<h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
					</div>

					<div className="max-h-80 overflow-y-auto">
						{isLoading && (
							<div className="p-8 text-center">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
								<p className="text-sm text-gray-500">Loading notifications...</p>
							</div>
						)}

						{error && (
							<div className="p-4 text-center">
								<p className="text-sm text-red-600">{error}</p>
								<button
									onClick={fetchNotifications}
									className="text-blue-600 hover:text-blue-700 text-sm mt-1"
								>
									Try again
								</button>
							</div>
						)}

						{!isLoading && !error && recentNotifications.length === 0 && (
							<div className="p-8 text-center">
								<Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
								<p className="text-sm text-gray-500">No notifications yet</p>
							</div>
						)}

						{!isLoading && !error && recentNotifications.map((notification) => (
							<div
								key={notification.id}
								className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
								onClick={() => handleNotificationClick(notification)}
							>
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-blue-600 text-sm font-medium">
											{notification.title.charAt(0)}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium text-gray-900 truncate">
												{notification.message}
											</p>
											<span className="text-xs text-gray-500 ml-2 flex-shrink-0">
												{formatTimeAgo(notification.created_at)}
											</span>
										</div>
										{!notification.isRead && (
											<div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="p-4 border-t border-gray-100">
						<button
							onClick={onNotificationPageClick}
							className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
						>
							See more
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
