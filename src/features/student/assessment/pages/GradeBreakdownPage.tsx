import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, HelpCircle, ClipboardList } from 'lucide-react';

// Mock grade breakdown data - keeping until assessment endpoint is provided
const mockGradeBreakdownData = {
  subject: {
    id: 'subject-1',
    name: 'Further Maths',
    icon: '📐',
    teacher: 'Andrew Jones',
    lessonsCompleted: 16,
    totalLessons: 16,
    progress: 100,
    bgColor: 'bg-purple-100',
  },
  assessments: [
    { id: 'assess-1', type: 'Assignment', name: 'Week 1', grade: 60, icon: FileText },
    { id: 'assess-2', type: 'Assignment', name: 'Week 2', grade: 0, icon: FileText },
    { id: 'assess-3', type: 'Quiz', name: 'Week 2', grade: 0, icon: HelpCircle },
    { id: 'assess-4', type: 'Quiz', name: 'Week 2', grade: 100, icon: HelpCircle },
    { id: 'assess-5', type: 'Exam', name: '1st CA', grade: 100, icon: ClipboardList },
    { id: 'assess-6', type: 'Exam', name: 'End of term', grade: 60, icon: ClipboardList },
  ],
  overview: {
    totalGrade: 80,
    attendance: '20/22',
  },
  teacherRemark: {
    title: '',
    suggestions: '',
  },
};

export default function GradeBreakdownPage() {
  const navigate = useNavigate();
  // const { subjectId } = useParams<{ subjectId: string }>();

  // In a real implementation, fetch data based on subjectId
  const data = mockGradeBreakdownData;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/assessment')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Grade Breakdown</h1>
      </div>

      {/* Subject Header Card */}
      <div className="bg-purple-100 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
            {data.subject.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{data.subject.name}</h2>
            <p className="text-sm text-gray-700 mb-3">Teacher: {data.subject.teacher}</p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Lesson {data.subject.lessonsCompleted}/{data.subject.totalLessons}
                </span>
                <span className="font-semibold text-gray-900">{data.subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${data.subject.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.assessments.map((assessment) => {
          const Icon = assessment.icon;
          return (
            <div
              key={assessment.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{assessment.type}</p>
                  <p className="text-xs text-gray-600">{assessment.name}</p>
                </div>
              </div>

              {/* Circular Progress Badge */}
              <div className="relative w-12 h-12 flex-shrink-0">
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
                    stroke="#F97316"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${(assessment.grade / 100) * 125.6} 125.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900">{assessment.grade}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Grade</p>
            <p className="text-3xl font-bold text-gray-900">{data.overview.totalGrade}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Attendance</p>
            <p className="text-3xl font-bold text-gray-900">{data.overview.attendance}</p>
          </div>
        </div>
      </div>

      {/* Teacher's Remark */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Teacher's remark</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <div className="border-b-2 border-dashed border-gray-300 pb-2">
              <p className="text-sm text-gray-500 italic">
                {data.teacherRemark.title || 'No title provided'}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions</label>
            <div className="border-b-2 border-dashed border-gray-300 pb-2">
              <p className="text-sm text-gray-500 italic">
                {data.teacherRemark.suggestions || 'No suggestions provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
