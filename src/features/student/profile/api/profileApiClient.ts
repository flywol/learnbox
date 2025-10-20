import BaseApiClient from "@/common/api/baseApiClient";
import type { StudentProfileResponse, UpdateStudentProfileDto } from "../types/profile.types";

class StudentProfileApiClient extends BaseApiClient {
	constructor() {
		super();
	}

	// Get student profile
	async getProfile(): Promise<StudentProfileResponse> {
		return this.get<StudentProfileResponse>("/student/profile");
	}

	// Update student profile
	async updateProfile(data: UpdateStudentProfileDto): Promise<StudentProfileResponse> {
		return this.put<StudentProfileResponse>("/student/profile", data);
	}
}

export const studentProfileApiClient = new StudentProfileApiClient();
export default studentProfileApiClient;
