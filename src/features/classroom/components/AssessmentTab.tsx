import { useState, useMemo, useCallback } from 'react';
import { Table } from '@/common/ui/Table';
import { PaginationSection } from '../../user-management/components/PaginationSection';
import { createAssessmentColumns } from '../utils/assessmentColumns';
import type { AssessmentStudent, AssessmentSummary } from '../types/classroom.types';

interface AssessmentTabProps {
  students: AssessmentStudent[];
  summary: AssessmentSummary;
}

const ITEMS_PER_PAGE = 10;

export default function AssessmentTab({ students, summary }: AssessmentTabProps) {
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