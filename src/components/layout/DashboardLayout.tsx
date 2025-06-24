import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

interface Props {
	children?: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 overflow-auto">{children || <Outlet />}</main>
			</div>
		</div>
	);
}
