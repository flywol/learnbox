import { Bell, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parentApiClient } from "../../api/parentApiClient";
import { parentQueryKeys } from "../../config/queryConfig";
import type { Notification } from "../../types/parent-api.types";

function formatTimeAgo(dateString: string): string {
	const now = new Date();
	const date = new Date(dateString);
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) {
		return 'now';
	} else if (diffMins < 60) {
		return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
	} else {
		return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
	}
}

export default function NotificationsPage() {
	const queryClient = useQueryClient();

	// Fetch notifications
	const {
		data: notificationsData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: parentQueryKeys.notifications(),
		queryFn: async () => {
			const response = await parentApiClient.getNotifications();
			return response.data;
		},
		staleTime: 1000 * 60, // 1 minute
		refetchOnWindowFocus: true,
	});

	// Mark notification as read mutation
	const markAsReadMutation = useMutation({
		mutationFn: (notificationId: string) =>
			parentApiClient.markNotificationAsRead(notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: parentQueryKeys.notifications() });
		},
	});

	const notifications = notificationsData?.notifications || [];
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleNotificationClick = async (notification: Notification) => {
		if (!notification.isRead) {
			await markAsReadMutation.mutateAsync(notification._id);
		}
	};

	const handleMarkAllAsRead = async () => {
		const unreadNotifications = notifications.filter((n) => !n.isRead);
		for (const notification of unreadNotifications) {
			await markAsReadMutation.mutateAsync(notification._id);
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			<div className="bg-white rounded-lg shadow">
				<div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<div className="flex items-center gap-3 md:gap-4">
						<h1 className="text-lg md:text-xl font-semibold text-gray-900">Notifications</h1>
						{isLoading && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
					</div>
					{unreadCount > 0 && !isLoading && (
						<button
							onClick={handleMarkAllAsRead}
							disabled={markAsReadMutation.isPending}
							className="text-orange-600 hover:text-orange-700 font-medium text-xs md:text-sm disabled:opacity-50"
						>
							Mark all as read
						</button>
					)}
				</div>

				{error && (
					<div className="p-4 md:p-6 bg-red-50 border-b border-red-100">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
							<p className="text-red-600 text-sm">Failed to load notifications</p>
							<button
								onClick={() => refetch()}
								className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium"
							>
								Retry
							</button>
						</div>
					</div>
				)}

				<div className="divide-y divide-gray-100">
					{isLoading && notifications.length === 0 && (
						<div className="p-8 md:p-12 text-center">
							<Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-orange-500 mx-auto mb-3 md:mb-4" />
							<p className="text-gray-500 text-sm md:text-base">Loading notifications...</p>
						</div>
					)}

					{!isLoading && notifications.map((notification) => (
						<div
							key={notification._id}
							className={`p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
								!notification.isRead ? 'bg-orange-50/30' : ''
							}`}
							onClick={() => handleNotificationClick(notification)}
						>
							<div className="flex items-start gap-3 md:gap-4">
								<div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
									<span className="text-orange-600 font-medium text-sm md:text-base">
										{notification.title.charAt(0)}
									</span>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start sm:items-center justify-between mb-1 gap-2">
										<p className="text-xs md:text-sm font-medium text-gray-900 break-words flex-1">
											{notification.message}
										</p>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
												{formatTimeAgo(notification.createdAt)}
											</span>
											{!notification.isRead && (
												<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
											)}
										</div>
									</div>
									<p className="text-xs text-gray-500 break-words">
										{notification.title}
									</p>
								</div>
							</div>
						</div>
					))}

					{!isLoading && notifications.length === 0 && (
						<div className="p-8 md:p-12 text-center">
							<div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
								<Bell className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
							</div>
							<h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
							<p className="text-gray-500 text-sm md:text-base">You're all caught up! Check back later for new notifications.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
