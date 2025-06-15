// src/features/auth/components/guards/FlowGuard.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface FlowGuardProps {
	children: ReactNode;
	requiresRole?: boolean;
	requiresSchool?: boolean;
	allowedRoles?: Array<"STUDENT" | "PARENT" | "ADMIN" | "TEACHER">;
}

/**
 * FlowGuard - Ensures users follow the proper authentication flow
 *
 * Authentication flow order:
 * 1. Role Selection (/select-role)
 * 2. School Setup (/school-setup)
 * 3. Login or Signup
 *
 * Features:
 * - Enforces sequential flow completion
 * - Role-based access control
 * - Redirects to appropriate step if requirements not met
 */
export const FlowGuard = ({
	children,
	requiresRole = false,
	requiresSchool = false,
	allowedRoles = [],
}: FlowGuardProps) => {
	const { selectedRole, schoolDomain } = useAuthStore();
	const location = useLocation();

	// Check role requirement
	if (requiresRole && !selectedRole) {
		return (
			<Navigate
				to="/"
				replace
				state={{ from: location }}
			/>
		);
	}

	// Check if specific roles are required
	if (allowedRoles.length > 0 && selectedRole) {
		if (!allowedRoles.includes(selectedRole)) {
			// Redirect to role selection if current role is not allowed
			return (
				<Navigate
					to="/"
					replace
					state={{ from: location }}
				/>
			);
		}
	}

	// Check school requirement
	if (requiresSchool && !schoolDomain) {
		// If role is set but school isn't, go to school setup
		if (selectedRole) {
			return (
				<Navigate
					to="/school-setup"
					replace
					state={{ from: location }}
				/>
			);
		} else {
			// If neither role nor school is set, start from the beginning
			return (
				<Navigate
					to="/"
					replace
					state={{ from: location }}
				/>
			);
		}
	}

	return <>{children}</>;
};
