interface Subject {
	id: string;
	name: string;
	icon: string; // emoji or icon identifier
	bgColor: string; // Tailwind class like 'bg-green-100'
	teacher: string;
	currentLesson: number;
	totalLessons: number;
	progressPercentage: number;
}

interface SubjectCardProps {
	subject: Subject;
	onClick: () => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
	const {
		name,
		icon,
		bgColor,
		teacher,
		currentLesson,
		totalLessons,
		progressPercentage,
	} = subject;

	return (
		<div
			onClick={onClick}
			className={`${bgColor} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
			{/* Icon */}
			<div className="mb-4">
				<div className="w-14 h-14 rounded-full bg-white/40 flex items-center justify-center">
					<span className="text-3xl">{icon}</span>
				</div>
			</div>

			{/* Subject Info */}
			<h3 className="font-semibold text-gray-900 text-lg mb-1">{name}</h3>
			<p className="text-sm text-gray-700 mb-4">Teacher: {teacher}</p>

			{/* Progress Info */}
			<div className="flex justify-between items-center mb-3">
				<p className="text-sm text-gray-700">
					Lesson {currentLesson}/{totalLessons}
				</p>
				<p className="text-sm font-semibold text-gray-900">
					{progressPercentage}%
				</p>
			</div>

			{/* Progress Bar */}
			<div className="w-full bg-white/50 rounded-full h-2">
				<div
					className="bg-orange-500 h-2 rounded-full"
					style={{ width: `${progressPercentage}%` }}></div>
			</div>
		</div>
	);
}
