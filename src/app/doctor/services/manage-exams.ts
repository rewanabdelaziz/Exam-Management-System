import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../shared/environment.env';
import { HttpClient } from '@angular/common/http';
import { currentExam, Exam } from '../../shared/models/exam';
import { map, Observable, tap, of, switchMap, forkJoin } from 'rxjs';
import { Results, StudentAnswer } from '../../shared/models/results';
import { Auth } from '../../auth/services/auth';
import { User } from '../../shared/models/student';

export interface resData<T>{
  [key: string]: T
}

@Injectable({
  providedIn: 'root',
})
export class ManageExams {
  baseUrl = environment.baseUrl;

  private examsSignal = signal<currentExam[]>([]);
  private resultsSignal = signal<Results[]>([]);
  private studentsSignal = signal<User[]>([]);

  readonly allExams = this.examsSignal.asReadonly();
  readonly allResults = this.resultsSignal.asReadonly();


  constructor(private _http: HttpClient, private _auth: Auth) {
    this.refreshExams();
    this.refreshResults();
    this.refreshStudents()
  }

  // --- Refresh Methods ---
  refreshExams() {
    this._http.get<resData<currentExam>>(`${this.baseUrl}/exams.json`).pipe(
      map(res =>{
        const exams =  res? Object.keys(res).map(key => ({...res[key], _id:key})) : []
        return exams
      } )
    ).subscribe(data => this.examsSignal.set(data));
  }

  refreshResults() {
    this._http.get<resData<Results>>(`${this.baseUrl}/results.json`).pipe(
     map(res =>{
        const results =  res? Object.keys(res).map(key => ({...res[key], _id:key})) : []
        return results
      } )
    ).subscribe(data => this.resultsSignal.set(data));
  }

  refreshStudents() {
    this._auth.getAllStudents().subscribe(data => this.studentsSignal.set(data));
  }



  // --- Exam Management ---
  createExam(examData: Exam) {
    return this._http.post<{name:string}>(`${this.baseUrl}/exams.json`, examData).pipe(
      tap(res => {
        const examWithId :currentExam =  {...examData,_id:res.name}
        this.examsSignal.update(exams => [...exams, examWithId]);
      })
    );
  }

  editExam(examId: string, examData: Exam) {
    return this._http.put<Exam>(`${this.baseUrl}/exams/${examId}.json`, examData).pipe(
      tap(updatedExam => {
        const examWithId :currentExam =  {...examData, _id:examId}
        this.examsSignal.update(exams => exams.map(e => e._id === examId ? examWithId : e));
      })
    );
  }

  deleteExam(examId: string) {
    return this._http.delete(`${this.baseUrl}/exams/${examId}.json`).pipe(
      switchMap(() => this.deleteResultsByExamId(examId)),
      tap(() => {
        this.examsSignal.update(exams => exams.filter(e => e._id !== examId));
      })
    );
    

  }
  


  getExamById(examId: string): Observable<currentExam> {
    return this._http.get<Exam>(`${this.baseUrl}/exams/${examId}.json`).pipe(
      map(res =>({...res, _id:examId} as currentExam) )
    );
  }

  // --- Results Management ---
  submitResult(resultData: Results): Observable<any> {
    const payload = { ...resultData };
    delete (payload as any)._id; 
  
    return this._http.post<{name:string}>(`${this.baseUrl}/results.json`, payload).pipe(
      tap(res => {
        const resWithId =  {...payload, _id: res.name}
        this.resultsSignal.update(all => [...all, resWithId]);
      })
    );
  }

  getResultsByExamId(examId: string): Observable<Results[]> {
    return of(this.resultsSignal().filter(r => r.examId === examId));
  }

  deleteResultsByExamId(examId:string){
    const resultsToDelete = this.resultsSignal().filter(r=> r.examId === examId)
    if(resultsToDelete.length === 0) return of(null)

    const requests = resultsToDelete.map(r =>
      this._http.delete(`${this.baseUrl}/results/${r._id}.json`)
    );

    return forkJoin(requests).pipe(
      tap(() => {
        this.resultsSignal.update(res => res.filter(r => r.examId !== examId));
      })
    )

  }

  getResultsByStudentId(): Observable<Results[]> {
    return this._auth.getcurrentUser().pipe(
      switchMap(user => {
        if (!user) return of([]);
        return this._http.get<resData<Results>>(`${this.baseUrl}/results.json`).pipe(
          map(res =>{
            const allResults = res ? Object.keys(res).map(key => ({ ...res[key], _id: key })) : [];
            return allResults.filter(r => r.studentId === user._id)
          })
        );
      })
    );
  }

   getResultByExamIdAndStudentId(examId: string): Observable<Results> {

    const user = this._auth.currentUser();
    if (!user) return of({} as Results);
  
    const result = this.resultsSignal().find(s => s.examId === examId && s.studentId === user._id);
    
    if (!result) return of({} as Results); 
    return of(result);
    
  }


  // --- Logic Methods (Calculation) ---
  calculateScore(answers: string[], examId: string) {
    return this.getExamById(examId).pipe(
      map(exam => {
        const totalQuestions = exam.questions.length;
        let totalCorrectAnswers = 0;
        exam.questions.forEach((q, i) => {
          if (answers[i] === q.correctAnswer) totalCorrectAnswers++;
        });
        const score = Math.round((totalCorrectAnswers / totalQuestions) * 100);
        return { score, passed: score >= exam.passingScore, totalCorrectAnswers, totalQuestions };
      })
    );
  }

  getStudentAnswersArray(answers: string[], examId: string) {
    return this.getExamById(examId).pipe(
      map(exam => {
        let studentAnswers: StudentAnswer[] = exam.questions.map((q, i) => ({
          questionText: q.questionText,
          selectedAnswer: answers[i],
          correctAnswer: q.correctAnswer,
          isCorrect: answers[i] === q.correctAnswer
        }));
        return { answers: studentAnswers };
      })
    );
  }

  // --- Filtering Methods ---
 
  readonly examsTaken = computed(() => {
    const user = this._auth.currentUser(); 
    const results = this.resultsSignal(); 
    const exams = this.examsSignal();     
  
    if (!user) return [];
  
    const takenIds = results
      .filter(r => r.studentId === user._id)
      .map(r => r.examId);
  
    return exams.filter(e => takenIds.includes(e._id!));
  });
  
  
  readonly examsNotTaken = computed(() => {
    const user = this._auth.currentUser();
    const results = this.resultsSignal();
    const exams = this.examsSignal();
  
    if (!user) return exams; 
  
    const takenIds = results
      .filter(r => r.studentId === user._id)
      .map(r => r.examId);
  
    return exams.filter(e => !takenIds.includes(e._id!));
  });


 
  // --- Dashboard Detailed  ---
  getAllResultsWithDetails(): Observable<any[]> {
    return of(this.resultsSignal()).pipe(
      map(results => {
        const exams = this.examsSignal();
        return results.map(r => ({
          ...r,
          examTitle: exams.find(e => e._id === r.examId)?.title || 'Unknown Exam'
        }));
      })
    );
  }

  readonly dashboardStats = computed(() => {
    const exams = this.examsSignal();
    const results = this.resultsSignal();
    const students = this.studentsSignal();

    const detailedResults = results.map(r => ({
      ...r,
      examTitle: exams.find(e => e._id === r.examId)?.title || 'Unknown Exam',
      studentName: students.find(s => s._id === r.studentId )?.name || 'Unknown Student'
    }));
  
    const avg = results.length > 0 
      ? Math.round(results.reduce((acc, curr) => acc + (curr.score || 0), 0) / results.length) 
      : 0;
  
    return {
      exams,
      results : detailedResults,
      students,
      summary: {
        totalExams: exams.length,
        totalStudents: students.length,
        avgScore: avg,
        completedTests: results.length
      },
      recentExams: [...exams].slice(-3).reverse(),
      recentResults: [...detailedResults].slice(-3).reverse()
    };
  });
}