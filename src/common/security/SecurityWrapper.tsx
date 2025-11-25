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
            // Use matchMedia for reliable screen size detection
            // 1024px is the standard breakpoint for desktop/large tablets
            const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
            
            // Also check for coarse pointer (touch) to detect tablets/mobiles even with large screens
            // But we primarily care about screen real estate for the admin dashboard
            
			setIsDeviceAllowed(isDesktop);
			setIsLoading(false);
		};

		// Initial check
		checkDevice();

		// Listen for resize events using matchMedia listener for better performance than window.onresize
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDeviceAllowed(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

		return () => {
            mediaQuery.removeEventListener("change", handleChange);
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
