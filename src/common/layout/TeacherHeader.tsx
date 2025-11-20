import { Settings, Bell, Menu } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

// Mock school data for teacher - NO API CALLS
const mockSchoolInfo = {
	schoolName: "Lakeridge Mountain High School",
	schoolInitial: "LM"
};

interface TeacherHeaderProps {
	onMenuToggle?: () => void;
	showMenuButton: boolean;
}

export default function TeacherHeader({ onMenuToggle, showMenuButton }: TeacherHeaderProps) {
	const { user } = useAuthStore();

	return (
		<header className="bg-white border-b border-gray-200 px-8 py-4">
			<div className="flex items-center justify-between">
				{/* Left side - Hamburger + Mock School Branding for Teacher */}
				<div className="flex items-center gap-3">
					{showMenuButton && onMenuToggle && (
						<button
							onClick={onMenuToggle}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							aria-label="Toggle menu">
							<Menu className="w-5 h-5 text-gray-600" />
						</button>
					)}
					<div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-orange-100">
						<span className="text-orange-600 font-semibold text-lg">
							{mockSchoolInfo.schoolInitial}
						</span>
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							{mockSchoolInfo.schoolName}
						</h2>
					</div>
				</div>

				{/* Right side - User Controls */}
				<div className="flex items-center gap-4">
					<button className="p-2 hover:bg-gray-100 rounded-lg">
						<Settings className="w-5 h-5 text-gray-600" />
					</button>
					<button className="p-2 hover:bg-gray-100 rounded-lg">
						<Bell className="w-5 h-5 text-gray-600" />
					</button>
					<div className="flex items-center gap-3 ml-4">
						<div className="text-right">
							<p className="text-sm font-medium text-gray-900">
								{user?.fullName || 'Joe Jameshill'}
							</p>
							<p className="text-xs text-gray-500">
								Teacher
							</p>
						</div>
						<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
							<span className="text-orange-600 font-semibold">
								{(user?.fullName?.charAt(0) || 'T').toUpperCase()}
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}