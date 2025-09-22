import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@/common/ui/Table';
import { PaginationSection } from '../../admin/user-management/components/PaginationSection';
import { createAssessmentColumns } from '../utils/assessmentColumns';
import type { AssessmentStudent, AssessmentSummary } from '../types/classroom.types';

interface AssessmentTabProps {
  students: AssessmentStudent[];
  summary: AssessmentSummary;
}

const ITEMS_PER_PAGE = 10;

export default function AssessmentTab({ students, summary }: AssessmentTabProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return students.slice(startIndex, endIndex);
  }, [students, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const columns = useMemo(() => createAssessmentColumns(), []);

  // Handle empty state
  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Student Assessment Data</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            There are no students enrolled in this class yet, or assessment data hasn't been recorded. Students need to be enrolled and complete assessments for data to appear here.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/user-management/create/student')}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Students
            </button>
            <p className="text-xs text-gray-400">
              Students can be added through User Management
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          data={paginatedStudents}
          columns={columns}
          isLoading={false}
          headerTheme="orange"
        />

        <PaginationSection
          currentPage={currentPage}
          totalItems={students.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}