import { getFirstName } from "@/common/utils/userUtils";
import { useAuthStore } from "@/features/auth/store/authStore";

interface WelcomeBannerProps {
  upcomingDeadline?: {
    subject: string;
    dueIn: string;
  };
}

export default function WelcomeBanner({ upcomingDeadline }: WelcomeBannerProps) {
	const user = useAuthStore((state) => state.user);

	// Get first name from full name
	const firstName = getFirstName(user?.fullName, "Student");

	return (
		<div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 flex items-center justify-between shadow-sm gap-4">
			<div className="flex-1 min-w-0">
				<p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">Welcome,</p>
				<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3 truncate">{firstName}</h1>
				{upcomingDeadline ? (
					<p className="text-sm md:text-base text-gray-700">
						<span className="text-orange-500 font-semibold">
							{upcomingDeadline.subject}
						</span>{" "}
						assignment is due in:{" "}
						<span className="font-semibold">{upcomingDeadline.dueIn}</span>
					</p>
				) : (
					<p className="text-sm md:text-base text-gray-600">You're all caught up! No upcoming deadlines.</p>
				)}
			</div>
			<div className="flex-shrink-0">
				<img
					src="/images/student/studentprofile.svg"
					alt="Student profile"
					className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
				/>
			</div>
		</div>
	);
}
