import type { ClassroomClass, ClassroomStudent, BroadsheetData } from '../types/classroom.types';

export const mockClasses: ClassroomClass[] = [
  {
    id: 'jss1',
    name: 'JSS 1',
    level: 'JSS',
    arm: 'A',
    teacher: {
      id: 'teacher1',
      name: 'Andrew Jones',
    },
    studentCount: 25,
    color: 'bg-yellow-100 border-yellow-200',
  },
  {
    id: 'jss2',
    name: 'JSS 2',
    level: 'JSS',
    arm: 'A', 
    teacher: {
      id: 'teacher2',
      name: 'Andrew Jones',
    },
    studentCount: 40,
    color: 'bg-blue-100 border-blue-200',
  },
  {
    id: 'jss3',
    name: 'JSS 3',
    level: 'JSS',
    arm: 'A',
    teacher: {
      id: 'teacher3', 
      name: 'Andrew Jones',
    },
    studentCount: 40,
    color: 'bg-green-100 border-green-200',
  },
  {
    id: 'sss1',
    name: 'SSS 1',
    level: 'SSS',
    arm: 'A',
    teacher: {
      id: 'teacher4',
      name: 'Andrew Jones',
    },
    studentCount: 35,
    color: 'bg-pink-100 border-pink-200',
  },
  {
    id: 'sss2',
    name: 'SSS 2', 
    level: 'SSS',
    arm: 'A',
    teacher: {
      id: 'teacher5',
      name: 'Andrew Jones',
    },
    studentCount: 40,
    color: 'bg-cyan-100 border-cyan-200',
  },
  {
    id: 'sss3',
    name: 'SSS 3',
    level: 'SSS', 
    arm: 'A',
    teacher: {
      id: 'teacher6',
      name: 'Andrew Jones',
    },
    studentCount: 40,
    color: 'bg-purple-100 border-purple-200',
  },
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
  'English', 'Maths', 'Social studies', 'Basic science', 'Basic science', 
  'Basic science', 'Basic science', 'Basic science', 'Basic science', 'Basic science'
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