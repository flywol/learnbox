import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AssessmentStudent, AssessmentSummary } from '../types/classroom.types';

interface AssessmentTabProps {
  students: AssessmentStudent[];
  summary: AssessmentSummary;
}

const ITEMS_PER_PAGE = 15;

export default function AssessmentTab({ students, summary }: AssessmentTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStudents = students.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const formatScore = (score: number | null) => {
    return score !== null ? score.toString() : '--';
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Attendance:</span>
          <span className="font-semibold ml-1">{summary.attendance}</span>
        </div>
        <div>
          <span className="text-gray-600">Assignments:</span>
          <span className="font-semibold ml-1">{summary.assignments}</span>
        </div>
        <div>
          <span className="text-gray-600">Quizzes:</span>
          <span className="font-semibold ml-1">{summary.quizzes}</span>
        </div>
        <div>
          <span className="text-gray-600">C.A Test:</span>
          <span className="font-semibold ml-1">{summary.caTest}</span>
        </div>
        <div>
          <span className="text-gray-600">Exam:</span>
          <span className="font-semibold ml-1">{summary.exam}</span>
        </div>
        <div>
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold ml-1">{summary.total}</span>
        </div>
        <div>
          <span className="text-gray-600">Grade:</span>
          <span className="font-semibold ml-1">{summary.grades}</span>
        </div>
      </div>

      {/* Assessment Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700 rounded-l-lg">Student Name</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Attendance</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Assignment</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Quiz</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">C.A Test</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Exam</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Total</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700 rounded-r-lg">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{student.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {formatScore(student.attendance)}
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {formatScore(student.assignment)}
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {formatScore(student.quiz)}
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {formatScore(student.caTest)}
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {formatScore(student.exam)}
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {formatScore(student.total)}
                </td>
                <td className="py-4 px-4 text-center font-medium text-gray-900">
                  {student.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {startIndex + 1} to {Math.min(endIndex, students.length)} of {students.length} entries
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-sm ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}