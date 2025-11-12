import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
	Home,
	Users,
	CreditCard,
	MessageSquare,
	User,
	LogOut,
	RefreshCw,
} from "lucide-react";

// Menu config for parents
const parentMenuItems = [
	{
		label: "Overview hub",
		icon: Home,
		path: "/parent/dashboard",
	},
	{
		label: "Child",
		icon: Users,
		path: "/parent/child",
	},
	{
		label: "School payments",
		icon: CreditCard,
		path: "/parent/payments",
	},
	{
		label: "Chat",
		icon: MessageSquare,
		path: "/parent/chat",
	},
	{
		label: "Profile",
		icon: User,
		path: "/parent/profile",
	},
];

export default function ParentSidebar() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const location = useLocation();

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		// TODO: Add logout logic when auth is ready
		console.log("Logout clicked");
		setTimeout(() => setIsLoggingOut(false), 1000);
	};

	// Active check — exact or starts with path + "/"
	const isMenuActive = (itemPath: string) => {
		// Handle dashboard/overview default when on /parent index
		if (itemPath === "/parent/dashboard" && location.pathname === "/parent") {
			return true;
		}

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
			<nav className="flex-1 p-4 overflow-y-auto">
				<ul className="space-y-2">
					{parentMenuItems.map((item) => {
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

			{/* Footer actions */}
			<div className="p-4 border-t border-gray-200 space-y-2">
				<button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-gray-700 hover:bg-gray-50">
					<RefreshCw className="w-5 h-5" />
					<span>Switch account</span>
				</button>
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
