import { Assignment } from '../../types/classroom.types';

interface AssignmentCardProps {
  assignment: Assignment;
  onView: (assignment: Assignment) => void;
}

export default function AssignmentCard({ assignment, onView }: AssignmentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
        <p className={`text-sm ${assignment.status === 'overdue' ? 'text-red-500' : 'text-gray-600'}`}>
          {assignment.dueDate}
        </p>
      </div>
      <button
        onClick={() => onView(assignment)}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
      >
        View
      </button>
    </div>
  );
}