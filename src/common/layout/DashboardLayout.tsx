import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ProfileProvider } from "../contexts/ProfileContext";
import { useDeviceType } from "@/common/hooks/useDeviceType";
import { DeviceRestrictedPage } from "@/common/security/DeviceRestrictedPage";
import LearnBoxAIWidget from "@/common/components/ai/LearnBoxAIWidget";

interface Props {
	children?: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
	const { isMobile, isTablet } = useDeviceType();
	const [isCollapsed, setIsCollapsed] = useState(() => {
		if (typeof window === 'undefined') return false;
		const saved = localStorage.getItem('admin-sidebar-collapsed');
		return saved !== null ? saved === 'true' : true; // Default collapsed on tablet
	});

	// Persist collapse state
	useEffect(() => {
		localStorage.setItem('admin-sidebar-collapsed', String(isCollapsed));
	}, [isCollapsed]);

	// Auto-expand on desktop, respect saved state on tablet
	useEffect(() => {
		if (!isTablet) {
			// Desktop: always expanded
			setIsCollapsed(false);
		} else {
			// Tablet: use saved state or default to collapsed
			const saved = localStorage.getItem('admin-sidebar-collapsed');
			setIsCollapsed(saved !== null ? saved === 'true' : true);
		}
	}, [isTablet]);

	const handleToggle = () => {
		setIsCollapsed(prev => !prev);
	};

	// Block mobile access
	if (isMobile) {
		return <DeviceRestrictedPage role="admin" />;
	}

	return (
		<ProfileProvider>
			<div className="h-screen bg-gray-50 flex flex-col">
				{/* Full width header */}
				<Header
					onMenuToggle={handleToggle}
					showMenuButton={isTablet}
				/>
				{/* Sidebar and main content below header */}
				<div className="flex flex-1 overflow-hidden relative">
					{/* Overlay backdrop on tablet when sidebar is expanded */}
					{isTablet && !isCollapsed && (
						<div
							className="fixed inset-0 bg-black/50 z-10"
							onClick={handleToggle}
							style={{ top: '64px' }}
						/>
					)}

					<Sidebar
						isCollapsed={isCollapsed}
						onToggle={handleToggle}
						isTablet={isTablet}
					/>
					<main className="flex-1 overflow-auto">
						<div className="p-6">
							{children || <Outlet />}
						</div>
					</main>
				</div>
			<LearnBoxAIWidget />
			</div>
		</ProfileProvider>
	);
}
