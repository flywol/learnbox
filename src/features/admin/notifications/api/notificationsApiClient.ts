import BaseApiClient from "@/common/api/baseApiClient";
import type { 
  NotificationResponse,
  MarkReadResponse
} from "../types/notification.types";

class NotificationsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Get all notifications for the current user
  async getAllNotifications(): Promise<NotificationResponse> {
    const response = await this.get<{ data: { notifications: unknown[] } }>("/notifications/get-all-notifications");
    
    // Transform MongoDB response to match frontend interface
    const transformedNotifications = response.data.notifications.map((notification: any) => ({
      ...notification,
      id: notification._id, // Transform _id to id
      created_at: notification.createdAt, // Transform createdAt to created_at
      updated_at: notification.updatedAt, // Transform updatedAt to updated_at
      deleted_at: notification.deletedAt || null // Transform deletedAt to deleted_at
    }));

    return {
      data: {
        notifications: transformedNotifications
      }
    };
  }

  // Mark a specific notification as read
  async markAsRead(notificationId: string): Promise<MarkReadResponse> {
    const response = await this.post<MarkReadResponse>(`/notifications/read-notification/${notificationId}`);
    return response;
  }
}

// Export singleton instance
export const notificationsApiClient = new NotificationsApiClient();