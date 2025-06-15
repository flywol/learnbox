
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface AuthPageWrapperProps {
	children: ReactNode;
}

// Illustration component that stays static during transition
export const AuthIllustration = () => (
	<div className="hidden lg:flex lg:w-1/2 bg-[#FFEFE980] items-center justify-center p-8">
		<div className="w-full max-w-md">
			<img
				className="w-[710px] h-[560px] object-contain"
				src="/images/illustration.svg"
				alt="illustration"
			/>
		</div>
	</div>
);

/**
 * AuthPageWrapper - Provides consistent layout and transitions for auth pages
 *
 * Features:
 * - Static illustration on the left
 * - Animated content transitions on the right
 * - Smooth page transitions using framer-motion
 */
export const AuthPageWrapper = ({ children }: AuthPageWrapperProps) => {
	const location = useLocation();

	return (
		<div className="flex min-h-screen bg-white">
			<AuthIllustration />
			<div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-8 relative overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.div
						key={location.pathname}
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -20, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="w-full max-w-sm">
						{children}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
