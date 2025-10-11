import { useNavigate } from 'react-router-dom';
import type { TeacherSubject } from '../types/classroom.types';

interface TeacherSubjectCardProps {
  subject: TeacherSubject;
}

export default function TeacherSubjectCard({ subject }: TeacherSubjectCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teacher/subject/${subject.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`${subject.bgColor} rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow relative border border-gray-200`}
    >
      {/* Class level in top right */}
      <div className="absolute top-4 right-6">
        <span className="text-sm font-medium text-gray-700">
          {subject.classLevel}
        </span>
      </div>

      {/* Subject icon and name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">
          {subject.icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">{subject.name}</h3>
      </div>
      
      {/* Student count */}
      <div className="text-sm text-gray-600">
        Total students: {subject.studentCount}
      </div>
    </div>
  );
}