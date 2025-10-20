export interface Notification {
	id: string;
	title: string;
	message: string;
	isRead: boolean;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface NotificationResponse {
	data: {
		notifications: Notification[];
	};
}

export interface MarkReadResponse {
	data: {
		message: string;
	};
}

export interface NotificationSummary {
	total: number;
	unread: number;
	recent: Notification[];
}
