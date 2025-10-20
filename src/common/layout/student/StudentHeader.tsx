import { Settings } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "@/features/student/notifications/components/NotificationDropdown";

// Mock school data for student - NO API CALLS
const mockSchoolInfo = {
	schoolName: "Lakeridge Mountain High School",
	schoolInitial: "LM",
};

export default function StudentHeader() {
	const { user } = useAuthStore();
	const navigate = useNavigate();

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
		<header className="bg-white border-b border-gray-200 px-8 py-4">
			<div className="flex items-center justify-between">
				{/* Left side - School Branding */}
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-900">
						<span className="text-white font-semibold text-sm">
							{mockSchoolInfo.schoolInitial}
						</span>
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							{mockSchoolInfo.schoolName}
						</h2>
					</div>
				</div>

				{/* Right side - User Controls */}
				<div className="flex items-center gap-4">
					<button className="p-2 hover:bg-gray-100 rounded-lg">
						<Settings className="w-5 h-5 text-gray-600" />
					</button>
					<NotificationDropdown onNotificationPageClick={handleNotificationPageClick} />
					<div className="flex items-center gap-3 ml-4">
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
