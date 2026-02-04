import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
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
  currentUser = signal<User | null>(null)

  constructor(private _http: HttpClient) {
    this.autoLogin()
  }
 

  private autoLogin() {
  const token = this.getToken();
  if (token) {
    this.getcurrentUser().subscribe({
      next: (user) => {
        if (user) {
          const mappedUser = { ...user, id: (user as any)._id };
          this.currentUser.set(mappedUser);
          // console.log("User restored after reload:", mappedUser);
        }
      },
      error: (err) => {
        this.logOut(); 
        console.error("Token invalid or expired", err);
        
      }
    });
  }}


  createStudentAccount(data: User) {
    return this._http.post(`${this.baseUrl}/students.json`, data);
  }

  studentLogin(email: string, password: string) {
    
    return this._http.get<{[key: string]: User}>(`${this.baseUrl}/students.json`).pipe(
      map(res =>{
        const students = res? Object.keys(res).map(key => ({...res[key], _id:key})) : []
        const student = students.find(s => s.email === email && s.password === password)
        if (!student) throw new Error('Invalid credentials');
        return student
      }),
      tap((student) => {
        this.currentUser.set(student);
        // console.log("student", student)

        const fakeToken = btoa(
          JSON.stringify({
            id: student._id , 
            role: 'student',
            exp: Date.now() + 60 * 60 * 1000,
          })
        );
        localStorage.setItem(this.TOKEN_KEY, fakeToken);
      })
    );
  }

  doctorLogin(email: string, password: string) {
   
   
    return this._http.get<{ [key: string]: User }>(`${this.baseUrl}/doctors.json`).pipe(
       map(res =>{
        const doctors = res? Object.keys(res).map(key => ({...res[key], _id:key})) : []
        const doctor = doctors.find(s => s.email === email && s.password === password)
        if (!doctor) throw new Error('Invalid credentials');
        return doctor
      }),
      tap((doctor) => {
        this.currentUser.set(doctor);
        // console.log("doctor", doctor)

        const fakeToken = btoa(
          JSON.stringify({
            id: doctor._id ,
            role: 'doctor',
            exp: Date.now() + 60 * 60 * 1000,
          })
        );
        localStorage.setItem(this.TOKEN_KEY, fakeToken);
      })
    );
  }

  getAllStudentsEmails() {
    return this._http.get<{ [key: string]: User }>(`${this.baseUrl}/students.json`).pipe(
      map((res) =>{
        const students = res? Object.keys(res).map(key => ({...res[key], _id:key})) : []
        return students.map((student) => student.email);
      } )
    );
  }

 getAllStudents(): Observable<User[]> {
    return this._http.get<{ [key: string]: User }>(`${this.baseUrl}/students.json`).pipe(
      map(res => res ? Object.keys(res).map(key => ({ ...res[key], _id: key })) : [])
    );
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getcurrentUser(): Observable<User | null> {
  const token = this.getToken();
  if (!token) {
    return of(null);
  }

  try {
    const payload = JSON.parse(atob(token));
    const collection = payload.role === 'student' ? 'students' : 'doctors';
    
    return this._http.get<User>(`${this.baseUrl}/${collection}/${payload.id}.json`).pipe(
      map(user => {
        if (user) {
          return { ...user, _id: payload.id, role: payload.role};
        }
        return null;
      }),
      tap(user => this.currentUser.set(user))
    );
  } catch (error) {
    console.error("Error decoding token:", error);
    return of(null);
  }
}

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}