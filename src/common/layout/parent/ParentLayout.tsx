import { ReactNode, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";
import ParentHeader from "./ParentHeader";
import { ParentProvider } from "@/features/parent/context/ParentContext";
import LearnBoxAIWidget from "@/common/components/ai/LearnBoxAIWidget";


interface Props {
	children?: ReactNode;
}

export function ParentLayoutContent({ children }: Props) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();

	// Close mobile menu on route change
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Full width header */}
			<ParentHeader onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
			{/* Sidebar and main content below header */}
			<div className="flex flex-1 overflow-hidden">
				<ParentSidebar
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				/>
				<main className="flex-1 overflow-auto w-full">
					<div className="p-4 md:p-6 pb-20 md:pb-6">
						{children || <Outlet />}
					</div>
				</main>
			</div>
			<LearnBoxAIWidget />
		</div>
	);
}

export default function ParentLayout({ children }: Props) {
	return (
		<ParentProvider>
			<ParentLayoutContent>{children}</ParentLayoutContent>
		</ParentProvider>
	);
}
