import { Injectable } from '@angular/core';
import { environment } from '../../shared/environment.env';
import { HttpClient } from '@angular/common/http';
import { currentExam, Exam } from '../../shared/models/exam';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Results,StudentAnswer } from '../../shared/models/results';
import { Auth } from '../../auth/services/auth';


@Injectable({
  providedIn: 'root',
})
export class ManageExams {
  env = environment;
  baseUrl = this.env.baseUrl;
  private TOKEN_KEY = 'token';

  constructor(private _http: HttpClient, private _auth:Auth) {
    
  }
  // Exam Management
  createExam(examData: Exam) {
    return this._http.post(`${this.baseUrl}/exams`, examData )
  }

  editExam(examId: string, examData: Exam) {
    return this._http.put(`${this.baseUrl}/exams/${examId}`, examData )
  }
  deleteExam(examId: string) {
    return this._http.delete(`${this.baseUrl}/exams/${examId}` )  
  }

  getAllExams() : Observable<currentExam[]> {
    return this._http.get<currentExam[]>(`${this.baseUrl}/exams` )
  }

  getExamById(examId: string) : Observable<currentExam> {
    return this._http.get<currentExam>(`${this.baseUrl}/exams/${examId}` )
  }
  
  // Results Management
  calculateScore(answers: string[], examId:string) {
    return this.getExamById(examId).pipe(
      map(exam => { 
        const totalQuestions = exam.totalQuestions;
        let totalCorrectAnswers = 0;
        
        exam.questions.forEach((question, index) => {
          if (answers[index] === question.correctAnswer) {
            totalCorrectAnswers++;
          }
        });
  
        const score =Math.round((totalCorrectAnswers / totalQuestions) * 100);
        const passed = score >= exam.passingScore;
        return { score, passed,  totalCorrectAnswers, totalQuestions};
    })
  );

    
  }

  getStudentAnswersArray(answers: string[], examId:string) {
    return this.getExamById(examId).pipe(
      map(exam => {  
            let studentAnswers: StudentAnswer[] = [];
            exam.questions.forEach((question, index) => {
            studentAnswers.push({
            questionText: question.questionText,
            selectedAnswer: answers[index],
            correctAnswer: question.correctAnswer,
            isCorrect: answers[index] === question.correctAnswer
          });
        });
         return { answers: studentAnswers };
      })
    );

   
  }

  getResultsByExamId(examId: string): Observable<Results[]> {
    return this._http.get<Results[]>(`${this.baseUrl}/results/examId?=${examId}`);
  }

  submitResult(resultData: Results): Observable<Results> {
    return this._http.post<Results>(`${this.baseUrl}/results`, resultData);
  }

  getResultsByStudentId(): Observable<Results[]> {
   return this._auth.getcurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this._http.get<Results[]>(`${this.baseUrl}/results?studentId?=${user.id}`);
        } else {
          return new Observable<Results[]>(subscriber => {
            subscriber.next([]);
            subscriber.complete();
          });
        }
      })
     );
  }

  getExamsNotTakenByStudent() : Observable<currentExam[]> {
   return combineLatest([
      this.getAllExams(),
      this.getResultsByStudentId()
    ]).pipe(
      map(([exams, results]) => {
        const takenExamIds = results.map(result => result.examId);
        return exams.filter(exam => !takenExamIds.includes(exam.id));
      })
    );
   
  }

  getExamsTakenByStudent() : Observable<currentExam[]> {
    return combineLatest([
       this.getAllExams(),
       this.getResultsByStudentId()
     ]).pipe(
       map(([exams, results]) => {
         const takenExamIds = results.map(result => result.examId);
         return exams.filter(exam => takenExamIds.includes(exam.id));
       })
     );
  }

  getResultByExamIdAndStudentId(examId: string): Observable<Results> {
    return this._auth.getcurrentUser().pipe(
      switchMap(user => {
        if (user && user.id) {
           return this._http.get<Results>(`${this.baseUrl}/results?examId=${examId}&studentId=${user.id}`).pipe(
            map(results => {
              if (Array.isArray(results) && results.length > 0) {
                return results[0];
              } else {
                return {} as Results;
              }
            })
           );
        } else {
          console.warn("No user found in auth service");
          return new Observable<Results>(subscriber => {
            subscriber.next({} as Results);
            subscriber.complete();
          });
        }
      })
     );
   
  }


}
