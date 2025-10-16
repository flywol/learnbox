import type { TeacherSubject, ClassroomStudent, BroadsheetData, AttendanceRecord, MonthlyAttendance, StudentAttendanceStats, SubjectScheduleConfig } from '../types/classroom.types';

// Teacher subjects - what teachers see in their classroom
export const mockTeacherSubjects: TeacherSubject[] = [
  {
    id: 'biology-jss3',
    name: 'Biology',
    classLevel: 'JSS3',
    studentCount: 40,
    icon: '🧬',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-900'
  },
  {
    id: 'chemistry-jss2',
    name: 'Chemistry',
    classLevel: 'JSS2',
    studentCount: 40,
    icon: '⚗️',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-900'
  },
  {
    id: 'further-maths-ss1-science',
    name: 'Further Maths',
    classLevel: 'SS1 Science',
    studentCount: 40,
    icon: '📐',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-900'
  },
  {
    id: 'chemistry-ss1-art',
    name: 'Chemistry',
    classLevel: 'SS1 Art',
    studentCount: 40,
    icon: '⚗️',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-900'
  },
  {
    id: 'further-maths-ss1-science-2',
    name: 'Further Maths',
    classLevel: 'SS1 Science',
    studentCount: 40,
    icon: '📐',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-900'
  },
  {
    id: 'biology-ss1',
    name: 'Biology',
    classLevel: 'SS1',
    studentCount: 40,
    icon: '🧬',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-900'
  }
];

export const mockStudents: ClassroomStudent[] = [
  {
    id: 'student1',
    name: 'Jane Doe',
    admissionNumber: 'ADM001',
    email: 'janedoe@gmail.com',
    dateOfBirth: '21/07/2007',
    gender: 'Female',
    classLevel: 'JSS3',
    classArm: 'A',
    session: '2023/2024',
    term: '1st',
    parentName: 'Paula Doe',
    parentContact: '+234 805 123 4567',
  },
  {
    id: 'student2', 
    name: 'Nwachukwu Joyce',
    admissionNumber: 'ADM002',
    email: 'joyce@gmail.com',
    dateOfBirth: '15/03/2007',
    gender: 'Female',
    classLevel: 'JSS2',
    classArm: 'A', 
    session: '2023/2024',
    term: '1st',
    parentName: 'Paul Nwachukwu',
    parentContact: '+234 803 456 7890',
  },
  {
    id: 'student3',
    name: 'Ogunriade Adeyemi',
    admissionNumber: 'ADM003', 
    email: 'adeyemi@gmail.com',
    dateOfBirth: '12/09/2006',
    gender: 'Male',
    classLevel: 'JSS2',
    classArm: 'A',
    session: '2023/2024',
    term: '1st',
    parentName: 'Mrs. Ogunriade',
    parentContact: '+234 807 234 5678',
  },
  {
    id: 'student4',
    name: 'James Doe',
    admissionNumber: 'ADM004',
    email: 'james@gmail.com',
    dateOfBirth: '08/11/2007',
    gender: 'Male', 
    classLevel: 'JSS2',
    classArm: 'A',
    session: '2023/2024',
    term: '1st',
    parentName: 'John Doe',
    parentContact: '+234 809 876 5432',
  },
];

// Generate more students for JSS 2 class
export const generateMockStudents = (classId: string, count: number): ClassroomStudent[] => {
  const names = [
    'Jane Doe', 'James Doe', 'Nwachukwu Joyce', 'Ogunriade Adeyemi',
    'Mary Johnson', 'John Smith', 'Sarah Wilson', 'Michael Brown',
    'Lisa Davis', 'David Miller', 'Emma Taylor', 'Robert Wilson',
    'Sophie Anderson', 'Daniel Thomas', 'Grace Jackson', 'Samuel White',
    'Olivia Martin', 'Benjamin Harris', 'Ava Thompson', 'William Garcia'
  ];
  
  return Array.from({ length: count }, (_, index) => ({
    id: `${classId}-student-${index + 1}`,
    name: names[index % names.length],
    admissionNumber: `ADM${String(index + 1).padStart(3, '0')}`,
    email: `student${index + 1}@school.edu`,
    dateOfBirth: '21/07/2007',
    gender: (index % 2 === 0 ? 'Female' : 'Male') as 'Male' | 'Female',
    classLevel: classId.toUpperCase(),
    classArm: 'A',
    session: '2023/2024',
    term: '1st', 
    parentName: `Parent of ${names[index % names.length]}`,
    parentContact: `+234 80${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
  }));
};

const subjects = [
  'English', 'Maths', 'Social studies', 'Basic science', 'Computer studies', 
  'Physical education', 'French', 'Fine arts', 'Music', 'Home economics'
];

export const mockBroadsheetData: BroadsheetData = {
  classId: 'jss2',
  session: '2022/2023',
  term: 'FIRST TERM',
  students: generateMockStudents('jss2', 13),
  subjects,
  grades: generateMockStudents('jss2', 13).flatMap(student => 
    subjects.map(subject => ({
      studentId: student.id,
      subject,
      score: Math.random() > 0.3 ? 50 : null, // Some students have no scores
    }))
  ),
};

// NOTE: Lesson mock data has been removed - now using real API via lessonsApiClient
// Lesson data is fetched from /api/v1/teacher/lessons endpoints

// Attendance Mock Data - keeping until attendance endpoint is provided

// Map day names to JS day numbers (0=Sunday, 1=Monday, etc.)
const DAY_MAP = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
};

// Helper to get scheduled class dates for a subject in a month
const getScheduledDatesInMonth = (
  month: number,
  year: number,
  scheduledDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[]
): Date[] => {
  const scheduledDates: Date[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const scheduledDayNumbers = scheduledDays.map(day => DAY_MAP[day]);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Only include if this day is in the subject's schedule
    if (scheduledDayNumbers.includes(dayOfWeek)) {
      scheduledDates.push(date);
    }
  }

  return scheduledDates;
};

export const generateMockAttendance = (
  students: ClassroomStudent[],
  month: number,
  year: number,
  scheduleConfig?: SubjectScheduleConfig
): MonthlyAttendance => {
  // Default schedule: Mon, Wed, Fri (3 days per week - typical for most subjects)
  const scheduledDays = scheduleConfig?.daysPerWeek || ['Monday', 'Wednesday', 'Friday'];
  const scheduledDates = getScheduledDatesInMonth(month, year, scheduledDays);
  const totalDays = scheduledDates.length;

  const records: AttendanceRecord[] = [];

  students.forEach(student => {
    // Generate random attendance for each scheduled day
    scheduledDates.forEach(date => {
      // Random attendance: ~70% present
      const isPresent = Math.random() > 0.3;

      records.push({
        studentId: student.id,
        date: date.toISOString(),
        isPresent,
      });
    });
  });

  return {
    month,
    year,
    totalDays,
    records,
    scheduledDays,
  };
};

// Generate student attendance stats for modal
export const generateStudentAttendanceStats = (studentId: string, attendanceData: MonthlyAttendance): StudentAttendanceStats => {
  const studentRecords = attendanceData.records.filter(r => r.studentId === studentId);
  const attendedClasses = studentRecords.filter(r => r.isPresent).length;
  const totalClasses = studentRecords.length;
  const missedClasses = totalClasses - attendedClasses;

  return {
    attendancePercentage: Math.round((attendedClasses / totalClasses) * 100),
    totalClasses,
    attendedClasses,
    missedClasses,
    assignmentCompleted: Math.floor(Math.random() * 3) + 1, // Random 1-3
    assignmentTotal: 5,
    averageTestScore: Math.floor(Math.random() * 40) + 50, // Random 50-90
    totalGrade: Math.floor(Math.random() * 30) + 70, // Random 70-100
  };
};

// Mock attendance data for JSS2 Biology class (Mon, Wed, Fri schedule)
export const mockAttendanceData = generateMockAttendance(
  generateMockStudents('jss2', 18),
  1, // January
  2025,
  { daysPerWeek: ['Monday', 'Wednesday', 'Friday'] }
);

// Mock subject schedule configurations (for different subjects)
export const mockSubjectSchedules: Record<string, SubjectScheduleConfig> = {
  'Biology': { daysPerWeek: ['Monday', 'Wednesday', 'Friday'] },
  'Chemistry': { daysPerWeek: ['Tuesday', 'Thursday'] },
  'Mathematics': { daysPerWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  'English': { daysPerWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  'Physics': { daysPerWeek: ['Monday', 'Thursday'] },
  'Further Maths': { daysPerWeek: ['Tuesday', 'Wednesday', 'Friday'] },
};