import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";

interface Props {
	children?: ReactNode;
}

export default function TeacherLayout({ children }: Props) {
	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Full width header */}
			<TeacherHeader />
			{/* Sidebar and main content below header */}
			<div className="flex flex-1 overflow-hidden">
				<TeacherSidebar />
				<main className="flex-1 overflow-auto">
					<div className="p-6">
						{children || <Outlet />}
					</div>
				</main>
			</div>
		</div>
	);
}