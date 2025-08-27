import { Student } from '../../types/classroom.types';

interface LiveClassTabProps {
  students: Student[];
}

export default function LiveClassTab({ students }: LiveClassTabProps) {
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">No live class scheduled</h3>
          <p className="text-gray-600 mb-4">Schedule a live class to interact with your students</p>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Schedule Class
          </button>
        </div>
      </div>
      
      <div className="w-80">
        <h3 className="font-semibold mb-4">Students ({students.length})</h3>
        <div className="space-y-3">
          {students.slice(0, 10).map((student) => (
            <div key={student.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-sm">{student.name}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}