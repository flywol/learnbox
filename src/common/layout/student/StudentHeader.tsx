import { Settings } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "@/features/student/notifications/components/NotificationDropdown";
import { useSchoolInfo } from "@/common/hooks/useSchoolInfo";

interface StudentHeaderProps {
	onMenuToggle?: () => void;
}

export default function StudentHeader({ onMenuToggle }: StudentHeaderProps) {
	const user = useAuthStore((state) => state.user);
	const navigate = useNavigate();
	const { schoolName, schoolLogo, schoolInitial } = useSchoolInfo();

	// Get initials from user's name
	const getUserInitials = () => {
		if (!user?.fullName) return "S";
		const names = user.fullName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return user.fullName[0].toUpperCase();
	};

	const handleNotificationPageClick = () => {
		navigate('/student/notifications');
	};

	return (
		<header className="bg-white border-b border-gray-200 px-3 md:px-6 lg:px-8 py-3 md:py-4">
			<div className="flex items-center justify-between gap-2">
				{/* Left side - School Branding */}
				<div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
					{/* Mobile Menu Toggle */}
					<button
						onClick={onMenuToggle}
						className="md:hidden p-1.5 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					</button>

					<div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-900 flex-shrink-0">
						{schoolLogo ? (
							<img src={`data:image/png;base64,${schoolLogo}`} alt="School Logo" className="w-full h-full object-cover" />
						) : (
							<span className="text-white font-semibold text-xs md:text-sm">
								{schoolInitial}
							</span>
						)}
					</div>
					<div className="min-w-0">
						<h2 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 truncate">
							{schoolName || "Loading…"}
						</h2>
					</div>
				</div>

				{/* Right side - User Controls */}
				<div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
					{/* Settings - Hidden on mobile */}
					<button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
						<Settings className="w-5 h-5 text-gray-600" />
					</button>
					<NotificationDropdown onNotificationPageClick={handleNotificationPageClick} />
					{/* User profile - Hidden on mobile */}
					<div className="hidden md:flex items-center gap-3 ml-4">
						<div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
							<span className="text-white font-semibold text-sm">
								{getUserInitials()}
							</span>
						</div>
						<div className="text-right">
							<p className="text-sm font-medium text-gray-900">
								{user?.fullName || "Jane Doe"}
							</p>
							<p className="text-xs text-gray-500">Student</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
