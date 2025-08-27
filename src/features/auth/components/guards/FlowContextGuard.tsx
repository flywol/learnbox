// src/features/auth/components/guards/FlowContextGuard.tsx
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface FlowContextGuardProps {
	children: ReactNode;
	flowType: "forgot-password" | "signup" | "email-verification" | "login" | "role-selection" | "school-setup";
}

/**
 * FlowContextGuard - Ensures proper flow state isolation
 * 
 * This guard ensures that:
 * 1. Flow states are properly isolated between different auth flows
 * 2. Stale flow states are cleaned up when entering incompatible flows
 * 3. Cross-contamination between flows is prevented
 */
export const FlowContextGuard = ({ children, flowType }: FlowContextGuardProps) => {
	const { clearAllFlowStates, passwordResetStep } = useAuthStore();
	const location = useLocation();

	useEffect(() => {
		const currentPath = location.pathname;
		
		// Define flow compatibility matrix
		const shouldClearStates = (() => {
			switch (flowType) {
				case "forgot-password":
					// Allow forgot-password to coexist with verify-email and reset-password
					return !currentPath.includes("/forgot-password") 
						&& !currentPath.includes("/verify-email")
						&& !currentPath.includes("/reset-password");
						
				case "email-verification":
					return false; // Let individual components handle their cleanup
					
				case "signup":
					// Signup flow should be isolated from password reset flows
					return passwordResetStep !== null;
					
				case "login":
					// Login should be isolated unless coming from forgot-password
					return passwordResetStep !== null && !currentPath.includes("/forgot-password");
					
				case "role-selection":
				case "school-setup":
					// These flows should clear all temporary states
					return true;
					
				default:
					return false;
			}
		})();

		if (shouldClearStates) {
			clearAllFlowStates();
		}
	}, [flowType, location.pathname, clearAllFlowStates, passwordResetStep]);

	return <>{children}</>;
};