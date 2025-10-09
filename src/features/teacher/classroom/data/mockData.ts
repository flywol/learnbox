import type { TeacherSubject, ClassroomStudent, BroadsheetData } from '../types/classroom.types';

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