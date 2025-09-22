// src/common/layout/TeacherLayout.tsx - Simple layout with no API calls
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
	children?: ReactNode;
}

export default function TeacherLayout({ children }: Props) {
	const { logout, user } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Simple Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h1 className="text-xl font-semibold text-gray-900">
							LearnBox Teacher
						</h1>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-600">
							Welcome, {user?.fullName || 'Teacher'}
						</span>
						<button
							onClick={handleLogout}
							className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 overflow-auto">
				{children || <Outlet />}
			</main>
		</div>
	);
}