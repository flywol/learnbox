import BaseApiClient from "@/common/api/baseApiClient";
import type {
  CreateLiveClassRequest,
  UpdateLiveClassRequest,
  LiveClassResponse,
  LiveClassListResponse,
  UpcomingLiveClassListResponse,
} from "../types/liveClass.types";

class LiveClassApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  /**
   * POST /api/v1/live-classes/{subjectId}
   * Create a new live class
   */
  async createLiveClass(
    subjectId: string,
    data: CreateLiveClassRequest
  ): Promise<LiveClassResponse> {
    const response = await this.post<{ data: LiveClassResponse }>(
      `/live-classes/${subjectId}`,
      data
    );
    return response.data;
  }

  /**
   * GET /api/v1/live-classes
   * Get all live classes for authenticated teacher
   */
  async getAllLiveClasses(): Promise<LiveClassResponse[]> {
    const response = await this.get<LiveClassListResponse>("/live-classes");
    return response.data.liveClasses;
  }

  /**
   * GET /api/v1/live-classes/upcoming
   * Get upcoming live classes with time remaining
   */
  async getUpcomingLiveClasses(): Promise<UpcomingLiveClassListResponse['data']['liveClasses']> {
    const response = await this.get<UpcomingLiveClassListResponse>("/live-classes/upcoming");
    return response.data.liveClasses;
  }

  /**
   * GET /api/v1/live-classes/happening-now
   * Get live classes happening right now
   */
  async getHappeningNowLiveClasses(): Promise<LiveClassResponse[]> {
    const response = await this.get<LiveClassListResponse>("/live-classes/happening-now");
    return response.data.liveClasses;
  }

  /**
   * GET /api/v1/live-classes/by-class-subject
   * Get live classes by class and subject
   */
  async getLiveClassesByClassSubject(params: {
    classId: string;
    subjectId: string;
    classArmId?: string;
  }): Promise<LiveClassResponse[]> {
    const queryParams = new URLSearchParams({
      classId: params.classId,
      subjectId: params.subjectId,
      ...(params.classArmId && { classArmId: params.classArmId }),
    });

    const response = await this.get<LiveClassListResponse>(
      `/live-classes/by-class-subject?${queryParams}`
    );
    return response.data.liveClasses;
  }

  /**
   * GET /api/v1/live-classes/{id}
   * Get a live class by ID
   */
  async getLiveClassById(id: string): Promise<LiveClassResponse> {
    const response = await this.get<{ data: LiveClassResponse }>(`/live-classes/${id}`);
    return response.data;
  }

  /**
   * PUT /api/v1/live-classes/{id}
   * Update a live class
   */
  async updateLiveClass(
    id: string,
    data: UpdateLiveClassRequest
  ): Promise<LiveClassResponse> {
    const response = await this.put<{ data: LiveClassResponse }>(
      `/live-classes/${id}`,
      data
    );
    return response.data;
  }

  /**
   * DELETE /api/v1/live-classes/{id}
   * Delete a live class
   */
  async deleteLiveClass(id: string): Promise<void> {
    await this.delete(`/live-classes/${id}`);
  }

  /**
   * Helper: Upload recording URL after class
   */
  async uploadRecording(id: string, recordingUrl: string): Promise<LiveClassResponse> {
    return this.updateLiveClass(id, { recordingUrl });
  }
}

// Export singleton instance
export const liveClassApiClient = new LiveClassApiClient();
export default liveClassApiClient;
