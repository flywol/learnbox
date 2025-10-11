import BaseApiClient from '@/common/api/baseApiClient';

export interface ForumMessage {
  _id: string;
  message: string;
  author: {
    _id: string;
    fullName: string;
    role: string;
  };
  authorType: 'teacher' | 'student';
  replyTo?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostMessageRequest {
  message: string;
  replyTo?: string;
}

export interface UpdateMessageRequest {
  message?: string;
  isPinned?: boolean;
}

export interface GetMessagesResponse {
  data: {
    messages: ForumMessage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMessages: number;
    };
  };
}

class ForumApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  async getMessages(
    lessonId: string,
    page: number = 1,
    limit: number = 50,
    authorType?: 'teacher' | 'student'
  ): Promise<GetMessagesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (authorType) {
      params.append('authorType', authorType);
    }

    return this.get(`/forum/lessons/${lessonId}/messages?${params.toString()}`);
  }

  async postMessage(lessonId: string, data: PostMessageRequest): Promise<ForumMessage> {
    const response: any = await this.post(`/forum/lessons/${lessonId}/messages`, data);
    return response.data;
  }

  async updateMessage(messageId: string, data: UpdateMessageRequest): Promise<ForumMessage> {
    const response: any = await this.put(`/forum/messages/${messageId}`, data);
    return response.data;
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.delete(`/forum/messages/${messageId}`);
  }
}

export const forumApiClient = new ForumApiClient();