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
    const response = await this.post<CreateEventResponse>("/admin/add-event", data);
    return response.data;
  }

  // Get all events
  async getEvents(): Promise<EventResponse[]> {
    console.log('EventsApiClient.getEvents() called - making request to /admin/events');
    const response = await this.get<GetEventsResponse>("/admin/events");
    console.log('EventsApiClient.getEvents() response:', response);
    
    // Transform _id to id for frontend consistency
    return response.data.events.map((event: any) => ({
      ...event,
      id: event._id
    }));
  }

  // Get events by date range (optional - if needed later)
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventResponse[]> {
    const response = await this.get<GetEventsResponse>(
      `/admin/events?startDate=${startDate}&endDate=${endDate}`
    );
    
    // Transform _id to id for frontend consistency
    return response.data.events.map((event: any) => ({
      ...event,
      id: event._id
    }));
  }

  // Get events by receiver type (optional - if needed later)
  async getEventsByReceiver(receiver: 'all' | 'parents' | 'students' | 'teachers'): Promise<EventResponse[]> {
    const response = await this.get<GetEventsResponse>(`/admin/events?receiver=${receiver}`);
    
    // Transform _id to id for frontend consistency
    return response.data.events.map((event: any) => ({
      ...event,
      id: event._id
    }));
  }
}

// Export singleton instance
export const eventsApiClient = new EventsApiClient();
export default eventsApiClient;