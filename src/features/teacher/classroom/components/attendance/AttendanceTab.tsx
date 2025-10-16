import { useState, useMemo } from 'react';
import { Download, Check } from 'lucide-react';
import { generateMockStudents, generateMockAttendance, generateStudentAttendanceStats, mockSubjectSchedules } from '../../data/mockData';
import StudentDetailModal from '../StudentDetailModal';
import type { ClassroomStudent, MonthlyAttendance, AttendanceRecord, StudentAttendanceStats, SubjectScheduleConfig } from '../../types/classroom.types';

interface AttendanceTabProps {
  subjectName?: string; // e.g., "Biology", "Mathematics"
  scheduleConfig?: SubjectScheduleConfig;
}

export default function AttendanceTab({ subjectName = 'Biology', scheduleConfig }: AttendanceTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedStudent, setSelectedStudent] = useState<ClassroomStudent | null>(null);
  const [selectedStudentStats, setSelectedStudentStats] = useState<StudentAttendanceStats | null>(null);

  // Get subject schedule (from prop or mock data)
  const subjectSchedule = scheduleConfig || mockSubjectSchedules[subjectName] || { daysPerWeek: ['Monday', 'Wednesday', 'Friday'] };

  // Generate mock students and attendance data
  const students = useMemo(() => generateMockStudents('jss2', 18), []);
  const [attendanceData, setAttendanceData] = useState<MonthlyAttendance>(() =>
    generateMockAttendance(students, selectedMonth, selectedYear, subjectSchedule)
  );

  // Map day names to JS day numbers
  const DAY_MAP = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
  };

  // Get only the scheduled class dates in the current month
  const scheduledDatesInMonth = useMemo(() => {
    const dates: Date[] = [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const scheduledDayNumbers = subjectSchedule.daysPerWeek.map(day => DAY_MAP[day]);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const dayOfWeek = date.getDay();

      // Only include if this day is in the subject's schedule
      if (scheduledDayNumbers.includes(dayOfWeek)) {
        dates.push(date);
      }
    }

    return dates;
  }, [selectedMonth, selectedYear, subjectSchedule]);

  // Get attendance record for a specific student and date
  const getAttendanceRecord = (studentId: string, date: Date): AttendanceRecord | undefined => {
    return attendanceData.records.find(
      r => r.studentId === studentId &&
           new Date(r.date).toDateString() === date.toDateString()
    );
  };

  // Toggle attendance
  const toggleAttendance = (studentId: string, date: Date) => {
    setAttendanceData(prev => {
      const recordIndex = prev.records.findIndex(
        r => r.studentId === studentId &&
             new Date(r.date).toDateString() === date.toDateString()
      );

      if (recordIndex !== -1) {
        const newRecords = [...prev.records];
        newRecords[recordIndex] = {
          ...newRecords[recordIndex],
          isPresent: !newRecords[recordIndex].isPresent,
        };
        return { ...prev, records: newRecords };
      }

      return prev;
    });
  };

  // Calculate total days present for each student
  const getStudentPresentDays = (studentId: string): number => {
    return attendanceData.records.filter(r => r.studentId === studentId && r.isPresent).length;
  };

  // Handle row click to open modal
  const handleRowClick = (student: ClassroomStudent) => {
    setSelectedStudent(student);
    const stats = generateStudentAttendanceStats(student.id, attendanceData);
    setSelectedStudentStats(stats);
  };

  // Handle month/year change
  const handlePeriodChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setAttendanceData(generateMockAttendance(students, month, year, subjectSchedule));
  };

  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Export attendance data');
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Total Students:</span>
            <span className="text-lg font-bold text-gray-900">{students.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Present:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded border border-green-500 bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Absent:</span>
            <div className="w-4 h-4 rounded border border-gray-300 bg-white"></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => handlePeriodChange(Number(e.target.value), selectedYear)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2025, i, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => handlePeriodChange(selectedMonth, Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Student Name
                </th>
                {scheduledDatesInMonth.map((date, i) => {
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNumber = date.getDate();

                  return (
                    <th key={i} className="px-3 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                      <div className="flex flex-col">
                        <span className="uppercase">{dayName}</span>
                        <span className="text-gray-700 font-semibold">{dayNumber}</span>
                      </div>
                    </th>
                  );
                })}
                <th className="sticky right-0 z-10 bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                  Total days present
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, studentIndex) => {
                const presentDays = getStudentPresentDays(student.id);

                return (
                  <tr
                    key={student.id}
                    onClick={() => handleRowClick(student)}
                    className={`cursor-pointer hover:bg-orange-50 transition-colors ${
                      studentIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="sticky left-0 z-10 px-6 py-4 whitespace-nowrap border-r border-gray-200 bg-inherit">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-600">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    {scheduledDatesInMonth.map((date, dateIndex) => {
                      const record = getAttendanceRecord(student.id, date);
                      const isPresent = record?.isPresent ?? false;

                      return (
                        <td
                          key={dateIndex}
                          className="px-4 py-4 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAttendance(student.id, date);
                          }}
                        >
                          <div className="flex items-center justify-center">
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                                isPresent
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-white border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {isPresent && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="sticky right-0 z-10 px-6 py-4 text-center whitespace-nowrap border-l border-gray-200 bg-inherit">
                      <span className="text-sm font-medium text-gray-900">{presentDays}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && selectedStudentStats && (
        <StudentDetailModal
          student={selectedStudent}
          attendanceStats={selectedStudentStats}
          onClose={() => {
            setSelectedStudent(null);
            setSelectedStudentStats(null);
          }}
        />
      )}
    </div>
  );
}
