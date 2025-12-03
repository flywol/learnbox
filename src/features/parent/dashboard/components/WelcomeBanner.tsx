interface UpcomingDeadline {
	subject: string;
	dueIn: string;
}

interface Props {
	parentName?: string;
	upcomingDeadline: UpcomingDeadline | null;
}

export default function WelcomeBanner({
	parentName = "Paula",
	upcomingDeadline,
}: Props) {
	return (
		<div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
			<p className="text-xs md:text-sm text-gray-600 mb-1">Welcome,</p>
			<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 truncate">{parentName}</h1>

			{upcomingDeadline && (
				<div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm">
					<span className="font-semibold text-orange-600">
						{upcomingDeadline.subject}
					</span>
					<span className="text-gray-700">assignment is due in</span>
					<span className="font-semibold text-orange-600">
						{upcomingDeadline.dueIn}
					</span>
				</div>
			)}
		</div>
	);
}
