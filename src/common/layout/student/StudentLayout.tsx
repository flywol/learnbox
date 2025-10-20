import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

interface Props {
	children?: ReactNode;
}

export default function StudentLayout({ children }: Props) {
	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Full width header */}
			<StudentHeader />
			{/* Sidebar and main content below header */}
			<div className="flex flex-1 overflow-hidden">
				<StudentSidebar />
				<main className="flex-1 overflow-auto">
					<div className="p-6">
						{children || <Outlet />}
					</div>
				</main>
			</div>
		</div>
	);
}
