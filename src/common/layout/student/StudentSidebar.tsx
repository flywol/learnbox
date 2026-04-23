import { useState } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import {
	Home,
	BookOpen,
	Sparkles,
	User,
	LogOut,
	RefreshCw,
	Layers,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

const navItems = [
	{ label: "Overview hub",     icon: Home,     path: "/student/dashboard" },
	{ label: "Classroom",        icon: BookOpen, path: "/student/classroom" },
	{ label: "LearnBox AI",      icon: Sparkles, path: "/student/learnbox-ai" },
	{ label: "School Documents", icon: Layers,   path: "/student/school-documents" },
	{ label: "Profile",          icon: User,     path: "/student/profile" },
];

interface StudentSidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);

	const isMenuActive = (itemPath: string) => {
		if (itemPath === "/student/dashboard" && location.pathname === "/student") return true;
		return location.pathname === itemPath || location.pathname.startsWith(itemPath + "/");
	};

	const handleSwitchAccount = () => {
		navigate("/", { replace: true });
	};

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			logout();
			navigate("/", { replace: true });
		} catch {
			navigate("/", { replace: true });
		}
	};

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-20 md:hidden"
					onClick={onClose}
				/>
			)}

			<aside className={`
				fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
				md:relative md:translate-x-0
				${isOpen ? "translate-x-0" : "-translate-x-full"}
			`}>
				{/* Logo */}
				<div className="p-6 flex justify-between items-center flex-shrink-0">
					<Link to="/student/dashboard">
						<h1 className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
							Learn<span className="text-orange-500">Box</span>
						</h1>
					</Link>
					<button
						onClick={onClose}
						className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Nav items */}
				<nav className="flex-1 px-4 py-2 overflow-y-auto">
					<ul className="space-y-1">
						{navItems.map((item) => {
							const active = isMenuActive(item.path);
							return (
								<li key={item.path}>
									<NavLink
										to={item.path}
										className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
											active
												? "bg-orange-50 text-orange-500"
												: "text-gray-700 hover:bg-gray-50"
										}`}
									>
										<item.icon className="w-5 h-5 flex-shrink-0" />
										<span className="text-sm">{item.label}</span>
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* Footer: Switch account + Logout */}
				<div className="p-4 border-t border-gray-200 space-y-1 flex-shrink-0">
					<button
						onClick={handleSwitchAccount}
						className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors w-full text-gray-700 hover:bg-gray-50"
					>
						<RefreshCw className="w-5 h-5 flex-shrink-0" />
						<span className="text-sm">Switch account</span>
					</button>
					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors w-full ${
							isLoggingOut ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
						}`}
					>
						{isLoggingOut ? (
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 flex-shrink-0" />
						) : (
							<LogOut className="w-5 h-5 flex-shrink-0" />
						)}
						<span className="text-sm">{isLoggingOut ? "Logging out…" : "Logout"}</span>
					</button>
				</div>
			</aside>
		</>
	);
}
