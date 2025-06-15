// src/features/auth/components/ui/AuthLayout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	showLogo?: boolean;
	illustration?:
		| "default"
		| "admin"
		| "teacher"
		| "student"
		| "parent"
		| ReactNode;
	className?: string;
}

/**
 * AuthLayout - Consistent layout wrapper for auth pages
 *
 * Features:
 * - Split screen with illustration (desktop)
 * - Centered content (mobile)
 * - Consistent styling across auth pages
 * - Customizable illustration
 */
export const AuthLayout = ({
	children,
	title,
	subtitle,
	showLogo = true,
	illustration = "default",
	className = "",
}: AuthLayoutProps) => {
	// Render illustration based on type
	const renderIllustration = () => {
		if (typeof illustration === "string") {
			const illustrationMap: Record<string, string> = {
				default: "/images/illustration.svg",
				admin: "/images/onboarding/admin-role.svg",
				teacher: "/images/onboarding/teacher-role.svg",
				student: "/images/onboarding/student-role.svg",
				parent: "/images/onboarding/parent-role.svg",
			};

			return (
				<img
					src={illustrationMap[illustration] || illustrationMap.default}
					alt="Authentication illustration"
					className="w-full max-w-md h-auto object-contain"
					onError={(e) => {
						// Fallback for missing images
						(e.target as HTMLImageElement).src =
							"data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' dy='.3em' fill='%236b7280'%3E[Illustration]%3C/text%3E%3C/svg%3E";
					}}
				/>
			);
		}

		return illustration;
	};

	return (
		<div className="flex min-h-screen bg-white">
			{/* Illustration Side - Hidden on mobile */}
			<div className="hidden lg:flex lg:w-1/2 bg-[#FFEFE980] items-center justify-center p-8">
				<div className="w-full max-w-lg flex items-center justify-center">
					{renderIllustration()}
				</div>
			</div>

			{/* Content Side */}
			<div
				className={`flex flex-1 flex-col justify-center items-center p-6 sm:p-8 ${className}`}>
				<div className="w-full max-w-md space-y-6">
					{/* Logo */}
					{showLogo && (
						<div className="text-center mb-8">
							<h1 className="text-4xl font-bold">
								Learn<span className="text-orange-500">Box</span>
							</h1>
						</div>
					)}

					{/* Header */}
					{(title || subtitle) && (
						<div className="text-center space-y-2">
							{title && (
								<h2 className="text-3xl font-bold tracking-tight text-gray-900">
									{title}
								</h2>
							)}
							{subtitle && <p className="text-muted-foreground">{subtitle}</p>}
						</div>
					)}

					{/* Main Content */}
					{children}
				</div>
			</div>
		</div>
	);
};

/**
 * AuthCard - Card wrapper for auth forms
 * Use within AuthLayout for consistent card styling
 */
export const AuthCard = ({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={`bg-white rounded-xl shadow-sm border p-8 space-y-6 ${className}`}>
			{children}
		</div>
	);
};

/**
 * AuthFormGroup - Consistent form group styling
 */
export const AuthFormGroup = ({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) => {
	return <div className={`space-y-4 ${className}`}>{children}</div>;
};

/**
 * AuthError - Consistent error message styling
 */
export const AuthError = ({
	message,
	className = "",
}: {
	message: string;
	className?: string;
}) => {
	return (
		<div
			className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm ${className}`}>
			{message}
		</div>
	);
};

/**
 * AuthSuccess - Consistent success message styling
 */
export const AuthSuccess = ({
	message,
	className = "",
}: {
	message: string;
	className?: string;
}) => {
	return (
		<div
			className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm ${className}`}>
			{message}
		</div>
	);
};
