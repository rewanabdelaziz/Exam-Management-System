import { Injectable } from '@angular/core';
import { environment } from '../../shared/environment.env';
import { HttpClient } from '@angular/common/http';
import { currentExam, Exam } from '../../shared/models/exam';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ManageExams {
  env = environment;
  baseUrl = this.env.baseUrl;
  private TOKEN_KEY = 'token';

  constructor(private _http: HttpClient) {
    
  }
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


}
