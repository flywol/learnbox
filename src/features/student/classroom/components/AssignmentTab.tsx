import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassroomStore } from '../store/classroomStore';

type AssignmentFilter = 'all' | 'pending' | 'submitted' | 'graded';

export default function AssignmentTab() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<AssignmentFilter>('all');
  const { assignments } = useClassroomStore();

  // Filter assignments based on active filter
  const filteredAssignments = useMemo(() => {
    if (activeFilter === 'all') return assignments;
    return assignments.filter((assignment) => assignment.status === activeFilter);
  }, [assignments, activeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'graded').length;
    const pending = assignments.filter((a) => a.status === 'pending').length;

    return { total, completed, pending };
  }, [assignments]);

  const filters: { id: AssignmentFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'graded', label: 'Graded' },
  ];

  const handleAssignmentClick = (assignmentId: string, status: string) => {
    if (status === 'pending') {
      navigate(`/student/classroom/assignment/${assignmentId}`);
    } else {
      navigate(`/student/classroom/assignment/${assignmentId}/submitted`);
    }
  };

  const getCircularProgressColor = () => {
    if (activeFilter === 'graded') return 'text-green-600';
    if (activeFilter === 'pending') return 'text-orange-500';
    return 'text-orange-500';
  };

  const getCircularProgressBg = () => {
    if (activeFilter === 'graded') return 'stroke-green-600';
    if (activeFilter === 'pending') return 'stroke-orange-500';
    return 'stroke-orange-500';
  };

  // Calculate progress percentage
  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 flex items-start gap-6">
        {/* Circular Progress */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              className={getCircularProgressBg()}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(progressPercentage / 100) * 201} 201`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-lg font-bold ${getCircularProgressColor()}`}>
                {stats.completed}
                <span className="text-sm">/{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Text */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {activeFilter === 'graded' ? 'Graded Assignment' : 'Assignment'}
          </h3>
          <div className="text-sm text-gray-600">
            {activeFilter === 'graded' ? (
              <>
                <div>Total: {stats.total}</div>
                <div>Average Grade: {progressPercentage}%</div>
              </>
            ) : (
              <>
                <div>Total assignments: {stats.total}</div>
                <div>Completed: {stats.completed}</div>
                <div>Pending: {stats.pending}</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2.5 font-medium text-sm transition-all ${
              activeFilter === filter.id
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-48 h-48 mb-6">
            <img
              src="/images/student/empty-state.svg"
              alt="No assignments"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to emoji if image doesn't exist
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'text-7xl';
                fallback.textContent = '🔍';
                e.currentTarget.parentElement?.appendChild(fallback);
              }}
            />
          </div>
          <p className="text-gray-500 font-medium">No assignment yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => handleAssignmentClick(assignment.id, assignment.status)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {assignment.subjectName} • Due on{' '}
                    {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  {assignment.status === 'pending' && (
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                      DUE
                    </span>
                  )}
                  {assignment.status === 'graded' && assignment.score !== undefined && assignment.totalPoints !== undefined && (
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#E5E7EB"
                          strokeWidth="4"
                          fill="white"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#10B981"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${((assignment.score / assignment.totalPoints) * 100 / 100) * 125.6} 125.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">
                          {Math.round((assignment.score / assignment.totalPoints) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                  {assignment.status === 'submitted' && (
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#E5E7EB"
                          strokeWidth="4"
                          fill="white"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl">⏳</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
