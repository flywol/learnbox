import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

interface Props {
	children?: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Full width header */}
			<Header />
			{/* Sidebar and main content below header */}
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<main className="flex-1 overflow-auto">
					<div className="p-6">
						{children || <Outlet />}
					</div>
				</main>
			</div>
		</div>
	);
}
