import { Component } from '@angular/core';
import { StudentHeader } from '../student-header/student-header';
import { AvailableExams } from '../available-exams/available-exams';
import { Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { User } from '../../../shared/models/student';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  imports: [StudentHeader,AvailableExams,AsyncPipe],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard  {
   constructor(private _router: Router, private _auth:Auth) {
    this.studentInfo$ = this._auth.getcurrentUser().pipe(
     map(user => user ? { name: user.name, email: user.email } : null)
    );
   }
   currentUser:User = {} as User;
    studentInfo$:Observable<{ name: string; email: string  } | null>; 
   
  


}