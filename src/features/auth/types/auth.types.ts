
export type Role = "STUDENT" | "PARENT" | "ADMIN" | "TEACHER";

export interface User {
	id: string;
	name: string;
	email: string;
	role: Role | null; // Role can be null before the user selects it
}
