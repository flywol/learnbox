// src/common/security/DeviceRestrictedPage.tsx
import React from "react";

export const DeviceRestrictedPage: React.FC = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="max-w-md w-full text-center">
				{/* Icon */}
				<div className="mx-auto mb-6 w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
					<svg
						className="w-12 h-12 text-orange-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>

				{/* Main Message */}
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Desktop Access Required
				</h1>

				<p className="text-lg text-gray-600 mb-6">
					LearnBox is designed for desktop use only. Please access the platform
					from a desktop or laptop computer for the best experience.
				</p>

				{/* Device Info */}
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
					<h3 className="font-semibold text-orange-800 mb-2">
						Supported Devices:
					</h3>
					<ul className="text-sm text-orange-700 space-y-1">
						<li>✅ Desktop computers</li>
						<li>✅ Laptop computers</li>
						<li>❌ Mobile phones</li>
						<li>❌ Tablets</li>
						<li>❌ Mobile browsers</li>
					</ul>
				</div>

				{/* Additional Info */}
				<div className="text-sm text-gray-500">
					<p className="mb-2">
						<strong>Why desktop only?</strong>
					</p>
					<p>
						LearnBox provides comprehensive school management features that
						require a larger screen and full keyboard input for optimal
						functionality and user experience.
					</p>
				</div>

				{/* Footer */}
				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-xs text-gray-400">
						If you believe this is an error, please contact support.
					</p>
				</div>
			</div>
		</div>
	);
};
