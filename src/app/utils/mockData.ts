// Mock data for the school management system

export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  grade: string;
  class: string;
  parentId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  subject: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  password: string;
  studentId: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
  teacherId: string;
  class: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  answers: number[];
  submittedAt: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface FeePayment {
  id: string;
  studentId: string;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

// Initialize mock data
export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    email: 'alice@student.com',
    password: 'password',
    grade: '10',
    class: '10A',
    parentId: 'p1'
  },
  {
    id: 's2',
    name: 'Bob Smith',
    email: 'bob@student.com',
    password: 'password',
    grade: '10',
    class: '10A',
    parentId: 'p2'
  },
  {
    id: 's3',
    name: 'Carol Davis',
    email: 'carol@student.com',
    password: 'password',
    grade: '10',
    class: '10B',
    parentId: 'p3'
  }
];

export const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Mr. Anderson',
    email: 'anderson@teacher.com',
    password: 'password',
    subject: 'Mathematics'
  },
  {
    id: 't2',
    name: 'Ms. Williams',
    email: 'williams@teacher.com',
    password: 'password',
    subject: 'Science'
  }
];

export const mockParents: Parent[] = [
  {
    id: 'p1',
    name: 'Mary Johnson',
    email: 'mary@parent.com',
    password: 'password',
    studentId: 's1'
  },
  {
    id: 'p2',
    name: 'John Smith',
    email: 'john@parent.com',
    password: 'password',
    studentId: 's2'
  },
  {
    id: 'p3',
    name: 'Sarah Davis',
    email: 'sarah@parent.com',
    password: 'password',
    studentId: 's3'
  }
];

export const mockExams: Exam[] = [
  {
    id: 'e1',
    title: 'Mathematics Mid-Term',
    subject: 'Mathematics',
    date: '2026-03-20',
    duration: 60,
    totalMarks: 100,
    teacherId: 't1',
    class: '10A',
    questions: [
      {
        id: 'q1',
        question: 'What is the value of π (pi) approximately?',
        options: ['3.14159', '2.71828', '1.41421', '2.23607'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Solve: 2x + 5 = 15. What is x?',
        options: ['5', '10', '7.5', '20'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        question: 'What is the area of a circle with radius 5?',
        options: ['78.54', '31.42', '15.71', '50'],
        correctAnswer: 0
      },
      {
        id: 'q4',
        question: 'What is the square root of 144?',
        options: ['12', '14', '10', '16'],
        correctAnswer: 0
      },
      {
        id: 'q5',
        question: 'If a triangle has angles 60°, 60°, what is the third angle?',
        options: ['60°', '45°', '90°', '30°'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'e2',
    title: 'Science Chapter Test',
    subject: 'Science',
    date: '2026-03-25',
    duration: 45,
    totalMarks: 50,
    teacherId: 't2',
    class: '10A',
    questions: [
      {
        id: 'q1',
        question: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'O2', 'H2'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Which planet is known as the Red Planet?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        question: 'What is the speed of light?',
        options: ['299,792 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
        correctAnswer: 0
      }
    ]
  }
];

export const mockExamResults: ExamResult[] = [
  {
    id: 'r1',
    examId: 'e2',
    studentId: 's1',
    score: 45,
    totalMarks: 50,
    answers: [0, 0, 0],
    submittedAt: '2026-03-10T10:30:00'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    from: 't1',
    to: 's1',
    subject: 'Homework Reminder',
    content: 'Please complete Chapter 5 exercises by Friday.',
    date: '2026-03-14',
    read: false
  },
  {
    id: 'm2',
    from: 'p1',
    to: 't1',
    subject: 'Meeting Request',
    content: 'I would like to discuss my child\'s progress. Can we schedule a meeting?',
    date: '2026-03-13',
    read: true
  }
];

export const mockFeePayments: FeePayment[] = [
  {
    id: 'f1',
    studentId: 's1',
    month: 'January 2026',
    amount: 500,
    status: 'paid',
    dueDate: '2026-01-05',
    paidDate: '2026-01-03'
  },
  {
    id: 'f2',
    studentId: 's1',
    month: 'February 2026',
    amount: 500,
    status: 'paid',
    dueDate: '2026-02-05',
    paidDate: '2026-02-04'
  },
  {
    id: 'f3',
    studentId: 's1',
    month: 'March 2026',
    amount: 500,
    status: 'pending',
    dueDate: '2026-03-05'
  },
  {
    id: 'f4',
    studentId: 's1',
    month: 'April 2026',
    amount: 500,
    status: 'pending',
    dueDate: '2026-04-05'
  }
];

// Helper function to initialize localStorage with mock data
export function initializeMockData() {
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(mockStudents));
  }
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify(mockTeachers));
  }
  if (!localStorage.getItem('parents')) {
    localStorage.setItem('parents', JSON.stringify(mockParents));
  }
  if (!localStorage.getItem('exams')) {
    localStorage.setItem('exams', JSON.stringify(mockExams));
  }
  if (!localStorage.getItem('examResults')) {
    localStorage.setItem('examResults', JSON.stringify(mockExamResults));
  }
  if (!localStorage.getItem('messages')) {
    localStorage.setItem('messages', JSON.stringify(mockMessages));
  }
  if (!localStorage.getItem('feePayments')) {
    localStorage.setItem('feePayments', JSON.stringify(mockFeePayments));
  }
}
