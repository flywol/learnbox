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
    <div className="space-y-8">
      {/* Stats Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-8">
        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="38"
              stroke="#F3F4F6"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="38"
              className={getCircularProgressBg()}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(progressPercentage / 100) * 239} 239`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-2xl font-bold ${getCircularProgressColor()}`}>
              {stats.completed}
            </span>
            <span className="text-xs text-gray-400 font-medium">of {stats.total}</span>
          </div>
        </div>

        {/* Stats Text */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activeFilter === 'graded' ? 'Graded Assignments' : 'Assignment Overview'}
          </h3>
          <div className="grid grid-cols-3 gap-6">
             <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
             </div>
             <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Done</p>
                <p className="text-lg font-bold text-green-600">{stats.completed}</p>
             </div>
             <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pending</p>
                <p className="text-lg font-bold text-orange-500">{stats.pending}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-gray-900">Assignments</h3>
        <div className="bg-gray-100/80 p-1 rounded-lg inline-flex w-full sm:w-auto overflow-x-auto">
            {filters.map((filter) => (
            <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeFilter === filter.id
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
            >
                {filter.label}
            </button>
            ))}
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <span className="text-3xl">📝</span>
          </div>
          <p className="text-gray-900 font-semibold text-lg">No assignments found</p>
          <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => handleAssignmentClick(assignment.id, assignment.status)}
              className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-orange-100 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Icon/Status Indicator */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  assignment.status === 'graded' ? 'bg-green-50 text-green-600' : 
                  assignment.status === 'submitted' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
              }`}>
                  {assignment.status === 'graded' ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  ) : assignment.status === 'submitted' ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                  )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{assignment.subjectName}</span>
                    <span className="text-gray-300">•</span>
                    <span className={`text-xs font-medium ${
                        assignment.status === 'pending' ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                        Due {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                  {assignment.title}
                </h3>
              </div>

              {/* Action/Score */}
              <div className="flex-shrink-0 self-end sm:self-center">
                {assignment.status === 'graded' && assignment.score !== undefined && assignment.totalPoints !== undefined ? (
                   <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                      <span className="text-sm font-semibold text-green-700">Score</span>
                      <span className="text-lg font-bold text-green-700">{Math.round((assignment.score / assignment.totalPoints) * 100)}%</span>
                   </div>
                ) : assignment.status === 'pending' ? (
                    <button className="px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-orange-600 transition-colors">
                        Start Now
                    </button>
                ) : (
                    <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg">
                        Processing
                    </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
