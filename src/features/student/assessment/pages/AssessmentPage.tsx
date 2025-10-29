import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Download } from 'lucide-react';

// Mock assessment data - keeping until assessment endpoint is provided
const mockAssessmentData = {
  session: '2023/2024',
  term: '1st term',
  totalGrade: 80,
  subjects: [
    {
      id: 'subject-1',
      name: 'Further Maths',
      icon: '📐',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 52,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-2',
      name: 'English',
      icon: '📚',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 75,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-3',
      name: 'English Literature',
      icon: '📖',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 88,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-4',
      name: 'Further Maths',
      icon: '📐',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 52,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-5',
      name: 'English',
      icon: '📚',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 75,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-6',
      name: 'English Literature',
      icon: '📖',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 88,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-7',
      name: 'Further Maths',
      icon: '📐',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 52,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-8',
      name: 'English',
      icon: '📚',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 75,
      bgColor: 'bg-blue-100',
    },
    {
      id: 'subject-9',
      name: 'English Literature',
      icon: '📖',
      teacher: 'Andrew Jones',
      progress: 100,
      grade: 88,
      bgColor: 'bg-blue-100',
    },
  ],
};

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(mockAssessmentData.session);
  const [selectedTerm, setSelectedTerm] = useState(mockAssessmentData.term);
  const [remark, setRemark] = useState('');

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/student/assessment/${subjectId}`);
  };

  const handleDownloadResult = () => {
    // TODO: Implement download functionality
    console.log('Downloading result...');
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Assessment</h1>
          <div className="flex items-center gap-4">
            {/* Session Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Session:</label>
              <div className="relative">
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="2023/2024">2023/2024</option>
                  <option value="2022/2023">2022/2023</option>
                  <option value="2021/2022">2021/2022</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Term Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Term:</label>
              <div className="relative">
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="1st term">1st term</option>
                  <option value="2nd term">2nd term</option>
                  <option value="3rd term">3rd term</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {mockAssessmentData.subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className="bg-blue-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-[10px]">👤</span>
                    </div>
                    <span className="truncate">{subject.teacher}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progress:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{subject.progress}%</span>
                  <span className="font-semibold text-gray-900">{subject.grade}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Total Grade</label>
              <div className="text-3xl font-bold text-gray-900">
                {mockAssessmentData.totalGrade}%
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Remark</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter remark"
              />
            </div>
          </div>

          <button
            onClick={handleDownloadResult}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Result</span>
          </button>
        </div>
      </div>
    </div>
  );
}
