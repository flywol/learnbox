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
		<div className="bg-white rounded-2xl p-8 flex items-center justify-between shadow-sm">
			<div className="flex-1">
				<p className="text-gray-600 mb-2">Welcome,</p>
				<h1 className="text-4xl font-bold text-gray-900 mb-3">{firstName}</h1>
				{upcomingDeadline ? (
					<p className="text-gray-700">
						<span className="text-orange-500 font-semibold">
							{upcomingDeadline.subject}
						</span>{" "}
						assignment is due in:{" "}
						<span className="font-semibold">{upcomingDeadline.dueIn}</span>
					</p>
				) : (
					<p className="text-gray-600">You're all caught up! No upcoming deadlines.</p>
				)}
			</div>
			<div className="flex-shrink-0">
				<img
					src="/images/student/studentprofile.svg"
					alt="Student profile"
					className="w-32 h-32 object-contain"
				/>
			</div>
		</div>
	);
}
