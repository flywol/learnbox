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
	const firstName = getFirstName(user?.fullName, "Student");

	return (
		<div className="bg-white rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-sm gap-4">
			<div className="flex-1 min-w-0">
				<h1 className="text-2xl md:text-3xl font-bold text-[#2b2b2b] leading-snug">
					Welcome back, <span className="text-[#fd5d26]">{firstName}</span>
				</h1>
				<p className="text-base text-[#6b6b6b] mt-1">What do you want to do today?</p>
				{upcomingDeadline && (
					<p className="text-sm text-[#6b6b6b] mt-2">
						<span className="font-semibold text-[#fd5d26]">{upcomingDeadline.subject}</span>
						{" is due in "}
						<span className="font-semibold text-[#2b2b2b]">{upcomingDeadline.dueIn}</span>
					</p>
				)}
			</div>
			<div className="flex-shrink-0">
				<img
					src="/images/student/studentprofile.svg"
					alt="Student"
					className="w-28 h-28 md:w-36 md:h-36 object-contain"
				/>
			</div>
		</div>
	);
}
