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