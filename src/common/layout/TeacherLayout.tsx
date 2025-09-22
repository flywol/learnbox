// src/common/layout/TeacherLayout.tsx - Teacher layout with sidebar navigation
import { ReactNode } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { 
  Home, 
  BookOpen, 
  Library, 
  MessageSquare, 
  User, 
  RefreshCw, 
  LogOut,
  Settings,
  Bell
} from "lucide-react";

interface Props {
	children?: ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  active?: boolean;
}

export default function TeacherLayout({ children }: Props) {
	const { logout, user } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logout();
	};

	const navItems: NavItem[] = [
		{
			icon: Home,
			label: "Overview hub",
			path: "/dashboard",
			active: location.pathname === "/dashboard"
		},
		{
			icon: BookOpen,
			label: "Classroom",
			path: "/teacher/classes",
			active: location.pathname.startsWith("/teacher/classes")
		},
		{
			icon: Library,
			label: "LearnBox library",
			path: "/teacher/library",
			active: location.pathname.startsWith("/teacher/library")
		},
		{
			icon: MessageSquare,
			label: "Chat",
			path: "/teacher/chat",
			active: location.pathname.startsWith("/teacher/chat")
		},
		{
			icon: User,
			label: "Profile",
			path: "/teacher/profile",
			active: location.pathname.startsWith("/teacher/profile")
		}
	];

	return (
		<div className="h-screen bg-gray-50 flex">
			{/* Left Sidebar Navigation */}
			<aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
				{/* School Header */}
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
							<span className="text-white font-semibold text-sm">LM</span>
						</div>
						<div>
							<h1 className="font-semibold text-gray-900">Lakeridge Mountain</h1>
							<p className="text-sm text-gray-600">High School</p>
						</div>
					</div>
				</div>

				{/* Navigation Items */}
				<nav className="flex-1 p-4">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.path}>
								<button
									onClick={() => navigate(item.path)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
										item.active 
											? "bg-orange-50 text-orange-600 border-l-4 border-orange-500" 
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<item.icon className={`w-5 h-5 ${item.active ? "text-orange-600" : "text-gray-500"}`} />
									<span className="font-medium">{item.label}</span>
								</button>
							</li>
						))}
					</ul>
				</nav>

				{/* Bottom Actions */}
				<div className="p-4 border-t border-gray-200 space-y-2">
					<button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors">
						<RefreshCw className="w-5 h-5 text-gray-500" />
						<span className="font-medium">Switch account</span>
					</button>
					<button 
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
					>
						<LogOut className="w-5 h-5 text-gray-500" />
						<span className="font-medium">Logout</span>
					</button>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col">
				{/* Top Header */}
				<header className="bg-white shadow-sm border-b border-gray-200">
					<div className="px-6 py-4 flex items-center justify-end">
						<div className="flex items-center gap-4">
							<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
								<Settings className="w-5 h-5" />
							</button>
							<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
								<Bell className="w-5 h-5" />
							</button>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
									<span className="text-white font-semibold text-sm">
										{user?.fullName?.charAt(0) || 'T'}
									</span>
								</div>
								<div>
									<p className="font-medium text-gray-900">{user?.fullName || 'Joe Jameshill'}</p>
									<p className="text-sm text-gray-500">Teacher</p>
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 overflow-auto p-6">
					{children || <Outlet />}
				</main>
			</div>
		</div>
	);
}