import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateEventRequest,
  CreateEventResponse,
  GetEventsResponse,
  EventResponse,
} from "../types/events.types";

class EventsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Create a new event
  async createEvent(data: CreateEventRequest): Promise<EventResponse> {
    try {
      const response = await this.post<CreateEventResponse>("/admin/add-event", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all events
  async getEvents(): Promise<EventResponse[]> {
    try {
      console.log('EventsApiClient.getEvents() called - making request to /admin/events');
      const response = await this.get<GetEventsResponse>("/admin/events");
      console.log('EventsApiClient.getEvents() response:', response);
      return response.data.events;
    } catch (error) {
      console.error('EventsApiClient.getEvents() error:', error);
      throw error;
    }
  }

  // Get events by date range (optional - if needed later)
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventResponse[]> {
    try {
      const response = await this.get<GetEventsResponse>(
        `/admin/events?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data.events;
    } catch (error) {
      throw error;
    }
  }

  // Get events by receiver type (optional - if needed later)
  async getEventsByReceiver(receiver: 'all' | 'parents' | 'students' | 'teachers'): Promise<EventResponse[]> {
    try {
      const response = await this.get<GetEventsResponse>(`/admin/events?receiver=${receiver}`);
      return response.data.events;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const eventsApiClient = new EventsApiClient();
export default eventsApiClient;