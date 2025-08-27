import { useNavigate, useParams } from 'react-router-dom';
import { Assignment } from '../../types/classroom.types';
import AssignmentCard from './AssignmentCard';

interface AssignmentTabProps {
  assignments: Assignment[];
}

export default function AssignmentTab({ assignments }: AssignmentTabProps) {
  const navigate = useNavigate();
  const { classId, subjectId } = useParams();

  const handleAssignmentClick = (assignment: Assignment) => {
    navigate(`/classroom/${classId}/subject/${subjectId}/assignment/${assignment.id}`);
  };

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