// src/features/school-setup/api/schoolSetupApiClient.ts
import BaseApiClient from "@/common/api/baseApiClient";
import { ClassArm, ClassLevel } from "../school-setup/store/schoolSetupStore";
import { SchoolInfo } from "../types/dashboard.types";
import type {
  CreateClassesRequest,
  CreateClassesResponse,
  AddClassArmsRequest,
  AddClassArmsResponse,
  CreateSessionRequest,
  CreateSessionResponse,
} from "../types/dashboard-api.types";

// API Request/Response Types
// interface UpdateSchoolInfoRequest {
// 	schoolName: string;
// 	schoolShortName: string;
// 	schoolWebsite: string;
// 	schoolPhoneNumber: string;
// 	schoolEmail: string;
// 	schoolAddress: string;
// 	learnboxUrl: string;
// 	schoolLogo: string;
// 	country: string;
// 	principalSignature: string;
// 	schoolMotto: string;
// 	schoolType: string;
// 	state: string;
// 	schoolPrincipal?: string; // Optional field for principal's name
// }

interface SchoolInfoResponse {
	statusCode: number;
	message: string;
	data: {
		school: {
			_id: string;
			schoolName: string;
			schoolShortName: string;
			schoolWebsite: string;
			schoolPhoneNumber: string;
			schoolEmail: string;
			schoolAddress: string;
			learnboxUrl: string;
			schoolLogo: string;
			country: string;
			principalSignature: string;
		};
	};
}

// Interface definitions moved to dashboard-api.types.ts

class SchoolSetupApiClient extends BaseApiClient {
	constructor() {
		super();
	}

	// Helper function to convert File to base64
	private async fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const result = reader.result as string;
				// Remove the data:image/jpeg;base64, prefix to get just the base64 string
				const base64 = result.split(",")[1] || result;
				resolve(base64);
			};
			reader.onerror = (error) => reject(error);
		});
	}

	// Update school information
	async updateSchoolInfo(
		schoolInfo: Partial<SchoolInfo>
	): Promise<SchoolInfoResponse> {
		try {
			console.log("📡 API: updateSchoolInfo called");

			// Convert files to base64 if they exist
			let schoolLogo = "";
			let principalSignature = "";

			if (schoolInfo.schoolLogo && schoolInfo.schoolLogo instanceof File) {
				schoolLogo = await this.fileToBase64(schoolInfo.schoolLogo);
				console.log("✅ Converted schoolLogo to base64");
			} else if (typeof schoolInfo.schoolLogo === "string") {
				schoolLogo = schoolInfo.schoolLogo;
			}

			if (
				schoolInfo.principalSignature &&
				schoolInfo.principalSignature instanceof File
			) {
				principalSignature = await this.fileToBase64(
					schoolInfo.principalSignature
				);
				console.log("✅ Converted principalSignature to base64");
			} else if (typeof schoolInfo.principalSignature === "string") {
				principalSignature = schoolInfo.principalSignature;
			}

			// Map frontend fields to API schema - USE THE CONVERTED BASE64 STRINGS
			const requestData = {
				schoolName: schoolInfo.schoolName || "",
				schoolShortName: schoolInfo.schoolShortName || "",
				schoolWebsite: schoolInfo.schoolWebsite || "",
				schoolPhoneNumber: schoolInfo.schoolPhoneNumber || "",
				schoolEmail: schoolInfo.schoolEmail || "",
				schoolAddress: schoolInfo.schoolAddress || "",
				learnboxUrl: schoolInfo.learnboxUrl || "",
				schoolLogo: schoolLogo, // Use converted base64 string
				country: schoolInfo.country || "",
				principalSignature: principalSignature, // Use converted base64 string
				schoolPrincipal: schoolInfo.schoolPrincipal || "",
				schoolMotto: schoolInfo.schoolMotto || "",
				schoolType: schoolInfo.schoolType || "",
				state: schoolInfo.state || "",
			};

			console.log("📤 Sending data to API:", {
				...requestData,
				schoolLogo: schoolLogo ? "base64 string (hidden)" : "empty",
				principalSignature: principalSignature
					? "base64 string (hidden)"
					: "empty",
			});

			const response = await this.post<SchoolInfoResponse>(
				"/admin/update-school-information",
				requestData
			);

			console.log("✅ API: updateSchoolInfo success");
			return response;
		} catch (error) {
			console.error("❌ API: updateSchoolInfo failed:", error);
			throw error;
		}
	}

	// Create multiple classes with arms
	async createClasses(
		classLevels: ClassLevel[],
		classArms: ClassArm[]
	): Promise<CreateClassesResponse> {
		try {
			console.log("📡 API: createClasses called");

			// Transform selected class levels and arms to API format
			const classes = classLevels
				.filter((level) => level.selected)
				.map((level) => {
					const classArmData = classArms.find(
						(arm) => arm.classId === level.id
					);
					const arms = classArmData?.arms || [];
					const customArms = classArmData?.customArms || [];
					const allArms = [...arms, ...customArms];

					// Map level category to API levelName
					const levelNameMap: Record<string, string> = {
						nursery: "Nursery Class",
						grade: "Grade Class",
						primary: "Primary Class",
						junior_secondary: "Junior Secondary levels",
						senior_secondary: "Senior Secondary levels",
					};

					return {
						levelName: levelNameMap[level.category] || level.category,
						class: level.name,
						arms: allArms,
					};
				})
				.filter((classData) => classData.arms.length > 0); // Only include classes with arms

			const requestData: CreateClassesRequest = { classes };

			const response = await this.post<CreateClassesResponse>(
				"/classes/create-multiple",
				requestData
			);

			console.log("✅ API: createClasses success");
			return response;
		} catch (error) {
			console.error("❌ API: createClasses failed:", error);
			throw error;
		}
	}

	// Add arms to existing class (legacy method - deprecated)
	async addClassArmsLegacy(
		classId: string,
		armNames: string[]
	): Promise<AddClassArmsResponse> {
		try {
			console.log("📡 API: addClassArmsLegacy called");

			const requestData: AddClassArmsRequest = {
				classId,
				armNames,
			};

			const response = await this.post<AddClassArmsResponse>(
				"/classes/arms",
				requestData
			);

			console.log("✅ API: addClassArmsLegacy success");
			return response;
		} catch (error) {
			console.error("❌ API: addClassArmsLegacy failed:", error);
			throw error;
		}
	}

	// Create academic session
	async createSession(sessionData: CreateSessionRequest): Promise<CreateSessionResponse> {
		try {
			console.log("📡 API: createSession called");

			const response = await this.post<CreateSessionResponse>(
				"/sessions/create",
				sessionData
			);

			console.log("✅ API: createSession success");
			return response;
		} catch (error) {
			console.error("❌ API: createSession failed:", error);
			throw error;
		}
	}

	// Enhanced create classes (using the new API format)
	async createMultipleClasses(data: CreateClassesRequest): Promise<CreateClassesResponse> {
		try {
			console.log("📡 API: createMultipleClasses called");

			const response = await this.post<CreateClassesResponse>(
				"/classes/create-multiple",
				data
			);

			console.log("✅ API: createMultipleClasses success");
			return response;
		} catch (error) {
			console.error("❌ API: createMultipleClasses failed:", error);
			throw error;
		}
	}

	// Add arms to existing class
	async addClassArms(data: AddClassArmsRequest): Promise<AddClassArmsResponse> {
		try {
			console.log("📡 API: addClassArms called");

			const response = await this.post<AddClassArmsResponse>(
				"/classes/arms",
				data
			);

			console.log("✅ API: addClassArms success");
			return response;
		} catch (error) {
			console.error("❌ API: addClassArms failed:", error);
			throw error;
		}
	}

	// Complete school setup (combines all steps)
	async completeSchoolSetup(
		schoolInfo: Partial<SchoolInfo>,
		classLevels: ClassLevel[],
		classArms: ClassArm[]
	): Promise<{
		schoolInfo: SchoolInfoResponse;
		classes: CreateClassesResponse;
	}> {
		try {
			console.log("📡 API: completeSchoolSetup called");

			// Execute both API calls
			const [schoolInfoResponse, classesResponse] = await Promise.all([
				this.updateSchoolInfo(schoolInfo),
				this.createClasses(classLevels, classArms),
			]);

			console.log("✅ API: completeSchoolSetup success");
			return {
				schoolInfo: schoolInfoResponse,
				classes: classesResponse,
			};
		} catch (error) {
			console.error("❌ API: completeSchoolSetup failed:", error);
			throw error;
		}
	}

	// Complete school setup with session (enhanced version)
	async completeSchoolSetupWithSession(
		schoolInfo: Partial<SchoolInfo>,
		classLevels: ClassLevel[],
		classArms: ClassArm[],
		sessionData: CreateSessionRequest
	): Promise<{
		schoolInfo: SchoolInfoResponse;
		classes: CreateClassesResponse;
		session: CreateSessionResponse;
	}> {
		try {
			console.log("📡 API: completeSchoolSetupWithSession called");

			// Execute all API calls in parallel
			const [schoolInfoResponse, classesResponse, sessionResponse] = await Promise.all([
				this.updateSchoolInfo(schoolInfo),
				this.createClasses(classLevels, classArms),
				this.createSession(sessionData),
			]);

			console.log("✅ API: completeSchoolSetupWithSession success");
			return {
				schoolInfo: schoolInfoResponse,
				classes: classesResponse,
				session: sessionResponse,
			};
		} catch (error) {
			console.error("❌ API: completeSchoolSetupWithSession failed:", error);
			throw error;
		}
	}
}

export const schoolSetupApiClient = new SchoolSetupApiClient();
export default schoolSetupApiClient;
