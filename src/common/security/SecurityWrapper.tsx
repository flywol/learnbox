// src/common/security/SecurityWrapper.tsx
import React, { useEffect, useState } from "react";
import { DeviceRestrictedPage } from "./DeviceRestrictedPage";

interface SecurityWrapperProps {
	children: React.ReactNode;
}

export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({
	children,
}) => {
	const [isDeviceAllowed, setIsDeviceAllowed] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkDevice = () => {
			// Check if it's a mobile device
			const isMobile =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				);

			// Check if it's a tablet (iPad or Android tablet)
			const isTablet =
				/iPad|Android(?=.*Mobile)/i.test(navigator.userAgent) ||
				(navigator.userAgent.includes("Android") &&
					!navigator.userAgent.includes("Mobile"));

			// Check screen size as additional validation
			const isSmallScreen = window.innerWidth < 1024; // Less than desktop size

			// Check if running in a mobile browser or webview
			const isWebView =
				/wv|WebView|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
					navigator.userAgent
				);

			// Allow only if it's NOT mobile, NOT tablet, and NOT in a webview
			const deviceAllowed =
				!isMobile && !isTablet && !isWebView && !isSmallScreen;

			console.log("🔒 Device Check:", {
				userAgent: navigator.userAgent,
				isMobile,
				isTablet,
				isWebView,
				isSmallScreen,
				screenWidth: window.innerWidth,
				deviceAllowed,
			});

			setIsDeviceAllowed(deviceAllowed);
			setIsLoading(false);
		};

		// Initial check
		checkDevice();

		// Listen for window resize to catch screen size changes
		const handleResize = () => {
			checkDevice();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Show loading state while checking device
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Checking device compatibility...</p>
				</div>
			</div>
		);
	}

	// Show restricted page if device is not allowed
	if (!isDeviceAllowed) {
		return <DeviceRestrictedPage />;
	}

	// Render children if device is allowed
	return <>{children}</>;
};
