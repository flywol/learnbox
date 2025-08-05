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
      console.log("📡 API: getAllNotifications called");
      const response = await this.get<NotificationResponse>("/notifications/get-all-notifications");
      console.log("✅ API: getAllNotifications success", response.data);
      return response;
    } catch (error) {
      console.error("❌ API: getAllNotifications failed:", error);
      throw error;
    }
  }

  // Mark a specific notification as read
  async markAsRead(notificationId: string): Promise<MarkReadResponse> {
    try {
      console.log("📡 API: markAsRead called for ID:", notificationId);
      const response = await this.post<MarkReadResponse>(`/notifications/read-notification/${notificationId}`);
      console.log("✅ API: markAsRead success", response.data);
      return response;
    } catch (error) {
      console.error("❌ API: markAsRead failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationsApiClient = new NotificationsApiClient();