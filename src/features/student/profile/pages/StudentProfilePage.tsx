import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { studentProfileApiClient } from "../api/profileApiClient";
import { useAuthStore } from "@/features/auth/store/authStore";

// Mock data for fields not available from API
const mockPersonalInfo = {
	favoriteFood: "Plantain & egg",
	favoriteSubject: "English",
	favoriteColor: "Blue",
	favoriteTeacher: "Mr Joe",
};

const mockAchievements = {
	score: 2,
	totalBadges: 10,
	unlockedBadges: 2,
};

const mockSettings = {
	receiveNotifications: true,
	textSize: "medium",
	theme: "Default-Light",
};

export default function StudentProfilePage() {
	const { logout } = useAuthStore();
	const [showAchievements, setShowAchievements] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);
	const [showEditPersonalInfo, setShowEditPersonalInfo] = useState(false);
	const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
	const [personalInfoForm, setPersonalInfoForm] = useState(mockPersonalInfo);

	// Fetch student profile
	const { data, isLoading } = useQuery({
		queryKey: ["student-profile"],
		queryFn: () => studentProfileApiClient.getProfile(),
	});

	const student = data?.data?.student;

	const handleLogout = () => {
		logout();
	};

	const handleUpdatePersonalInfo = () => {
		// Mock update - in real app would call API
		setShowEditPersonalInfo(false);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd5d26]"></div>
			</div>
		);
	}

	if (showAchievements) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<div className="flex items-center gap-4 mb-6">
					<button onClick={() => setShowAchievements(false)} className="p-2 hover:bg-gray-100 rounded-lg">
						<ChevronLeft className="w-5 h-5" />
					</button>
					<h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
				</div>

				{/* Score Card */}
				<div className="border border-gray-200 rounded-xl p-6 mb-6 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="text-6xl">🏅</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Score</p>
							<p className="text-5xl font-bold text-gray-900 mb-2">{mockAchievements.score}</p>
							<p className="text-sm text-gray-600">Reward points</p>
						</div>
					</div>
					<img src="/images/achievement-illustration.svg" alt="Achievement" className="w-48 h-48" />
				</div>

				{/* Congratulations */}
				<div className="flex items-center gap-4 mb-6">
					<img src="/images/high-five-illustration.svg" alt="High five" className="w-24 h-24" />
					<div>
						<h3 className="text-xl font-semibold text-gray-900">Congratulations!</h3>
						<p className="text-gray-600">You have unlocked the beginner's badge</p>
					</div>
				</div>

				{/* Badges Grid */}
				<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
					{Array.from({ length: mockAchievements.totalBadges }).map((_, i) => (
						<div key={i} className={`text-4xl md:text-5xl lg:text-6xl ${i >= mockAchievements.unlockedBadges ? "opacity-30" : ""}`}>
							🏅
						</div>
					))}
				</div>
			</div>
		);
	}

	if (showEditPersonalInfo) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<div className="flex items-center gap-4 mb-6">
					<button onClick={() => setShowEditPersonalInfo(false)} className="p-2 hover:bg-gray-100 rounded-lg">
						<ChevronLeft className="w-5 h-5" />
					</button>
					<h2 className="text-xl font-semibold text-gray-900">Edit Personal Information</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<div>
						<label className="block text-sm text-gray-600 mb-2">Favourite food</label>
						<input
							type="text"
							value={personalInfoForm.favoriteFood}
							onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, favoriteFood: e.target.value })}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fd5d26]"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600 mb-2">Favourite subject</label>
						<input
							type="text"
							value={personalInfoForm.favoriteSubject}
							onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, favoriteSubject: e.target.value })}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fd5d26]"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600 mb-2">Favourite colour</label>
						<input
							type="text"
							value={personalInfoForm.favoriteColor}
							onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, favoriteColor: e.target.value })}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fd5d26]"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600 mb-2">Favourite teacher</label>
						<input
							type="text"
							value={personalInfoForm.favoriteTeacher}
							onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, favoriteTeacher: e.target.value })}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fd5d26]"
						/>
					</div>
				</div>

				<button
					onClick={handleUpdatePersonalInfo}
					className="px-8 py-3 bg-[#fd5d26] text-white rounded-lg hover:bg-[#e84d17] transition-colors"
				>
					Update Profile
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with School Motto */}
			<div className="bg-[#fd5d26] text-white rounded-t-2xl p-6 text-center">
				<p className="text-lg">School Motto: You shine when you work hard</p>
			</div>

			{/* Profile Header */}
			<div className="bg-white -mt-6 rounded-2xl shadow-sm p-6">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<img
							src={student?.profilePicture || "/images/default-avatar.jpg"}
							alt={student?.fullName}
							className="w-20 h-20 rounded-full object-cover"
						/>
						<h2 className="text-2xl font-semibold text-gray-900">{student?.fullName || "Jane Doe"}</h2>
					</div>
					<button
						onClick={() => setShowSwitchAccountModal(true)}
						className="px-4 py-2 bg-[#fff8f5] text-[#fd5d26] rounded-lg hover:bg-[#ffefe9] transition-colors text-sm"
					>
						Switch account
					</button>
				</div>

				{/* Academic Details */}
				<div className="mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Details</h3>
					<div className="bg-gray-50 rounded-xl p-4 md:p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
							<div>
								<p className="text-sm text-gray-600 mb-1">Name</p>
								<p className="font-medium text-gray-900 break-words">{student?.fullName || "Jane Doe"}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Email</p>
								<p className="font-medium text-gray-900 break-all">{student?.email || "janejoe@gmail.com"}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Date of Birth</p>
								<p className="font-medium text-gray-900">
									{student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-GB") : "21/07/2007"}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
							<div>
								<p className="text-sm text-gray-600 mb-1">Class/Section</p>
								<p className="font-medium text-gray-900">
									{student ? `${student.classLevel}/${student.classArmName}` : "JSS3/A"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Session</p>
								<p className="font-medium text-gray-900">2023/2024</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Term</p>
								<p className="font-medium text-gray-900">1st</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
							<div>
								<p className="text-sm text-gray-600 mb-1">School ID</p>
								<p className="font-medium text-gray-900">{student?.admissionNumber || "100004"}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Gender</p>
								<p className="font-medium text-gray-900">{student?.gender || "Female"}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Personal Information */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
						<button
							onClick={() => setShowEditPersonalInfo(true)}
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							Edit
						</button>
					</div>
					<div className="bg-gray-50 rounded-xl p-4 md:p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
							<div>
								<p className="text-sm text-gray-600 mb-1">Favorite Food</p>
								<p className="font-medium text-gray-900">{mockPersonalInfo.favoriteFood}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Favorite Subject</p>
								<p className="font-medium text-gray-900">{mockPersonalInfo.favoriteSubject}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Favorite Color</p>
								<p className="font-medium text-gray-900">{mockPersonalInfo.favoriteColor}</p>
							</div>
						</div>
						<div>
							<p className="text-sm text-gray-600 mb-1">Favorite Teacher</p>
							<p className="font-medium text-gray-900">{mockPersonalInfo.favoriteTeacher}</p>
						</div>
					</div>
				</div>

				{/* Achievements */}
				<div className="mb-8">
					<button
						onClick={() => setShowAchievements(true)}
						className="w-full flex items-center justify-between mb-4 group"
					>
						<h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
						<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
					</button>
					<div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="text-6xl">🏅</div>
							<div>
								<p className="text-5xl font-bold text-gray-900">{mockAchievements.score}</p>
								<p className="text-sm text-gray-600 mt-2">
									You unlocked {mockAchievements.unlockedBadges} badges out of {mockAchievements.totalBadges}
								</p>
							</div>
						</div>
						<img src="/images/achievement-illustration.svg" alt="Achievement" className="w-32 h-32" />
					</div>
				</div>

				{/* Settings */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
					<div className="bg-gray-50 rounded-xl p-6 space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-gray-900">Receive Notifications</p>
							<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#fd5d26]">
								<span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
							</button>
						</div>
						<button
							onClick={() => setShowAccessibilitySettings(!showAccessibilitySettings)}
							className="w-full flex items-center justify-between py-2"
						>
							<p className="text-gray-900">Accessibility Features</p>
							<ChevronRight
								className={`w-5 h-5 text-gray-400 transition-transform ${showAccessibilitySettings ? "rotate-90" : ""}`}
							/>
						</button>
						{showAccessibilitySettings && (
							<div className="pl-4 space-y-4">
								<div className="flex items-center justify-between">
									<p className="text-gray-700">Text Size</p>
									<div className="flex items-center gap-2">
										<button className="text-sm">A</button>
										<button className="text-base font-semibold text-orange-500 border-b-2 border-[#fd5d26]">
											A
										</button>
										<button className="text-lg">A</button>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-gray-700">Theme</p>
									<p className="text-gray-900">{mockSettings.theme}</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Logout Button */}
				<button
					onClick={() => setShowLogoutModal(true)}
					className="mt-6 px-6 py-3 border border-[#fd5d26] text-orange-500 rounded-lg hover:bg-[#fff8f5] transition-colors flex items-center gap-2"
				>
					Logout
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>

			{/* Logout Modal */}
			{showLogoutModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Logging out?</h3>
						<p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowLogoutModal(false)}
								className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleLogout}
								className="flex-1 px-6 py-3 bg-[#fd5d26] text-white rounded-lg hover:bg-[#e84d17] transition-colors"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Switch Account Modal */}
			{showSwitchAccountModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Switch account?</h3>
						<p className="text-gray-600 mb-6">Are you sure you want to switch account?</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowSwitchAccountModal(false)}
								className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleLogout}
								className="flex-1 px-6 py-3 bg-[#fd5d26] text-white rounded-lg hover:bg-[#e84d17] transition-colors"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
