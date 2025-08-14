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
    try {
      const response = await this.get<NotificationResponse>("/notifications/get-all-notifications");
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark a specific notification as read
  async markAsRead(notificationId: string): Promise<MarkReadResponse> {
    try {
      const response = await this.post<MarkReadResponse>(`/notifications/read-notification/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const notificationsApiClient = new NotificationsApiClient();