import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TeacherSubjectCard from '../components/TeacherSubjectCard';
import ScheduleTab from '../components/ScheduleTab';
import { subjectsClassesApiClient, type SubjectResponse } from '../api/subjectsClassesApiClient';
import type { TeacherClassroomTab, TeacherSubject } from '../types/classroom.types';
import { BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

// Default subject colors and icons
const getSubjectDefaults = (subjectName: string) => {
	const defaults = {
		Math: { icon: '📊', bgColor: 'bg-blue-50', color: 'bg-blue-100 text-blue-800' },
		Mathematics: { icon: '📊', bgColor: 'bg-blue-50', color: 'bg-blue-100 text-blue-800' },
		Science: { icon: '🔬', bgColor: 'bg-green-50', color: 'bg-green-100 text-green-800' },
		English: { icon: '📖', bgColor: 'bg-green-50', color: 'bg-green-100 text-green-800' },
		Biology: { icon: '🧬', bgColor: 'bg-yellow-50', color: 'bg-yellow-100 text-yellow-800' },
		Chemistry: { icon: '🧪', bgColor: 'bg-red-50', color: 'bg-red-100 text-red-800' },
		Physics: { icon: '⚛️', bgColor: 'bg-purple-50', color: 'bg-purple-100 text-purple-800' },
		'Further Mathematics': { icon: '📚', bgColor: 'bg-indigo-50', color: 'bg-indigo-100 text-indigo-800' },
		Geography: { icon: '🌍', bgColor: 'bg-teal-50', color: 'bg-teal-100 text-teal-800' },
		History: { icon: '📜', bgColor: 'bg-amber-50', color: 'bg-amber-100 text-amber-800' },
	};
	
	return defaults[subjectName as keyof typeof defaults] || { 
		icon: '📝', 
		bgColor: 'bg-gray-50', 
		color: 'bg-gray-100 text-gray-800' 
	};
};

// Convert API SubjectResponse to TeacherSubject
const mapSubjectToTeacherSubject = (subject: SubjectResponse): TeacherSubject => {
	const defaults = getSubjectDefaults(subject.name);
	return {
		id: subject._id,
		name: subject.name,
		description: subject.description,
		classLevel: 'Multiple Classes', // Will be updated when we have class data
		studentCount: 0, // Will be updated when we get student count data
		icon: subject.icon || defaults.icon,
		bgColor: defaults.bgColor,
		color: subject.color || defaults.color,
	};
};

// Loading component
const LoadingSubjects = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{Array.from({ length: 6 }, (_, i) => (
			<div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
				<div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
				<div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
				<div className="h-3 bg-gray-200 rounded w-2/3"></div>
			</div>
		))}
	</div>
);

// Error component
const SubjectsError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
	<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
		<AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
		<h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load subjects</h3>
		<p className="text-gray-500 mb-4">{message}</p>
		<button
			onClick={onRetry}
			className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
		>
			<RefreshCw className="w-4 h-4" />
			<span>Try Again</span>
		</button>
	</div>
);

// Empty state component
const EmptySubjects = () => (
	<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
		<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
		<h3 className="text-lg font-medium text-gray-900 mb-2">No subjects assigned</h3>
		<p className="text-gray-500 mb-4">
			You don't have any subjects assigned yet. Contact your administrator to get started.
		</p>
	</div>
);

export default function MyClassesPage() {
	const [activeTab, setActiveTab] = useState<TeacherClassroomTab>('subject');

	// Fetch teacher's subjects and classes
	const { 
		data: subjectsClassesData, 
		isLoading, 
		error, 
		refetch 
	} = useQuery({
		queryKey: ['teacher-subjects-classes'],
		queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const subjects = subjectsClassesData?.assignedSubjects.map(mapSubjectToTeacherSubject) || [];

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<div className="flex gap-2">
				<button
					onClick={() => setActiveTab('subject')}
					className={`px-6 py-3 rounded-lg font-medium transition-colors ${
						activeTab === 'subject'
							? 'bg-orange-500 text-white'
							: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
					}`}
				>
					Subject
				</button>
				<button
					onClick={() => setActiveTab('schedule')}
					className={`px-6 py-3 rounded-lg font-medium transition-colors ${
						activeTab === 'schedule'
							? 'bg-orange-500 text-white'
							: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
					}`}
				>
					Schedule
				</button>
			</div>

			{/* Tab Content */}
			{activeTab === 'subject' && (
				<>
					{isLoading && <LoadingSubjects />}
					
					{error && (
						<SubjectsError 
							message="Please try refreshing the page" 
							onRetry={() => refetch()} 
						/>
					)}
					
					{!isLoading && !error && subjects.length === 0 && <EmptySubjects />}
					
					{!isLoading && !error && subjects.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{subjects.map((subject) => (
								<TeacherSubjectCard key={subject.id} subject={subject} />
							))}
						</div>
					)}
				</>
			)}

			{activeTab === 'schedule' && <ScheduleTab />}
		</div>
	);
}