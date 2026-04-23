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
				<p className="text-lg text-[#343434] leading-[1.5]">Welcome,</p>
				<h1 className="text-5xl font-bold text-[#2b2b2b] leading-[1.4] truncate">{firstName}</h1>
				{upcomingDeadline ? (
					<p className="text-lg text-[#6b6b6b] mt-1">
						<span className="font-extrabold text-[#fd5d26]">{upcomingDeadline.subject}</span>
						{" assignment is due in: "}
						<span className="font-semibold text-[#2b2b2b]">{upcomingDeadline.dueIn}</span>
					</p>
				) : (
					<p className="text-lg text-[#6b6b6b] mt-1">You're all caught up! No upcoming deadlines.</p>
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
