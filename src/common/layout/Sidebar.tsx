// Simple sidebar logout - no overkill!

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	Home,
	BookOpen,
	Users,
	CreditCard,
	Library,
	User,
	LogOut,
} from "lucide-react";
import { authApiClient } from "@/features/auth/api/authApiClient";

const menuItems = [
	{
		label: "Overview hub",
		icon: Home,
		path: "/dashboard",
		color: "text-orange-500",
	},
	{ label: "Classroom", icon: BookOpen, path: "/dashboard/classroom" },
	{ label: "Users", icon: Users, path: "/dashboard/users" },
	{ label: "School payments", icon: CreditCard, path: "/dashboard/payments" },
	{ label: "LearnBox library", icon: Library, path: "/dashboard/library" },
	{ label: "Profile", icon: User, path: "/dashboard/profile" },
];

export default function Sidebar() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		if (isLoggingOut) return;

		setIsLoggingOut(true);
		console.log("🚪 Logging out...");

		// Just call the API client logout - it handles everything
		await authApiClient.logout();
	};

	return (
		<aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
			<div className="p-6 border-b border-gray-200">
				<h1 className="text-2xl font-bold">
					Learn<span className="text-orange-500">Box</span>
				</h1>
			</div>
			<nav className="flex-1 p-4">
				<ul className="space-y-2">
					{menuItems.map((item) => (
						<li key={item.path}>
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
										isActive
											? "bg-orange-50 text-orange-500"
											: "text-gray-700 hover:bg-gray-50"
									}`
								}>
								<item.icon className="w-5 h-5" />
								<span>{item.label}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
			<div className="p-4 border-t border-gray-200">
				<button
					onClick={handleLogout}
					disabled={isLoggingOut}
					className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
						isLoggingOut
							? "text-gray-400 cursor-not-allowed"
							: "text-gray-700 hover:bg-gray-50"
					}`}>
					{isLoggingOut ? (
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
					) : (
						<LogOut className="w-5 h-5" />
					)}
					<span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
				</button>
			</div>
		</aside>
	);
}
