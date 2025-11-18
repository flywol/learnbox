// Parent API Types based on provided endpoints

// Profile & Children Types
export interface Child {
	_id: string;
	fullName: string;
	email: string;
	profilePicture?: string;
	class: {
		_id: string;
		levelName: string;
		class: string;
		school: string;
		arms: Array<{
			id: string;
			armName: string;
			_id: string;
		}>;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	classArm: {
		_id: string;
		armName: string;
		parentClass: string;
		school: string;
		__v: number;
		createdAt: string;
		updatedAt: string;
	};
	classLevel: string;
	classArmName: string;
}

export interface ParentProfile {
	_id: string;
	fullName: string;
	email: string;
	gender: string;
	role: string;
	phoneNumber: string;
	linkChild: Array<string | Child>; // Can be just IDs or populated Child objects
	relationshipToStudent: string;
	school: {
		_id: string;
		schoolName: string;
		schoolShortName: string;
		learnboxUrl: string;
		admin: string;
		isDeleted: boolean;
		createdAt: string;
		updatedAt: string;
		__v: number;
		principalSignature?: string;
		schoolAddress?: string;
		schoolEmail?: string;
		schoolLogo?: string;
		schoolPhoneNumber?: string;
		schoolWebsite?: string;
	};
	profilePicture?: string;
	isVerified: boolean;
	isActive: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ParentProfileResponse {
	data: {
		parent: ParentProfile;
		children?: Child[]; // Populated children data
	};
}

export interface UpdateProfileRequest {
	fullName?: string;
	phoneNumber?: string;
	profilePicture?: File;
	relationshipToStudent?: string;
}

// Child Overview Types
export interface ChildOverview {
	student: {
		fullName: string;
		profilePicture?: string;
		class: Child['class'];
		classArm: Child['classArm'];
	};
	overview: {
		attendance: {
			percentage: number;
			totalClasses: number;
			attended: number;
			missed: number;
		};
		assignments: {
			total: number;
			completed: number;
			pending: number;
		};
		tests: {
			averageScore: number;
			totalTests: number;
			completedTests: number;
			pendingTests: number;
		};
	};
}

export interface ChildOverviewResponse {
	data: ChildOverview;
}

// Recent Lessons Types
export interface RecentLesson {
	_id: string;
	title: string;
	number: string; // e.g., "9/16"
	subject: {
		_id: string;
		name: string;
	};
	teacher: {
		_id: string;
		fullName: string;
	};
	startDate: string;
	timeAgo: string;
	completionPercentage: number;
	isCompleted: boolean;
}

export interface RecentLessonsResponse {
	data: {
		recentLessons: RecentLesson[];
	};
}

// Subjects Types
export interface SubjectProgress {
	_id: string;
	name: string;
	teacher: string;
	currentLesson: string; // e.g., "9/16"
	progressPercentage: number;
}

export interface SubjectsResponse {
	data: {
		subjects: SubjectProgress[];
	};
}

// Subject Lessons Types
export interface SubjectLesson {
	_id: string;
	title: string;
	number: string;
	lessonNumber: number;
	isCompleted: boolean;
	isLocked: boolean;
	completionPercentage: number;
	contentCount: number;
}

export interface SubjectLessonsResponse {
	data: {
		subject: {
			_id: string;
			name: string;
			teacher: {
				_id: string;
				fullName: string;
				profilePicture?: string;
				phoneNumber?: string;
			};
			overallProgress: number;
			totalLessons: number;
			completedLessons: number;
		};
		lessons: SubjectLesson[];
	};
}

// Lesson Detail Types
export interface LessonAssignment {
	_id: string;
	title: string;
	dueDate: string;
	isSubmitted: boolean;
	isCompleted: boolean;
}

export interface LessonQuiz {
	_id: string;
	title: string;
	duration: number;
	questionCount: number;
	isCompleted: boolean;
	score?: number;
}

export interface LessonDetailResponse {
	data: {
		lesson: {
			_id: string;
			title: string;
			number: string;
			subject: {
				_id: string;
				name: string;
			};
			teacher: {
				_id: string;
				fullName: string;
				profilePicture?: string;
			};
			completionPercentage: number;
			isCompleted: boolean;
		};
		assignments: LessonAssignment[];
		quizzes: LessonQuiz[];
	};
}

// Schedule Types
export interface ScheduleResponse {
	data: {
		schedule: any[]; // Define based on actual schedule structure
	};
}

// Calendar Types
export interface CalendarItem {
	type: 'event' | 'assignment' | 'class';
	id?: string;
	message: string;
	date?: string;
	repeat?: string;
	title?: string;
	subject?: string;
	dueDate?: string;
	dueTime?: string;
	deadline?: string;
	teacher?: string;
	startTime?: string;
	endTime?: string;
}

export interface CalendarDay {
	day: number;
	date: string;
	dayOfWeek: string;
	items: CalendarItem[];
}

export interface CalendarResponse {
	data: {
		month: string;
		year: number;
		monthNumber: number;
		daysInMonth: number;
		calendar: CalendarDay[];
	};
}

// Events Types
export interface SchoolEvent {
	_id: string;
	description: string;
	receivers: string;
	date: string;
	repeat: string;
	school: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface EventsResponse {
	data: {
		events: SchoolEvent[];
	};
}

// Academic Record Types
export interface AcademicRecordResponse {
	data: {
		assessments: any[];
		testSubmissions: any[];
		assignmentSubmissions: any[];
	};
}

// Academic Grades Types
export interface SubjectGrade {
	_id: string;
	subjectId: string;
	subjectName: string;
	teacher: string;
	grade: string;
	total: number;
	attendance: number;
	assignment: number;
	test: number;
	exam: number;
	remarks: string;
}

export interface AcademicGradesResponse {
	data: {
		student: {
			fullName: string;
			profilePicture?: string;
			class: any;
			classArm: any;
		};
		session: {
			_id: string;
			name: string;
		};
		term: string;
		subjects: SubjectGrade[];
		summary: {
			totalSubjects: number;
			averageScore: number;
		};
	};
}

// Grade Breakdown Types
export interface GradeBreakdownItem {
	type: string;
	score: number;
	maxScore: number;
	percentage: number;
}

export interface GradeBreakdownResponse {
	data: {
		assessment: {
			_id: string;
			subject: {
				_id: string;
				name: string;
			};
			teacher: {
				_id: string;
				fullName: string;
				profilePicture?: string;
			};
			session: {
				_id: string;
				sessionYear: string;
			};
			term: string;
			grade: string;
			total: number;
			remarks: string;
		};
		breakdown: GradeBreakdownItem[];
		overview: {
			testScore: string;
			session: string;
		};
	};
}

// Notifications Types
export interface Notification {
	_id: string;
	title: string;
	message: string;
	userId: string;
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface NotificationsResponse {
	data: {
		notifications: Notification[];
	};
}

export interface MarkNotificationReadResponse {
	data: {
		message: string;
	};
}
