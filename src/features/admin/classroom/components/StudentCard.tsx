import type { ClassroomStudent } from '../types/classroom.types';

interface StudentCardProps {
  student: ClassroomStudent;
  onClick: () => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-600">
            {student.name.charAt(0)}
          </span>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">Admission No.</p>
        </div>
      </div>
    </div>
  );
}