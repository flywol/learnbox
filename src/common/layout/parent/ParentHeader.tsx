import { useState } from "react";
import { Settings, Bell, ChevronDown, Users } from "lucide-react";
import { useParentContext } from "@/features/parent/context/ParentContext";
import { useQuery } from "@tanstack/react-query";
import { parentApiClient } from "@/features/parent/api/parentApiClient";
import { parentQueryConfig, parentQueryKeys } from "@/features/parent/config/queryConfig";
import { useNavigate } from "react-router-dom";

export default function ParentHeader() {
	const { profile, children, selectedChild, selectChild } = useParentContext();
	const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
	const navigate = useNavigate();

	// Fetch notifications with exponential backoff retry
	const { data: notificationsData } = useQuery({
		queryKey: parentQueryKeys.notifications(),
		queryFn: async () => {
			const response = await parentApiClient.getNotifications();
			return response.data;
		},
		...parentQueryConfig.notifications,
		// Silently fail - don't show error for notifications
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const unreadCount = notificationsData?.notifications?.filter((n) => !n.isRead).length || 0;

	const handleChildSelect = (child: typeof selectedChild) => {
		if (child) {
			selectChild(child);
			setIsChildDropdownOpen(false);
		}
	};

	const handleNotificationClick = () => {
		navigate("/parent/notifications");
	};

	const handleSettingsClick = () => {
		navigate("/parent/profile");
	};

	return (
		<header className="bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				{/* School Info */}
				<div className="flex items-center gap-3">
					{profile?.school?.schoolLogo ? (
						<img
							src={profile.school.schoolLogo}
							alt={profile.school.schoolName}
							className="w-10 h-10 rounded-full object-cover"
						/>
					) : (
						<div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
							{profile?.school?.schoolShortName?.[0] || "L"}
						</div>
					)}
					<div>
						<h2 className="text-sm font-semibold text-gray-900">
							{profile?.school?.schoolName || "School Name"}
						</h2>
						<p className="text-xs text-gray-600">
							{profile?.school?.schoolShortName || "School"}
						</p>
					</div>
				</div>

				{/* Right Section */}
				<div className="flex items-center gap-4">
					{/* Settings */}
					<button
						onClick={handleSettingsClick}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Settings className="w-5 h-5 text-gray-600" />
					</button>

					{/* Notifications */}
					<button
						onClick={handleNotificationClick}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
						<Bell className="w-5 h-5 text-gray-600" />
						{unreadCount > 0 && (
							<span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
						)}
					</button>

					{/* Child Selector Dropdown */}
					<div className="relative">
						<button
							onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
							className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
							<Users className="w-5 h-5 text-gray-600" />
							<span className="text-sm font-medium text-gray-700">
								{selectedChild
									? selectedChild.fullName
									: children.length > 0
									? "Select child"
									: "No children"}
							</span>
							{children.length > 1 && <ChevronDown className="w-4 h-4 text-gray-600" />}
						</button>

						{/* Dropdown Menu */}
						{isChildDropdownOpen && children.length > 0 && (
							<>
								{/* Backdrop */}
								<div
									className="fixed inset-0 z-10"
									onClick={() => setIsChildDropdownOpen(false)}
								/>
								{/* Dropdown */}
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
									{children.map((child) => (
										<button
											key={child._id}
											onClick={() => handleChildSelect(child)}
											className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
												selectedChild?._id === child._id ? "bg-orange-50" : ""
											}`}>
											<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
												{child.profilePicture ? (
													<img
														src={child.profilePicture}
														alt={child.fullName}
														className="w-full h-full rounded-full object-cover"
													/>
												) : (
													"👤"
												)}
											</div>
											<div className="text-left">
												<p className="text-sm font-medium text-gray-900">
													{child.fullName}
												</p>
												<p className="text-xs text-gray-600">
													{child.classLevel} {child.classArmName}
												</p>
											</div>
										</button>
									))}
								</div>
							</>
						)}
					</div>

					{/* Parent Profile */}
					<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
						{profile?.profilePicture ? (
							<img
								src={profile.profilePicture}
								alt={profile.fullName}
								className="w-10 h-10 rounded-full object-cover"
							/>
						) : (
							<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
								{profile?.fullName?.[0] || "P"}
							</div>
						)}
						<div className="text-right">
							<p className="text-sm font-semibold text-gray-900">
								{profile?.fullName || "Parent"}
							</p>
							<p className="text-xs text-gray-600">Parent</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
