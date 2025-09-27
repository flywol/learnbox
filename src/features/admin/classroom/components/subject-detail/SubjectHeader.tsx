import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import CourseOverviewCard from '../../../../../common/components/CourseOverviewCard';

interface SubjectData {
  name: string;
  description?: string;
  lessonCount?: number;
  completedLessons?: number;
  progress: number;
  teacher: {
    name: string;
    avatar?: string;
  };
}

interface SubjectHeaderProps {
  subjectData: SubjectData;
  onBack: () => void;
}

export default function SubjectHeader({ subjectData, onBack }: SubjectHeaderProps) {
  return (
    <>
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold">{subjectData.name}</h1>
      </div>

      {/* Course Overview Card */}
      <CourseOverviewCard
        description={subjectData.description || `Learn about ${subjectData.name} with interactive lessons and exercises. Track your progress and master the concepts at your own pace.`}
        progress={subjectData.progress}
        onEdit={() => {
          // TODO: Implement edit functionality
          console.log('Edit course overview');
        }}
      />

      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div>
          <p className="text-sm text-gray-600">Teacher:</p>
          <p className="font-medium">{subjectData.teacher.name}</p>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}