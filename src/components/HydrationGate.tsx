// src/components/HydrationGate.tsx
import React, { ReactNode } from "react";
import { useHasHydrated } from "@/features/auth/store/authStore";

export const HydrationGate = ({ children }: { children: ReactNode }) => {
	const hasHydrated = useHasHydrated();

	if (!hasHydrated) return null;

	return <>{children}</>;
};
