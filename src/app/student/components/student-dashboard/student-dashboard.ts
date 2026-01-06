import { Component } from '@angular/core';
import { StudentHeader } from '../student-header/student-header';
import { AvailableExams } from '../available-exams/available-exams';

@Component({
  selector: 'app-student-dashboard',
  imports: [StudentHeader,AvailableExams],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {

}
