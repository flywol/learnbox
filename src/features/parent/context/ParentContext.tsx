import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { parentApiClient } from "../api/parentApiClient";
import type { ParentProfile, Child } from "../types/parent-api.types";
import { parentQueryConfig, parentQueryKeys } from "../config/queryConfig";

interface ParentContextType {
	profile: ParentProfile | null;
	children: Child[];
	selectedChild: Child | null;
	isLoading: boolean;
	error: Error | null;
	selectChild: (child: Child) => void;
	refetchProfile: () => void;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentProvider({ children }: { children: ReactNode }) {
	const [selectedChild, setSelectedChild] = useState<Child | null>(null);

	// Fetch parent profile with children
	const {
		data: profileData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: parentQueryKeys.profile(),
		queryFn: async () => {
			const response = await parentApiClient.getProfile();
			return response.data;
		},
		...parentQueryConfig.profile,
		// Persist profile data across sessions
		gcTime: 1000 * 60 * 60 * 24, // 24 hours (replaces old cacheTime)
	});

	// Set default child (first child) when profile loads
	useEffect(() => {
		if (profileData?.children && profileData.children.length > 0 && !selectedChild) {
			setSelectedChild(profileData.children[0]);
		}
	}, [profileData, selectedChild]);

	const selectChild = (child: Child) => {
		setSelectedChild(child);
	};

	const value: ParentContextType = {
		profile: profileData?.parent || null,
		children: profileData?.children || [],
		selectedChild,
		isLoading,
		error: error as Error | null,
		selectChild,
		refetchProfile: refetch,
	};

	return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>;
}

export function useParentContext() {
	const context = useContext(ParentContext);
	if (context === undefined) {
		throw new Error("useParentContext must be used within a ParentProvider");
	}
	return context;
}
