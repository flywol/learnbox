
// Re-export all types from a central location
export * from "./auth.types";
export * from "./user.types";

// You can also create type aliases for commonly used combinations
import { User, Role } from "./user.types";
import { AuthSession, LoginContext } from "./auth.types";

export type AuthenticatedUser = User & {
	session: AuthSession;
	context: LoginContext;
};
