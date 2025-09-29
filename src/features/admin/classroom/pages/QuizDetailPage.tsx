import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SubmissionTable from '../components/submissions/SubmissionTable';
import { StudentSubmission } from '../types/classroom.types';
import '../styles/toggle.css';

export default function QuizDetailPage() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();

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
    navigate(`/admin/classroom/${classId}/subject/${subjectId}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">Week 2 Quiz</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Due date: Sept 15, 2023</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Close submission:</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle" 
                id="toggle" 
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer transition-all duration-300 ease-in-out" 
                defaultChecked
              />
              <label 
                htmlFor="toggle" 
                className="toggle-label block overflow-hidden h-5 rounded-full bg-orange-500 cursor-pointer transition-all duration-300 ease-in-out"
              ></label>
            </div>
          </div>
        </div>
      </div>

      <SubmissionTable
        submissions={studentSubmissions}
        actionLabel="Review"
      />
    </div>
  );
}