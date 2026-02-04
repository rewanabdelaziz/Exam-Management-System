export interface Question {
  id?: string;
  questionText: string;
  options: string[]; 
  correctAnswer: string;
}
export interface Exam {
    title: string;
    description: string;
    duration: number; 
    totalQuestions: number;
    passingScore: number;
    dateOfCreation: Date;
    questions: Question[];
}
export interface currentExam extends Exam {
   _id?: string;
}

