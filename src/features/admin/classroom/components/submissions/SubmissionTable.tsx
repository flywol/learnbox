import { StudentSubmission } from '../../types/classroom.types';

interface SubmissionTableProps {
  submissions: StudentSubmission[];
  actionLabel: 'View submission' | 'Review';
  onSubmissionClick?: (submission: StudentSubmission) => void;
}

export default function SubmissionTable({ 
  submissions, 
  actionLabel, 
  onSubmissionClick
}: SubmissionTableProps) {
  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Late': return 'bg-red-100 text-red-800 border-red-200';
      case 'No submitted': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeStatusColor = (status: string) => {
    switch (status) {
      case 'Graded': return 'bg-green-100 text-green-800 border-green-200';
      case 'Not graded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No students have submitted work for this assignment yet. Student submissions will appear here once they upload their work.
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Students can submit work through their student portal
          </p>
          <p className="text-xs text-gray-400">
            Refresh this page to check for new submissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-3 border border-gray-200">S/N</th>
            <th className="text-left p-3 border border-gray-200">Student Name</th>
            <th className="text-center p-3 border border-gray-200">Submission status</th>
            <th className="text-center p-3 border border-gray-200">Time of submission</th>
            <th className="text-center p-3 border border-gray-200">Grade status</th>
            <th className="text-center p-3 border border-gray-200">Grade %</th>
            <th className="text-center p-3 border border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={submission.id}>
              <td className="p-3 border border-gray-200">{index + 1}</td>
              <td className="p-3 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <span>{submission.name}</span>
                </div>
              </td>
              <td className="text-center p-3 border border-gray-200">
                <span className={`px-2 py-1 rounded-full text-xs border ${getSubmissionStatusColor(submission.submissionStatus)}`}>
                  {submission.submissionStatus}
                </span>
              </td>
              <td className="text-center p-3 border border-gray-200">{submission.submissionTime}</td>
              <td className="text-center p-3 border border-gray-200">
                <span className={`px-2 py-1 rounded-full text-xs border ${getGradeStatusColor(submission.gradeStatus)}`}>
                  {submission.gradeStatus}
                </span>
              </td>
              <td className="text-center p-3 border border-gray-200">
                {submission.gradePercent || '--'}
              </td>
              <td className="text-center p-3 border border-gray-200">
                {onSubmissionClick ? (
                  <button
                    onClick={() => onSubmissionClick(submission)}
                    className="text-orange-500 hover:text-orange-600 text-sm"
                  >
                    {actionLabel}
                  </button>
                ) : (
                  <span className="text-orange-500 text-sm">{actionLabel}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}