import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { QuizSubmission } from '../../classroom/types/classroom.types';

// Mock submissions data
const getMockSubmissions = (quizId: string): QuizSubmission[] => [
  {
    id: 'sub-1',
    quizId,
    studentId: 'student-1',
    studentName: 'Jane Doe',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=40&h=40&fit=crop&crop=face',
    submissionStatus: 'Submitted',
    submissionTime: '2023-09-15T14:30:00',
    gradeStatus: 'Graded',
    score: 90,
    totalPoints: 100,
    percentage: 90,
    answers: [],
  },
  {
    id: 'sub-2',
    quizId,
    studentId: 'student-2',
    studentName: 'James Doe',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    submissionStatus: 'Submitted',
    submissionTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    gradeStatus: 'Graded',
    score: 90,
    totalPoints: 100,
    percentage: 90,
    answers: [],
  },
  {
    id: 'sub-3',
    quizId,
    studentId: 'student-3',
    studentName: 'James Doe',
    studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    submissionStatus: 'Late',
    submissionTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    gradeStatus: 'Not graded',
    answers: [],
  },
  {
    id: 'sub-4',
    quizId,
    studentId: 'student-4',
    studentName: 'James Doe',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    submissionStatus: 'Submitted',
    submissionTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    gradeStatus: 'Graded',
    score: 90,
    totalPoints: 100,
    percentage: 90,
    answers: [],
  },
  {
    id: 'sub-5',
    quizId,
    studentId: 'student-5',
    studentName: 'James Doe',
    studentAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face',
    submissionStatus: 'Submitted',
    submissionTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    gradeStatus: 'Graded',
    score: 90,
    totalPoints: 100,
    percentage: 90,
    answers: [],
  },
  {
    id: 'sub-6',
    quizId,
    studentId: 'student-6',
    studentName: 'James Doe',
    studentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
    submissionStatus: 'Not submitted',
    gradeStatus: 'Not graded',
    answers: [],
  },
];

export default function QuizSubmissionsPage() {
  const { quizId, subjectId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [closeSubmission, setCloseSubmission] = useState(false);

  useEffect(() => {
    if (quizId) {
      // TODO: Fetch submissions from API
      const mockSubmissions = getMockSubmissions(quizId);
      setSubmissions(mockSubmissions);
    }
  }, [quizId]);

  const formatSubmissionTime = (isoString?: string) => {
    if (!isoString) return '--';

    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours}hrs ago`;
    } else if (diffDays < 7) {
      return `${diffDays}days ago`;
    } else {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  };

  const getStatusBadge = (status: QuizSubmission['submissionStatus']) => {
    const styles = {
      Submitted: 'bg-green-100 text-green-700',
      Late: 'bg-orange-100 text-orange-700',
      'Not submitted': 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getGradeBadge = (status: QuizSubmission['gradeStatus']) => {
    const styles = {
      Graded: 'bg-green-100 text-green-700',
      'Not graded': 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const handleViewSubmission = (submission: QuizSubmission) => {
    navigate(`/teacher/subject/${subjectId}/quiz/${quizId}/submissions/${submission.studentId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/teacher/subject/${subjectId}/quiz/${quizId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Submissions</h1>
        </div>

        {/* Close Submission Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Close submission:</span>
          <button
            onClick={() => setCloseSubmission(!closeSubmission)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              closeSubmission ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                closeSubmission ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time of Submission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission, index) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={submission.studentAvatar}
                        alt={submission.studentName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {submission.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(submission.submissionStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatSubmissionTime(submission.submissionTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getGradeBadge(submission.gradeStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.percentage !== undefined ? `${submission.percentage}%` : '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.submissionStatus !== 'Not submitted' && (
                      <button
                        onClick={() => handleViewSubmission(submission)}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                      >
                        View submission
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
