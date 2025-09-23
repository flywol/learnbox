import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
	Home, 
	BookOpen, 
	Library, 
	MessageSquare, 
	User, 
	LogOut 
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

// Menu config for teachers — root-level paths only
const teacherMenuItems = [
	{
		label: "Overview hub",
		icon: Home,
		path: "/dashboard",
	},
	{ 
		label: "Classroom", 
		icon: BookOpen, 
		path: "/teacher/classes" 
	},
	{ 
		label: "LearnBox library", 
		icon: Library, 
		path: "/teacher/library" 
	},
	{ 
		label: "Chat", 
		icon: MessageSquare, 
		path: "/teacher/chat" 
	},
	{ 
		label: "Profile", 
		icon: User, 
		path: "/teacher/profile" 
	},
];

export default function TeacherSidebar() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const location = useLocation();
	const { logout } = useAuthStore();

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		await logout();
	};

	// Active check — exact or starts with path + "/"
	const isMenuActive = (itemPath: string) => {
		return (
			location.pathname === itemPath ||
			location.pathname.startsWith(itemPath + "/")
		);
	};

	return (
		<aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
			{/* Logo */}
			<div className="p-6">
				<h1 className="text-2xl font-bold">
					Learn<span className="text-orange-500">Box</span>
				</h1>
			</div>

			{/* Menu */}
			<nav className="flex-1 p-4">
				<ul className="space-y-2">
					{teacherMenuItems.map((item) => {
						const active = isMenuActive(item.path);
						return (
							<li key={item.path}>
								<NavLink
									to={item.path}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
										active
											? "bg-orange-50 text-orange-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}>
									<item.icon className="w-5 h-5" />
									<span>{item.label}</span>
								</NavLink>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Logout */}
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