import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { currentExam } from '../../../shared/models/exam';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StudentHeader } from '../student-header/student-header';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-available-exams',
  imports: [AsyncPipe, StudentHeader, NgClass, RouterLink],
  templateUrl: './available-exams.html',
  styleUrl: './available-exams.css',
})
export class AvailableExams implements OnInit{

  studentInfo$:Observable<{ name: string; email: string  } | null>; 

  availableExams$! : Observable<currentExam[]> ;
  TakenExams$! : Observable<currentExam[]> ;
  isResults = false;

  constructor(private _manageExams: ManageExams,
              private _router: Router,
              private _auth:Auth
  ) {
     this.studentInfo$ = this._auth.getcurrentUser().pipe(
     map(user => user ? { name: user.name, email: user.email } : null)
    );
  }


  ngOnInit(): void {
    this.availableExams$ = this._manageExams.getExamsNotTakenByStudent();
    this.TakenExams$ = this._manageExams.getExamsTakenByStudent();
  }
  startExam(examId: string) {
    this._router.navigate(['/studentDashboard/introToExam', examId]);
  }
  toggle(openResults: boolean) {
    this.isResults = openResults;
  }
}
