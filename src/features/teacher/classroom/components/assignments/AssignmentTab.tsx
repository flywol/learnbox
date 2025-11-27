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
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Assignments Yet</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          Create your first assignment to help students practice and assess their understanding of the subject matter.
        </p>
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}/assignment/create`)}
          className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create First Assignment
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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