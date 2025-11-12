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
		<div className="bg-white rounded-lg p-6 border border-gray-200">
			<p className="text-sm text-gray-600 mb-1">Welcome,</p>
			<h1 className="text-3xl font-bold text-gray-900 mb-3">{parentName}</h1>

			{upcomingDeadline && (
				<div className="flex items-center gap-2 text-sm">
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
