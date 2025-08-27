import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SubmissionTable from '../components/submissions/SubmissionTable';
import { StudentSubmission } from '../types/classroom.types';

export default function AssignmentDetailPage() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  // Mock data - should come from API
  const studentSubmissions: StudentSubmission[] = [
    { id: '1', name: 'Jane Doe', avatar: '/assets/student1.jpg', submissionStatus: 'Submitted', submissionTime: 'Sept 15, 2023', gradeStatus: 'Graded', gradePercent: 50 },
    { id: '2', name: 'James Doe', avatar: '/assets/student2.jpg', submissionStatus: 'Submitted', submissionTime: '4hrs ago', gradeStatus: 'Graded', gradePercent: 50 },
    { id: '3', name: 'James Doe', avatar: '/assets/student3.jpg', submissionStatus: 'Late', submissionTime: '2mins ago', gradeStatus: 'Not graded', gradePercent: null },
    { id: '4', name: 'James Doe', avatar: '/assets/student4.jpg', submissionStatus: 'Submitted', submissionTime: '2hrs 30mins ago', gradeStatus: 'Graded', gradePercent: 50 },
    { id: '5', name: 'James Doe', avatar: '/assets/student5.jpg', submissionStatus: 'Submitted', submissionTime: '2hrs 30mins ago', gradeStatus: 'Graded', gradePercent: 50 },
    { id: '6', name: 'James Doe', avatar: '/assets/student6.jpg', submissionStatus: 'No submitted', submissionTime: '--', gradeStatus: '--', gradePercent: null },
    { id: '7', name: 'James Doe', avatar: '/assets/student7.jpg', submissionStatus: 'Submitted', submissionTime: '2hrs 30mins ago', gradeStatus: 'Graded', gradePercent: 50 },
    { id: '8', name: 'James Doe', avatar: '/assets/student8.jpg', submissionStatus: 'No submitted', submissionTime: '--', gradeStatus: '--', gradePercent: null },
    { id: '9', name: 'James Doe', avatar: '/assets/student9.jpg', submissionStatus: 'No submitted', submissionTime: '--', gradeStatus: '--', gradePercent: null },
    { id: '10', name: 'James Doe', avatar: '/assets/student10.jpg', submissionStatus: 'Late', submissionTime: '2mins ago', gradeStatus: 'Not graded', gradePercent: null },
    { id: '11', name: 'James Doe', avatar: '/assets/student11.jpg', submissionStatus: 'Submitted', submissionTime: '4hrs ago', gradeStatus: 'Not graded', gradePercent: null },
    { id: '12', name: 'James Doe', avatar: '/assets/student12.jpg', submissionStatus: 'Submitted', submissionTime: '4hrs ago', gradeStatus: 'Graded', gradePercent: 50 },
    { id: '13', name: 'James Doe', avatar: '/assets/student13.jpg', submissionStatus: 'Submitted', submissionTime: '4hrs ago', gradeStatus: 'Not graded', gradePercent: null },
  ];

  const handleBack = () => {
    if (selectedSubmission) {
      setSelectedSubmission(null);
    } else {
      navigate(`/classroom/${classId}/subject/${subjectId}`);
    }
  };

  const handleSubmissionClick = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
  };

  if (selectedSubmission) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">Back</h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Week 2 Assignment | {selectedSubmission.name}</h3>
          <p className="text-sm text-gray-600">Submitted 2hrs 30mins ago</p>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium">1. What is the process by which plants convert sunlight into energy?</p>
            </div>
            <div>
              <p className="font-medium">2. Explain the role of chlorophyll in this crucial energy conversion process.</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its 
              layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to 
              using 'Content here, content here', making it look like readable English. Many desktop publishing packages and 
              web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover 
              many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, 
              sometimes on purpose (injected humour and the like).
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Score:</span>
            <span className="text-lg font-semibold">50%</span>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Teacher's remark</h4>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <textarea
                  placeholder="Suggestions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                  readOnly
                />
              </div>
            </div>
          </div>

          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <button onClick={handleBack} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Week 1 Assignment</h2>
      </div>

      <SubmissionTable
        submissions={studentSubmissions}
        actionLabel="View submission"
        onSubmissionClick={handleSubmissionClick}
      />
    </div>
  );
}