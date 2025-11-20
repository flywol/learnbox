// src/common/security/DeviceRestrictedPage.tsx
import React from "react";

interface DeviceRestrictedPageProps {
	role?: "teacher" | "admin";
}

export const DeviceRestrictedPage: React.FC<DeviceRestrictedPageProps> = ({
	role,
}) => {
	const getRoleText = () => {
		if (role === "teacher") return "Teacher";
		if (role === "admin") return "Admin";
		return "LearnBox";
	};

	const roleText = getRoleText();

	return (
		<div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
			<div className="max-w-md w-full text-center">
				{/* Icon - Desktop/Tablet Illustration */}
				<div className="mx-auto mb-8">
					<svg
						className="w-40 h-40 mx-auto"
						viewBox="0 0 200 200"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						{/* Desktop Monitor */}
						<rect x="30" y="40" width="140" height="90" rx="8" fill="#FED7AA" stroke="#F97316" strokeWidth="4"/>
						<rect x="40" y="50" width="120" height="70" fill="#FFFFFF"/>
						<line x1="80" y1="130" x2="120" y2="130" stroke="#F97316" strokeWidth="4" strokeLinecap="round"/>
						<rect x="70" y="130" width="60" height="8" fill="#F97316"/>

						{/* Tablet */}
						<rect x="120" y="70" width="60" height="80" rx="6" fill="#FFF7ED" stroke="#F97316" strokeWidth="3"/>
						<rect x="127" y="77" width="46" height="60" fill="#FFFFFF"/>
						<circle cx="150" cy="143" r="3" fill="#F97316"/>
					</svg>
				</div>

				{/* Main Message */}
				<h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
					Tablet or Desktop Required
				</h1>

				<p className="text-xl text-gray-700 mb-8 leading-relaxed">
					The {roleText} portal requires a tablet or larger screen. Please
					access the platform from a tablet, desktop, or laptop computer for the
					best experience.
				</p>

				{/* Device Info */}
				<div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
					<h3 className="text-lg font-bold text-orange-900 mb-4">
						Supported Devices:
					</h3>
					<ul className="text-base text-orange-800 space-y-2 font-medium">
						<li>✅ Tablets (iPad, Android tablets)</li>
						<li>✅ Desktop computers</li>
						<li>✅ Laptop computers</li>
						<li>❌ Mobile phones</li>
					</ul>
				</div>

				{/* Additional Info */}
				<div className="text-base text-gray-600 bg-gray-50 rounded-lg p-6">
					<p className="mb-3 font-semibold text-gray-900">
						Why tablet or larger?
					</p>
					<p className="leading-relaxed">
						{roleText} portal provides comprehensive features that require a
						larger screen and full functionality for optimal user experience and
						productivity.
					</p>
				</div>

				{/* Footer */}
				<div className="mt-10 pt-6 border-t-2 border-gray-200">
					<p className="text-sm text-gray-500 font-medium">
						If you believe this is an error, please contact support.
					</p>
				</div>
			</div>
		</div>
	);
};
