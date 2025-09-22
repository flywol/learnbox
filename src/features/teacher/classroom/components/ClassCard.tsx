import { useNavigate } from 'react-router-dom';
import type { ClassroomClass } from '../types/classroom.types';

interface ClassCardProps {
  classData: ClassroomClass;
}

export default function ClassCard({ classData }: ClassCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/classroom/${classData.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`${classData.color} border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow`}
    >
      <h3 className="text-xl font-semibold mb-4">{classData.name}</h3>
      
      <div className="space-y-2">
        <div className="text-gray-600">
          <span className="font-medium">Teacher:</span> {classData.teacher.name}
        </div>
        
        <div className="text-gray-600">
          <span className="font-medium">Total students:</span> {classData.studentCount}
        </div>
      </div>
    </div>
  );
}