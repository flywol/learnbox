import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";
import ParentHeader from "./ParentHeader";

interface Props {
	children?: ReactNode;
}

export default function ParentLayout({ children }: Props) {
	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Full width header */}
			<ParentHeader />
			{/* Sidebar and main content below header */}
			<div className="flex flex-1 overflow-hidden">
				<ParentSidebar />
				<main className="flex-1 overflow-auto">
					<div className="p-6">
						{children || <Outlet />}
					</div>
				</main>
			</div>
		</div>
	);
}
