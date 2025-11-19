import { StudentQuiz } from '../types/classroom.types';

// Mock quiz data - keeping until quiz endpoint is provided
export const mockStudentQuizzes: StudentQuiz[] = [
  {
    id: '1',
    title: 'Week 2 Quiz',
    subjectId: 'biology-1',
    dueDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '14:30',
    duration: 20,
    instruction: 'Complete all questions within the time limit. Select the most appropriate answer for each question.',
    status: 'pending',
    questions: [
      {
        id: '1',
        question: 'Select all reptiles',
        type: 'text-only',
        options: [
          { label: 'A', value: 'Ostrich' },
          { label: 'B', value: 'Crocodile' },
          { label: 'C', value: 'Hawk' },
          { label: 'D', value: 'Snake' }
        ],
        correctAnswers: ['B', 'D'],
        points: 5
      },
      {
        id: '2',
        question: 'Which of the following is cold-blooded?',
        type: 'text-with-image',
        options: [
          { label: 'A', value: 'Lizard', image: 'https://images.unsplash.com/photo-1567495111105-c2c2b90f0d7f?w=400' },
          { label: 'B', value: 'Bear', image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400' },
          { label: 'C', value: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
          { label: 'D', value: 'Bird', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400' }
        ],
        correctAnswers: ['A'],
        points: 5
      },
      {
        id: '3',
        question: 'What class of animal does the following belong to?',
        type: 'image-with-text',
        image: 'https://images.unsplash.com/photo-1503918756811-0bd64d76a5bb?w=400',
        options: [
          { label: 'A', value: 'Mammal' },
          { label: 'B', value: 'Bird' },
          { label: 'C', value: 'Reptile' },
          { label: 'D', value: 'Amphibian' }
        ],
        correctAnswers: ['D'],
        points: 5
      }
    ]
  },
  {
    id: '2',
    title: 'Week 2 Quiz',
    subjectId: 'biology-1',
    dueDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '16:00',
    duration: 30,
    instruction: 'Complete all questions within the time limit.',
    status: 'pending',
    questions: [
      {
        id: '1',
        question: 'What is the powerhouse of the cell?',
        type: 'text-only',
        options: [
          { label: 'A', value: 'Nucleus' },
          { label: 'B', value: 'Mitochondria' },
          { label: 'C', value: 'Ribosome' },
          { label: 'D', value: 'Chloroplast' }
        ],
        correctAnswers: ['B'],
        points: 5
      }
    ]
  },
  {
    id: '3',
    title: 'Everyday physics',
    subjectId: 'biology-1',
    dueDate: '2023-09-15',
    dueTime: '12:43',
    duration: 25,
    instruction: 'Answer all questions to the best of your ability.',
    status: 'graded',
    score: 10,
    totalPoints: 15,
    submittedAt: '2023-09-15T12:43:00',
    questions: [
      {
        id: '1',
        question: 'Select all reptiles',
        type: 'text-only',
        options: [
          { label: 'A', value: 'Ostrich' },
          { label: 'B', value: 'Crocodile' },
          { label: 'C', value: 'Hawk' },
          { label: 'D', value: 'Snake' }
        ],
        correctAnswers: ['B', 'D'],
        points: 5
      },
      {
        id: '2',
        question: 'Which of the following is cold-blooded?',
        type: 'text-with-image',
        options: [
          { label: 'A', value: 'Lizard', image: 'https://images.unsplash.com/photo-1567495111105-c2c2b90f0d7f?w=400' },
          { label: 'B', value: 'Bear', image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400' },
          { label: 'C', value: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
          { label: 'D', value: 'Bird', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400' }
        ],
        correctAnswers: ['A'],
        points: 5
      },
      {
        id: '3',
        question: 'What class of animal does the following belong to?',
        type: 'image-with-text',
        image: 'https://images.unsplash.com/photo-1503918756811-0bd64d76a5bb?w=400',
        options: [
          { label: 'A', value: 'Mammal' },
          { label: 'B', value: 'Bird' },
          { label: 'C', value: 'Reptile' },
          { label: 'D', value: 'Amphibian' }
        ],
        correctAnswers: ['D'],
        points: 5
      }
    ]
  },
  {
    id: '4',
    title: 'Everyday physics',
    subjectId: 'biology-1',
    dueDate: '2023-09-15',
    dueTime: '12:43',
    duration: 25,
    instruction: 'Answer all questions carefully.',
    status: 'graded',
    score: 15,
    totalPoints: 15,
    submittedAt: '2023-09-15T12:43:00',
    questions: []
  }
];
