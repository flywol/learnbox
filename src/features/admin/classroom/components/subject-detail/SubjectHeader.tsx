import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';

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

      <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="absolute right-6 top-6 w-20 h-20 opacity-30">
          <img src="/assets/maths.svg" alt="Subject" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{subjectData.name}</h2>
        {subjectData.lessonCount && subjectData.completedLessons !== undefined && (
          <div className="flex items-center space-x-6 text-sm">
            <span>Total lessons: {subjectData.lessonCount}</span>
            <span>Completed: {subjectData.completedLessons}</span>
          </div>
        )}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Progress</span>
            <span className="text-sm">{subjectData.progress}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${subjectData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-right text-sm text-gray-600">{subjectData.progress}%</div>
      </div>

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