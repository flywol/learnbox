import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
	Home,
	BookOpen,
	Users,
	CreditCard,
	Library,
	User,
	LogOut,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

// Menu config — root-level paths only
const menuItems = [
	{
		label: "Overview hub",
		icon: Home,
		path: "/admin/dashboard",
		color: "text-orange-500",
	},
	{ label: "Classroom", icon: BookOpen, path: "/admin/classroom" },
	{ label: "Users", icon: Users, path: "/admin/users" },
	{ label: "School payments", icon: CreditCard, path: "/admin/payments" },
	{ label: "LearnBox library", icon: Library, path: "/admin/library" },
	{ label: "Profile", icon: User, path: "/admin/profile" },
];

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
	isTablet?: boolean;
}

export default function Sidebar({ isCollapsed, isTablet }: SidebarProps) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const location = useLocation();
	const { logout } = useAuthStore();

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		await logout();
	};

	// Active check — exact or starts with path + "/" or dashboard default
	const isMenuActive = (itemPath: string) => {
		// Handle dashboard/overview default when on /admin index
		if (itemPath === "/admin/dashboard" && location.pathname === "/admin") {
			return true;
		}

		return (
			location.pathname === itemPath ||
			location.pathname.startsWith(itemPath + "/")
		);
	};

	return (
		<aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} ${isTablet && !isCollapsed ? 'fixed top-16 left-0 bottom-0 z-20 shadow-xl' : ''}`}>
			{/* Logo */}
			<div className={`${isCollapsed ? 'p-4' : 'p-6'}`}>
				<h1 className={`font-bold ${isCollapsed ? 'text-lg text-center' : 'text-2xl'}`}>
					{isCollapsed ? (
						<span className="text-orange-500">L</span>
					) : (
						<>Learn<span className="text-orange-500">Box</span></>
					)}
				</h1>
			</div>

			{/* Menu */}
			<nav className="flex-1 p-4 overflow-y-auto">
				<ul className="space-y-2">
					{menuItems.map((item) => {
						const active = isMenuActive(item.path);
						return (
							<li key={item.path}>
								<NavLink
									to={item.path}
									className={`flex items-center gap-3 rounded-lg transition-colors ${
										isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
									} ${
										active
											? "bg-orange-50 text-orange-500"
											: "text-gray-700 hover:bg-gray-50"
									}`}
									title={isCollapsed ? item.label : undefined}>
									<item.icon className="w-5 h-5 flex-shrink-0" />
									{!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
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
					className={`flex items-center gap-3 rounded-lg transition-colors w-full ${
						isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
					} ${
						isLoggingOut
							? "text-gray-400 cursor-not-allowed"
							: "text-gray-700 hover:bg-gray-50"
					}`}
					title={isCollapsed ? (isLoggingOut ? "Logging out..." : "Logout") : undefined}>
					{isLoggingOut ? (
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
					) : (
						<LogOut className="w-5 h-5 flex-shrink-0" />
					)}
					{!isCollapsed && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
				</button>
			</div>
		</aside>
	);
}
