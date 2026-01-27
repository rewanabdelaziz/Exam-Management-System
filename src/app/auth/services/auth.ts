import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../shared/environment.env';

import { map, Observable, of, tap } from 'rxjs';
import { User } from '../../shared/models/student';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  env = environment;
  baseUrl = this.env.baseUrl;
  private TOKEN_KEY = 'token';

  constructor(private _http: HttpClient) {
    
  }

  createStudentAccount(data: User) {
    return this._http.post(`${this.baseUrl}/students`, data);
  }

  studentLogin(email: string, password: string) {
    return this._http.get<User[]>(`${this.baseUrl}/students?email=${email}&password=${password}`)
    .pipe(
      tap(students => {
        if (students.length === 0) {
          throw new Error('Invalid credentials');
        }

        const student = students[0];

        const fakeToken = btoa(JSON.stringify({
          id: student.id,
          role: 'student',
          exp: Date.now() + (60 * 60 * 1000) // 1 hour expiration
        }));
        localStorage.setItem(this.TOKEN_KEY, fakeToken);
      })

    );
  }

  doctorLogin(email: string, password: string) {
    return this._http.get<User[]>(`${this.baseUrl}/doctors?email=${email}&password=${password}`)
    .pipe(
      tap(doctors => {
        if (doctors.length === 0) {
          throw new Error('Invalid credentials');
        }

        const doctor = doctors[0];

        const fakeToken = btoa(JSON.stringify({
          id: doctor.id,
          role: 'doctor',
          exp: Date.now() + (60 * 60 * 1000) // 1 hour expiration
        }));
        localStorage.setItem(this.TOKEN_KEY, fakeToken);
      })

    );;
  }

  getAllStudentsEmails() {
    return this._http.get<User[]>(`${this.baseUrl}/students`).pipe(
      map(students => students.map(student => student.email))
    );
  }

  getAllStudents() : Observable<User[]> {
    return this._http.get<User[]>(`${this.baseUrl}/students`);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getcurrentUser():Observable<User | null>{
    const token = this.getToken();
    if(!token){
      return of(null);
    }
    const payload = JSON.parse(atob(token));
    if(payload.role==='student'){
      return this._http.get<User>(`${this.baseUrl}/students/${payload.id}`);
    }else{
      return this._http.get<User>(`${this.baseUrl}/doctors/${payload.id}`);
    }
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

}