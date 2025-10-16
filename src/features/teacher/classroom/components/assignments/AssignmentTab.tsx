import { useNavigate, useParams } from 'react-router-dom';
import { Assignment } from '../../types/classroom.types';
import AssignmentCard from './AssignmentCard';

interface AssignmentTabProps {
  assignments: Assignment[];
}

export default function AssignmentTab({ assignments }: AssignmentTabProps) {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const handleAssignmentClick = (assignment: Assignment) => {
    navigate(`/teacher/subject/${subjectId}/assignment/${assignment.id}`);
  };

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No assignments have been created for this subject yet. Create assignments to give students practice and assess their understanding.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/teacher/subject/${subjectId}/assignment/create`)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Assignment
          </button>
          <p className="text-xs text-gray-400">
            Students will be able to submit their work online
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onView={handleAssignmentClick}
        />
      ))}
    </div>
  );
}