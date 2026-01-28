import { Component, Signal } from '@angular/core';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { SlicePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StudentHeader } from '../student-header/student-header';
import { Auth } from '../../../auth/services/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../shared/models/student';

@Component({
  selector: 'app-available-exams',
  imports: [ StudentHeader, RouterLink,SlicePipe],
  templateUrl: './available-exams.html',
  styleUrl: './available-exams.css',
})
export class AvailableExams {

  availableExams;
  TakenExams;
  isResults = false;
  studentInfo:Signal<User | null | undefined>;
  constructor(private _manageExams: ManageExams,
              private _router: Router,
              private _auth:Auth
  ) {

    this.studentInfo = toSignal(this._auth.getcurrentUser())
    this.availableExams = toSignal(this._manageExams.getExamsNotTakenByStudent())
    this.TakenExams = toSignal(this._manageExams.getExamsTakenByStudent())
  }

  startExam(examId: string) {
    this._router.navigate(['/studentDashboard/introToExam', examId]);
  }
  toggle(openResults: boolean) {
    this.isResults = openResults;
  }
}
