export interface StudentProfile {
	_id: string;
	fullName: string;
	phoneNumber: string;
	admissionNumber: string;
	email: string;
	school: {
		_id: string;
		schoolName: string;
	};
	role: string;
	class: {
		_id: string;
		levelName: string;
		class: string;
	};
	classArm: {
		_id: string;
		armName: string;
	};
	classLevel: string;
	classArmName: string;
	gender: string;
	dateOfBirth: string;
	parentName: string;
	isVerified: boolean;
	isActive: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	profilePicture?: string;
}

export interface StudentProfileResponse {
	data: {
		student: StudentProfile;
	};
}

export interface UpdateStudentProfileDto {
	fullName?: string;
	phoneNumber?: string;
	email?: string;
	profilePicture?: string;
	gender?: string;
	dateOfBirth?: string;
	parentName?: string;
}
