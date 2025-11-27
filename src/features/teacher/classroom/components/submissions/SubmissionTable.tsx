import { StudentSubmission } from '../../types/classroom.types';
import { Eye, Edit } from 'lucide-react';

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
      case 'Submitted': return 'bg-green-50 text-green-700 border-green-100';
      case 'Late': return 'bg-red-50 text-red-700 border-red-100';
      case 'No submitted': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getGradeStatusColor = (status: string) => {
    switch (status) {
      case 'Graded': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Not graded': return 'bg-orange-50 text-orange-700 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Submissions Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No students have submitted work for this assignment yet. Student submissions will appear here once they upload their work.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission status</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time of submission</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade status</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade %</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {submissions.map((submission, index) => (
              <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                       {submission.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{submission.name}</span>
                  </div>
                </td>
                <td className="text-center py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSubmissionStatusColor(submission.submissionStatus)}`}>
                    {submission.submissionStatus}
                  </span>
                </td>
                <td className="text-center py-4 px-6 text-sm text-gray-500 font-mono">
                   {new Date(submission.submissionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="text-center py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGradeStatusColor(submission.gradeStatus)}`}>
                    {submission.gradeStatus}
                  </span>
                </td>
                <td className="text-center py-4 px-6">
                  {submission.gradePercent ? (
                     <span className="font-bold text-gray-900">{submission.gradePercent}%</span>
                  ) : (
                     <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="text-center py-4 px-6">
                  {onSubmissionClick ? (
                    <button
                      onClick={() => onSubmissionClick(submission)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      {actionLabel === 'Review' ? <Edit className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {actionLabel}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}