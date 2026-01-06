import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../shared/environment.env';
import { Student } from '../../shared/models/student';
import { Admin } from '../../shared/models/admin';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  env = environment;
  baseUrl = this.env.baseUrl;
  constructor(private _http: HttpClient) {
    
  }

  createStudentAccount(data: Student) {
    return this._http.post(`${this.baseUrl}/students`, data);
  }

  studentLogin(email: string, password: string) {
    return this._http.get<Student>(`${this.baseUrl}/students?email=${email}&password=${password}`);
  }

  doctorLogin(email: string, password: string) {
    return this._http.get<Admin>(`${this.baseUrl}/doctors?email=${email}&password=${password}`);
  }

  getAllStudents() {
    return this._http.get<Student[]>(`${this.baseUrl}/students`);
  }
}