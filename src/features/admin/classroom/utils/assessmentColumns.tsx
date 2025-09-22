import { ColumnDef } from "@tanstack/react-table";
import type { AssessmentStudent } from "../types/classroom.types";

const formatScore = (score: number | null) => {
  return score !== null ? score.toString() : '--';
};

export const createAssessmentColumns = (): ColumnDef<AssessmentStudent>[] => [
  {
    id: "student",
    header: "Student Name",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">{student.name}</span>
        </div>
      );
    },
  },
  {
    id: "attendance",
    header: "Attendance",
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {formatScore(row.original.attendance)}
      </div>
    ),
  },
  {
    id: "assignment",
    header: "Assignment",
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {formatScore(row.original.assignment)}
      </div>
    ),
  },
  {
    id: "quiz",
    header: "Quiz",
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {formatScore(row.original.quiz)}
      </div>
    ),
  },
  {
    id: "caTest",
    header: "C.A Test",
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {formatScore(row.original.caTest)}
      </div>
    ),
  },
  {
    id: "exam",
    header: "Exam",
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {formatScore(row.original.exam)}
      </div>
    ),
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {formatScore(row.original.total)}
      </div>
    ),
  },
  {
    id: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-900">
        {row.original.grade}
      </div>
    ),
  },
];