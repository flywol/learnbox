import { useNavigate } from "react-router-dom";
import { useAiChatStore } from "../store/aiChatStore";

interface Subject {
	id: string;
	name: string;
	teacher: string;
	bgColor: string;
	icon: string;
}

const mockSubjects: Subject[] = [
	{ id: "biology",         name: "Biology",          teacher: "Teacher: Andrew Jones", bgColor: "#e8fed3", icon: "/images/student/attendancebg.svg" },
	{ id: "further-maths",   name: "Further Maths",    teacher: "Teacher: Andrew Jones", bgColor: "#ffefea", icon: "/images/student/testbg.svg"       },
	{ id: "english",         name: "English",          teacher: "Teacher: Andrew Jones", bgColor: "#e5f0fe", icon: "/images/student/assignmentbg.svg"  },
	{ id: "chemistry",       name: "Chemistry",        teacher: "Teacher: Andrew Jones", bgColor: "#f6e9fe", icon: "/images/student/attendancebg.svg"  },
	{ id: "economics",       name: "Economics",        teacher: "Teacher: Andrew Jones", bgColor: "#e2fff9", icon: "/images/student/testbg.svg"        },
	{ id: "geography",       name: "Geography",        teacher: "Teacher: Andrew Jones", bgColor: "#e8fed3", icon: "/images/student/assignmentbg.svg"  },
	{ id: "civic",           name: "Civic Education",  teacher: "Teacher: Andrew Jones", bgColor: "#d5e5f8", icon: "/images/student/attendancebg.svg"  },
	{ id: "mathematics",     name: "Mathematics",      teacher: "Teacher: Andrew Jones", bgColor: "#ffdcc5", icon: "/images/student/testbg.svg"        },
	{ id: "computer-science",name: "Computer Science", teacher: "Teacher: Andrew Jones", bgColor: "#ffefea", icon: "/images/student/assignmentbg.svg"  },
	{ id: "agriculture",     name: "Agriculture",      teacher: "Teacher: Andrew Jones", bgColor: "#e8fed3", icon: "/images/student/attendancebg.svg"  },
	{ id: "history",         name: "History",          teacher: "Teacher: Andrew Jones", bgColor: "#e2fff9", icon: "/images/student/testbg.svg"        },
	{ id: "food-nutrition",  name: "Food & Nutrition", teacher: "Teacher: Andrew Jones", bgColor: "#fbddeb", icon: "/images/student/assignmentbg.svg"  },
];

export default function LearnBoxAIHomePage() {
	const navigate = useNavigate();
	const { startNewConversation } = useAiChatStore();

	const handleSelectSubject = (subject: Subject) => {
		const convId = startNewConversation(subject.name);
		navigate(`/student/learnbox-ai/chat/${subject.id}?conv=${convId}`);
	};

	return (
		<div className="bg-white rounded-2xl p-8 shadow-sm">
			{/* Header */}
			<div className="flex flex-col gap-6 pb-6 border-b border-[#eeeeee]">
				<div>
					<h1 className="text-4xl font-bold text-[#2b2b2b] leading-[1.4]">
						AI Learning Assistant
					</h1>
				</div>
				<p className="text-xl font-semibold text-[#6b6b6b] max-w-3xl">
					Select your subject and ask questions about any topic you're studying. Get clear
					explanations, helpful examples, and practice questions tailored to your coursework
				</p>
			</div>

			{/* Subject Grid */}
			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{mockSubjects.map((subject) => (
					<button
						key={subject.id}
						onClick={() => handleSelectSubject(subject)}
						className="flex items-center gap-4 px-6 py-8 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
						style={{ backgroundColor: subject.bgColor }}
					>
						<div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
							<img
								src={subject.icon}
								alt={subject.name}
								className="w-10 h-10 object-contain"
							/>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-[#343434] leading-[1.4]">
								{subject.name}
							</h3>
							<p className="text-sm font-semibold text-[#6b6b6b] mt-1">
								{subject.teacher}
							</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
