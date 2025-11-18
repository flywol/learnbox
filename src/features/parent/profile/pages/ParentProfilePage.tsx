import { useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { useParentContext } from "../../context/ParentContext";

export default function ParentProfilePage() {
	const { profile, children } = useParentContext();
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showSwitchModal, setShowSwitchModal] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	return (
		<div>
			{/* Header Banner */}
			<div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 mb-6 text-white">
				<div className="flex items-center gap-4">
					{profile?.profilePicture ? (
						<img
							src={profile.profilePicture}
							alt={profile.fullName}
							className="w-20 h-20 rounded-full object-cover bg-white"
						/>
					) : (
						<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
							<span className="text-4xl">👤</span>
						</div>
					)}
					<div className="flex-1">
						<h1 className="text-2xl font-bold">{profile?.fullName || "Loading..."}</h1>
						<button
							onClick={() => setShowSwitchModal(true)}
							className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
							Switch account
						</button>
					</div>
				</div>
			</div>

			{/* Personal Information */}
			<div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900">
						Personal Information
					</h2>
					<button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
						Edit
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-xs text-gray-600 mb-1">Name</label>
						<p className="text-sm font-medium text-gray-900">{profile?.fullName || "N/A"}</p>
					</div>
					<div>
						<label className="block text-xs text-gray-600 mb-1">Email</label>
						<p className="text-sm font-medium text-gray-900">
							{profile?.email || "N/A"}
						</p>
					</div>
					<div>
						<label className="block text-xs text-gray-600 mb-1">Phone</label>
						<p className="text-sm font-medium text-gray-900">{profile?.phoneNumber || "N/A"}</p>
					</div>
					{children.map((child, index) => (
						<div key={child._id}>
							<label className="block text-xs text-gray-600 mb-1">Child {index + 1}</label>
							<p className="text-sm font-medium text-gray-900">{child.fullName}</p>
						</div>
					))}
				</div>
			</div>

			{/* Settings */}
			<div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

				{/* Receive Notifications */}
				<div className="flex items-center justify-between py-3 border-b border-gray-200">
					<span className="text-sm font-medium text-gray-900">
						Receive Notifications
					</span>
					<button
						onClick={() => setNotificationsEnabled(!notificationsEnabled)}
						className={`relative w-12 h-6 rounded-full transition-colors ${
							notificationsEnabled ? "bg-orange-500" : "bg-gray-300"
						}`}>
						<span
							className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
								notificationsEnabled ? "right-0.5" : "left-0.5"
							}`}
						/>
					</button>
				</div>

				{/* Accessibility Features */}
				<div className="flex items-center justify-between py-3">
					<span className="text-sm font-medium text-gray-900">
						Accessibility Features
					</span>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Text Size</span>
							<button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
								A
							</button>
							<button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-base font-medium">
								A
							</button>
							<button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-lg font-bold">
								A
							</button>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Theme</span>
							<button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
								Default Light
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-4">
				<button
					onClick={() => setShowSwitchModal(true)}
					className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
					<RefreshCw className="w-5 h-5" />
					Switch account
				</button>
				<button
					onClick={() => setShowLogoutModal(true)}
					className="px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-2">
					<LogOut className="w-5 h-5" />
					Logout
				</button>
			</div>

			{/* Logout Modal */}
			{showLogoutModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							Logging out?
						</h3>
						<p className="text-sm text-gray-600 mb-6">
							Are you sure you want to logout?
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowLogoutModal(false)}
								className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Switch Account Modal */}
			{showSwitchModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							Switch account?
						</h3>
						<p className="text-sm text-gray-600 mb-6">
							Are you sure you want to switch account?
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowSwitchModal(false)}
								className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
