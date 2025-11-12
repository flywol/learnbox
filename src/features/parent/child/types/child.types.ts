export interface ChildSubject {
	id: string;
	name: string;
	icon: string;
	teacher: string;
	lessonNumber: number;
	totalLessons: number;
	progress: number;
	color: string; // Tailwind class
}

export interface Lesson {
	id: string;
	number: number;
	title: string;
	status: "completed" | "in_progress" | "locked";
}

export interface LessonContent {
	id: string;
	title: string;
	type: "video" | "document" | "quiz";
	completed: boolean;
}

export interface SubjectDetail {
	id: string;
	name: string;
	icon: string;
	description: string;
	teacher: string;
	progress: number;
	color: string;
	lessons: Lesson[];
}
