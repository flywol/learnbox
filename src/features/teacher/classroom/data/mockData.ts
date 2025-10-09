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
        title: 'Cell Structure and Function',
        contents: [
          {
            id: 'content-3-1',
            title: 'The Cell: Basic Unit of Life',
            description: 'Introduction to cell structure and organelles',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-3-2',
            title: 'Plant vs Animal Cells',
            description: 'Comparing different cell types',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-3-3',
            title: 'Cell Structure Quiz',
            description: 'Test your knowledge on cell components',
            type: 'quiz',
            icon: '📊'
          }
        ]
      },
      {
        id: 'lesson-4',
        number: 4,
        title: 'Photosynthesis and Respiration',
        contents: [
          {
            id: 'content-4-1',
            title: 'The Process of Photosynthesis',
            description: 'How plants make their own food',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-4-2',
            title: 'Cellular Respiration',
            description: 'Energy production in cells',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-4-3',
            title: 'Photosynthesis Lab Report',
            description: 'Submit your lab observations',
            type: 'assignment',
            icon: '📝'
          }
        ]
      },
      {
        id: 'lesson-5',
        number: 5,
        title: 'Genetics and Heredity',
        contents: [
          {
            id: 'content-5-1',
            title: 'Introduction to Genetics',
            description: 'Understanding DNA and genes',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-5-2',
            title: 'Mendelian Genetics',
            description: 'Laws of inheritance',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-5-3',
            title: 'Punnett Square Practice',
            description: 'Genetics problem set',
            type: 'assignment',
            icon: '📝'
          },
          {
            id: 'content-5-4',
            title: 'Genetics Quiz',
            description: 'Assessment on heredity',
            type: 'quiz',
            icon: '📊'
          }
        ]
      },
      {
        id: 'lesson-6',
        number: 6,
        title: 'Evolution and Natural Selection',
        contents: [
          {
            id: 'content-6-1',
            title: "Darwin's Theory of Evolution",
            description: 'The origin of species',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-6-2',
            title: 'Evidence for Evolution',
            description: 'Fossil records and comparative anatomy',
            type: 'document',
            icon: '📄'
          }
        ]
      },
      {
        id: 'lesson-7',
        number: 7,
        title: 'Ecology and Ecosystems',
        contents: [
          {
            id: 'content-7-1',
            title: 'Introduction to Ecology',
            description: 'Organisms and their environment',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-7-2',
            title: 'Food Chains and Food Webs',
            description: 'Energy flow in ecosystems',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-7-3',
            title: 'Ecosystem Project',
            description: 'Create your own ecosystem model',
            type: 'assignment',
            icon: '📝'
          }
        ]
      },
      {
        id: 'lesson-8',
        number: 8,
        title: 'Human Body Systems',
        contents: [
          {
            id: 'content-8-1',
            title: 'The Circulatory System',
            description: 'Blood flow and heart function',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-8-2',
            title: 'The Respiratory System',
            description: 'How we breathe',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-8-3',
            title: 'Body Systems Quiz',
            description: 'Test your anatomy knowledge',
            type: 'quiz',
            icon: '📊'
          }
        ]
      },
      {
        id: 'lesson-9',
        number: 9,
        title: 'Microorganisms and Disease',
        contents: [
          {
            id: 'content-9-1',
            title: 'Bacteria, Viruses, and Fungi',
            description: 'Types of microorganisms',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-9-2',
            title: 'The Immune System',
            description: 'How our body fights disease',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-9-3',
            title: 'Disease Prevention',
            description: 'Hygiene and vaccination',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-9-4',
            title: 'Microbiology Assignment',
            description: 'Research project on pathogens',
            type: 'assignment',
            icon: '📝'
          }
        ]
      },
      {
        id: 'lesson-10',
        number: 10,
        title: 'Review and Final Assessment',
        contents: [
          {
            id: 'content-10-1',
            title: 'Course Review',
            description: 'Summary of all topics covered',
            type: 'video',
            icon: '▶️'
          },
          {
            id: 'content-10-2',
            title: 'Study Guide',
            description: 'Key concepts and terms',
            type: 'document',
            icon: '📄'
          },
          {
            id: 'content-10-3',
            title: 'Final Exam',
            description: 'Comprehensive biology assessment',
            type: 'quiz',
            icon: '📊'
          }
        ]
      }
    ]
  }
];

export const getSubjectDetail = (subjectId: string): SubjectDetail | undefined => {
  // Try to find exact match first, otherwise return first subject as fallback
  return mockSubjectDetails.find(subject => subject.id === subjectId) || mockSubjectDetails[0];
};