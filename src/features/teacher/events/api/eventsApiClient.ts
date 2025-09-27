// SECURITY FIX: Teacher events API client - no admin endpoints
import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateEventRequest,
  EventResponse,
} from "../types/events.types";

class EventsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // SECURITY FIX: Teachers cannot create events - admin only feature
  async createEvent(_data: CreateEventRequest): Promise<EventResponse> {
    throw new Error('Teachers are not authorized to create events');
  }

  // SECURITY FIX: Mock events for teachers - no endpoints provided yet
  async getEvents(): Promise<EventResponse[]> {
    console.log('Mock API: Getting teacher events');
    return new Promise(resolve => {
      setTimeout(() => {
        const mockEvents: EventResponse[] = [
          {
            id: 'event-1',
            description: 'Parent-Teacher Conference - Meet with parents to discuss student progress',
            receivers: 'parents',
            date: '15/10/2024',
            repeat: 'no',
            school: 'school-1',
            createdAt: '2024-10-01T00:00:00.000Z',
            updatedAt: '2024-10-01T00:00:00.000Z',
            __v: 0
          },
          {
            id: 'event-2', 
            description: 'Mid-Term Examinations - Mid-term examinations for all classes',
            receivers: 'all',
            date: '05/11/2024',
            repeat: 'no',
            school: 'school-1',
            createdAt: '2024-10-01T00:00:00.000Z',
            updatedAt: '2024-10-01T00:00:00.000Z',
            __v: 0
          }
        ];
        resolve(mockEvents);
      }, 1000);
    });
  }

  // SECURITY FIX: Mock events by date range
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventResponse[]> {
    console.log('Mock API: Getting events by date range', { startDate, endDate });
    const allEvents = await this.getEvents();
    // Note: For proper date comparison, would need to convert DD/MM/YYYY format
    return allEvents; // Return all for now since it's mock data
  }

  // SECURITY FIX: Mock events by receiver type
  async getEventsByReceiver(receiver: 'all' | 'parents' | 'students' | 'teachers'): Promise<EventResponse[]> {
    console.log('Mock API: Getting events by receiver', receiver);
    const allEvents = await this.getEvents();
    return allEvents.filter(event => 
      event.receivers === receiver || event.receivers === 'all'
    );
  }
}

// Export singleton instance
export const eventsApiClient = new EventsApiClient();
export default eventsApiClient;