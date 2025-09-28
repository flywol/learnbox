import { useState } from 'react';
import TeacherSubjectCard from '../components/TeacherSubjectCard';
import ScheduleTab from '../components/ScheduleTab';
import { mockTeacherSubjects } from '../data/mockData';
import type { TeacherClassroomTab } from '../types/classroom.types';

export default function MyClassesPage() {
	const [activeTab, setActiveTab] = useState<TeacherClassroomTab>('subject');

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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{mockTeacherSubjects.map((subject) => (
						<TeacherSubjectCard key={subject.id} subject={subject} />
					))}
				</div>
			)}

			{activeTab === 'schedule' && <ScheduleTab />}
		</div>
	);
}