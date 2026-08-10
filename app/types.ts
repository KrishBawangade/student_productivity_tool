export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  xp: number;
  completed: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  codeSnippet?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CourseGrade {
  id: string;
  code: string;
  name: string;
  currentGrade: number;
  targetGrade: number;
  color: string;
}
