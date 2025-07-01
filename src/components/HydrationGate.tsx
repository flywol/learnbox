// src/components/HydrationGate.tsx - Simplified
import  { ReactNode } from "react";
import { useAuthStore, useAuthLoading } from "@/features/auth/store/authStore";

export const HydrationGate = ({ children }: { children: ReactNode }) => {
	const hasHydrated = useAuthStore((state) => state.hasHydrated);
	const isAuthLoading = useAuthLoading();

	console.log("💧 HydrationGate:", { hasHydrated, isAuthLoading });

	// Show loading until hydrated and auth initialization is complete
	if (!hasHydrated || isAuthLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
					<p className="text-gray-600">
						{!hasHydrated ? "Loading..." : "Initializing..."}
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};
