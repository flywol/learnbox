import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateEventRequest,
  EventResponse,
} from "../types/events.types";

class EventsApiClient extends BaseApiClient {
  async createEvent(_data: CreateEventRequest): Promise<EventResponse> {
    throw new Error('Teachers are not authorized to create events');
  }

  async getEvents(): Promise<EventResponse[]> {
    try {
      const response = await this.get<any>("/admin/events");
      const events: any[] = response?.data?.events ?? response?.data ?? [];
      return events.map((event: any) => ({ ...event, id: event._id ?? event.id }));
    } catch (err: any) {
      // 403 = teacher doesn't have admin access; return empty gracefully
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        return [];
      }
      throw err;
    }
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventResponse[]> {
    const all = await this.getEvents();
    return all.filter((e) => {
      if (!e.date) return true;
      return e.date >= startDate && e.date <= endDate;
    });
  }

  async getEventsByReceiver(receiver: 'all' | 'parents' | 'students' | 'teachers'): Promise<EventResponse[]> {
    const all = await this.getEvents();
    return all.filter((e) => e.receivers === receiver || e.receivers === 'all');
  }
}

export const eventsApiClient = new EventsApiClient();
export default eventsApiClient;
