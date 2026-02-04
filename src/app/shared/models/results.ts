export interface Results { 
   _id?: string;             
  examId: string;            
  studentId: string;         

  score: number;             
  passed: boolean;           

  TotalcorrectAnswers: number;    
  totalQuestions: number;    

  startedAt: string;          
  submittedAt: string;        
  durationInMinutes: number; 

  answers: StudentAnswer[];   
}

export interface StudentAnswer {
  questionText: string;      
  selectedAnswer: string;    
  correctAnswer: string;     
  isCorrect: boolean;
}


