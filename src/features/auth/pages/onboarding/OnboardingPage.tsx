import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";


// Progress dots component
const ProgressDots = ({
	total,
	current,
}: {
	total: number;
	current: number;
}) => (
	<div className="flex space-x-2 justify-center">
		{Array.from({ length: total }, (_, index) => (
			<div
				key={index}
				className={`w-3 h-3 rounded-full transition-colors ${
					index === current
						? "bg-orange-500"
						: index < current
						? "bg-orange-300"
						: "bg-gray-300"
				}`}
			/>
		))}
	</div>
);

// Onboarding content for each role
const onboardingContent = {
	ADMIN: [
		{
			title: "Welcome to AdminPro!",
			description:
				"You're about to gain control over your educational platform. Let's begin the setup process.",
			illustration: "/images/onboarding/admin-1.svg",
		},
		{
			title: "Create Your Admin Account",
			description:
				"Let's start by gathering some necessary details to set up your admin account.",
			illustration: "/images/onboarding/admin-1.svg",
		},
		{
			title: "Your Admin Dashboard",
			description:
				"Explore your powerful admin tools to manage courses, users, and more. Get started now!",
			illustration: "/images/onboarding/admin-1.svg",
		},
	],
	TEACHER: [
		{
			title: "Welcome to LearnBox Teach!",
			description:
				"Join a community of educators dedicated to inspiring and educating students. Let's get started!",
			illustration: "/images/onboarding/teacher-1.svg",
		},
		{
			title: "Connect with Your Students",
			description:
				"Engage with your students through virtual classrooms. Teach, share, and inspire.",
			illustration: "/images/onboarding/teacher-2.svg",
		},
		{
			title: "Manage Your Courses",
			description:
				"You're in charge of your classroom. Organize your courses and educational materials.",
			illustration: "/images/onboarding/teacher-2.svg",
		},
	],
	STUDENT: [
		{
			title: "Welcome to LearnBox!",
			description:
				"Dive into the world of interactive learning tailored for young minds.",
			illustration: "/images/onboarding/student-1.svg",
		},
		{
			title: "Your Digital Classroom",
			description:
				"Discover a world of learning with interactive courses, engaging study materials, and seamless communication with your teachers.",
			illustration: "/images/onboarding/student-2.svg",
		},
		{
			title: "Connect & Grow",
			description:
				"Collaborate with peers, ask teachers questions, and stay updated on assignments and announcements.",
			illustration: "/images/onboarding/student-3.svg",
		},
	],
	PARENT: [
		{
			title: "Welcome to ParentConnect!",
			description:
				"Stay connected with your child's educational progress and school activities.",
			illustration: "/images/onboarding/parent-1.svg",
		},
		{
			title: "Monitor Progress",
			description:
				"Track grades, assignments, and communicate with teachers effortlessly.",
			illustration: "/images/onboarding/parent-2.svg",
		},
		{
			title: "Stay Engaged",
			description:
				"Be an active part of your child's learning journey. Get started now!",
			illustration: "/images/onboarding/parent-3.svg",
		},
	],
};

const OnboardingPage = () => {
	const [currentScreen, setCurrentScreen] = useState(0);
	const navigate = useNavigate();
	const { selectedRole, markOnboardingComplete } = useAuthStore();

	// Redirect if no role or role not supported
	if (!selectedRole || !onboardingContent[selectedRole]) {
		navigate("/dashboard");
		return null;
	}

	const content = onboardingContent[selectedRole];
	const currentContent = content[currentScreen];
	const isLastScreen = currentScreen === content.length - 1;

	const handleNext = () => {
		if (isLastScreen) {
			// Complete onboarding
			markOnboardingComplete();

			// Navigate to role-specific dashboard
			if (selectedRole === "TEACHER") {
				navigate("/school-setup");
			} else if (selectedRole === "STUDENT") {
				navigate("/student/dashboard");
			} else if (selectedRole === "ADMIN") {
				navigate("/dashboard");
			} else {
				navigate("/dashboard");
			}
		} else {
			// Go to next screen
			setCurrentScreen(currentScreen + 1);
		}
	};

	const handleSkip = () => {
		// Skip entire onboarding
		markOnboardingComplete();

		// Navigate to role-specific dashboard
		if (selectedRole === "TEACHER") {
			navigate("/school-setup");
		} else if (selectedRole === "STUDENT") {
			navigate("/student/dashboard");
		} else if (selectedRole === "ADMIN") {
			navigate("/dashboard");
		} else {
			navigate("/dashboard");
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Left side - Illustration */}
			<div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8">
				<div className="w-full max-w-md">
					<img
						src={currentContent.illustration}
						alt={currentContent.title}
						className="w-full h-auto"
						onError={(e) => {
							// Fallback if image doesn't exist
							(e.target as HTMLImageElement).src =
								"data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' dy='.3em' fill='%236b7280'%3E[Illustration Placeholder]%3C/text%3E%3C/svg%3E";
						}}
					/>
				</div>
			</div>

			{/* Right side - Content */}
			<div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-8">
				<div className="w-full max-w-lg space-y-8">
					{/* Main content */}
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900">
							{currentContent.title}
						</h1>
						<p className="text-lg text-gray-600 leading-relaxed">
							{currentContent.description}
						</p>
					</div>

					{/* Progress dots */}
					<ProgressDots
						total={content.length}
						current={currentScreen}
					/>

					{/* Action buttons */}
					<div className="flex items-center justify-between space-x-4">
						<button
							onClick={handleSkip}
							className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
							Skip
						</button>
						<button
							onClick={handleNext}
							className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
							<span>{isLastScreen ? "Get Started" : "Next"}</span>
							{!isLastScreen && (
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingPage;
