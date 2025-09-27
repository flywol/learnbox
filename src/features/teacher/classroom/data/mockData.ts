import type { TeacherSubject, ClassroomStudent, BroadsheetData, SubjectDetail } from '../types/classroom.types';

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

// Detailed subject data with lessons and course overview
export const mockSubjectDetails: SubjectDetail[] = [
  {
    id: 'biology-jss3',
    name: 'Biology',
    classLevel: 'SSS 1 Science',
    studentCount: 40,
    icon: '🧬',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-900',
    courseOverview: {
      description: 'Explore the fascinating world of living organisms, from microscopic cells to complex ecosystems. Dive into the science of life, evolution, and the interconnectedness of all living things.',
      progress: 58
    },
    lessons: [
      {
        id: 'lesson-1',
        number: 1,
        title: 'Introduction',
        contents: [
          {
            id: 'content-1-1',
            title: 'Beginning of everything',
            description: 'Learn about how biology began',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-1-2',
            title: 'Introduction',
            description: 'Learn about how biology began',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-1-3',
            title: 'Life and its characteristics',
            description: 'Learn about how biology began',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-1-4',
            title: 'Introduction Quiz',
            description: 'Lesson 1 quiz',
            type: 'quiz',
            icon: '📊'
          },
          {
            id: 'content-1-5',
            title: 'Introduction',
            description: 'Lesson 1 assignment',
            type: 'assignment',
            icon: '📝'
          },
          {
            id: 'content-1-6',
            title: 'Introduction',
            description: 'Take note and download the resources',
            type: 'document',
            icon: '📄'
          }
        ]
      },
      {
        id: 'lesson-2',
        number: 2,
        title: 'Reproduction in Organisms',
        contents: [
          {
            id: 'content-2-1',
            title: 'Sexual Reproduction',
            description: 'Understanding sexual reproduction in organisms',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-2-2',
            title: 'Asexual Reproduction',
            description: 'Learn about asexual reproduction methods',
            type: 'document',
            icon: '📄'
          }
        ]
      },
      {
        id: 'lesson-3',
        number: 3,
        title: 'Reproduction in Organisms',
        contents: []
      },
      {
        id: 'lesson-4',
        number: 4,
        title: 'Introduction',
        contents: []
      },
      {
        id: 'lesson-5',
        number: 5,
        title: 'Introduction',
        contents: []
      },
      {
        id: 'lesson-6',
        number: 6,
        title: 'Introduction',
        contents: []
      },
      {
        id: 'lesson-7',
        number: 7,
        title: 'Introduction',
        contents: []
      },
      {
        id: 'lesson-8',
        number: 8,
        title: 'Introduction',
        contents: []
      },
      {
        id: 'lesson-9',
        number: 9,
        title: 'Introduction',
        contents: []
      },
      {
        id: 'lesson-10',
        number: 10,
        title: 'Introduction',
        contents: []
      }
    ]
  }
];

export const getSubjectDetail = (subjectId: string): SubjectDetail | undefined => {
  return mockSubjectDetails.find(subject => subject.id === subjectId);
};