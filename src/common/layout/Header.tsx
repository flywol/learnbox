import { Settings, Menu } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import NotificationDropdown from "@/features/admin/notifications/components/NotificationDropdown";
import { useNavigate } from "react-router-dom";
import SchoolBranding from "./SchoolBranding";

interface HeaderProps {
	onMenuToggle?: () => void;
	showMenuButton: boolean;
}

export default function Header({ onMenuToggle, showMenuButton }: HeaderProps) {
	const user = useAuthStore((state) => state.user);
	const navigate = useNavigate();

	const handleNotificationPageClick = () => {
		navigate('/notifications');
	};

	return (
		<header className="bg-white border-b border-gray-200 px-8 py-4">
			<div className="flex items-center justify-between">
				{/* Left side - Hamburger + School Branding */}
				<div className="flex items-center gap-3">
					{showMenuButton && onMenuToggle && (
						<button
							onClick={onMenuToggle}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							aria-label="Toggle menu">
							<Menu className="w-5 h-5 text-gray-600" />
						</button>
					)}
					<SchoolBranding />
				</div>

				{/* Right side - User Controls */}
				<div className="flex items-center gap-4">
					<button className="p-2 hover:bg-gray-100 rounded-lg">
						<Settings className="w-5 h-5 text-gray-600" />
					</button>
					<NotificationDropdown onNotificationPageClick={handleNotificationPageClick} />
					<div className="flex items-center gap-3 ml-4">
						<div className="text-right">
							<p className="text-sm font-medium text-gray-900">
								{user?.fullName}
							</p>
							<p className="text-xs text-gray-500 capitalize">
								{user?.role?.toLowerCase()}
							</p>
						</div>
						<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
							<span className="text-orange-600 font-semibold">
								{user?.fullName?.charAt(0).toUpperCase()}
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
