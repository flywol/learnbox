import { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
	Home,
	Users,
	CreditCard,
	MessageSquare,
	User,
	LogOut,
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

interface ParentSidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function ParentSidebar({ isOpen, onClose }: ParentSidebarProps) {
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
		<>
			{/* Mobile Overlay */}
			{isOpen && (
				<div 
					className="fixed inset-0 bg-black/50 z-20 md:hidden"
					onClick={onClose}
				/>
			)}

			<aside className={`
				fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
				md:relative md:translate-x-0
				${isOpen ? 'translate-x-0' : '-translate-x-full'}
			`}>
				{/* Logo */}
				<div className="p-6 flex justify-between items-center">
					<Link to="/parent/dashboard">
						<h1 className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
							Learn<span className="text-orange-500">Box</span>
						</h1>
					</Link>
					{/* Close button for mobile */}
					<button 
						onClick={onClose}
						className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
					</button>
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
		</>
	);
}
