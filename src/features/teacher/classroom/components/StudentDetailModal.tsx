import { X, MessageSquare, Phone } from 'lucide-react';
import type { ClassroomStudent, StudentAttendanceStats } from '../types/classroom.types';

interface StudentDetailModalProps {
  student: ClassroomStudent;
  onClose: () => void;
  attendanceStats?: StudentAttendanceStats;
}

export default function StudentDetailModal({ student, onClose, attendanceStats }: StudentDetailModalProps) {
  // Circular progress component
  const CircularProgress = ({ percentage, color, label, subLabel }: { percentage: number; color: string; label: string; subLabel?: string }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="transform -rotate-90 w-28 h-28">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{percentage}%</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {subLabel && <p className="text-xs text-gray-500">{subLabel}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Student Info */}
          <div className="lg:w-1/3">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-semibold text-gray-600">
                  {student.name.charAt(0)}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-1">{student.name}</h2>
              <p className="text-gray-600 text-sm">School ID</p>

              <div className="flex justify-center space-x-2 mt-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Student Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{student.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth</span>
                <span className="font-medium">{student.dateOfBirth}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Class/Section</span>
                <span className="font-medium">{student.classLevel}/{student.classArm}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Session</span>
                <span className="font-medium">{student.session}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Term</span>
                <span className="font-medium">{student.term}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Gender</span>
                <span className="font-medium">{student.gender}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Parent</span>
                <span className="font-medium">{student.parentName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Parent's contact</span>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Overview Stats (only if attendanceStats provided) */}
          {attendanceStats && (
            <div className="lg:w-2/3 space-y-6">
              <h3 className="text-lg font-semibold">Overview</h3>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <CircularProgress
                    percentage={attendanceStats.attendancePercentage}
                    color="text-green-600"
                    label="Attendance"
                    subLabel={`Total: ${attendanceStats.totalClasses}\nAttended: ${attendanceStats.attendedClasses}\nMissed: ${attendanceStats.missedClasses}`}
                  />
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <div className="text-4xl font-bold text-yellow-700">
                        {attendanceStats.assignmentCompleted}/{attendanceStats.assignmentTotal}
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-sm font-medium text-gray-900">Assignment</p>
                      <p className="text-xs text-gray-500">Total: {attendanceStats.assignmentTotal}</p>
                      <p className="text-xs text-gray-500">Completed: {attendanceStats.assignmentCompleted}</p>
                      <p className="text-xs text-gray-500">Pending: {attendanceStats.assignmentTotal - attendanceStats.assignmentCompleted}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <CircularProgress
                    percentage={attendanceStats.averageTestScore}
                    color="text-blue-600"
                    label="Average Test Score"
                    subLabel={`Total: 2\nCompleted: 2\nPending: 0`}
                  />
                </div>
              </div>

              {/* Subject Progress Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🧬</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Biology</p>
                    <p className="text-sm text-gray-500">Lesson 9/16</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: '58%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">58%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Grade</p>
                    <p className="text-2xl font-bold">{attendanceStats.totalGrade}%</p>
                  </div>
                </div>

                {/* Remark Section */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Write your remark
                    </label>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Suggestions"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}