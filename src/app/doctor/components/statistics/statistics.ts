import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ManageExams } from '../../services/manage-exams';
import { DatePipe } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-statistics',
  imports: [DatePipe],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {
// private _manageExams = inject(ManageExams);
// private _Auth = inject(Auth);

  
  // private dashboardData$ = forkJoin({
  //   exams: this._manageExams.getAllExams(),
  //   results: this._manageExams.getAllResultsWithDetails(),
  //   students: this._Auth.getAllStudents() 
  // });
  private dashboardData$ 
  data
  constructor(private _manageExams: ManageExams,private _Auth:Auth ){
    this.dashboardData$ = forkJoin({
      exams: this._manageExams.getAllExams(),
      results: this._manageExams.getAllResultsWithDetails(),
      students: this._Auth.getAllStudents() 
    });
    this.data = toSignal(this.dashboardData$);

  }

  // data = toSignal(this.dashboardData$);

 
  stats = computed(() => {
    const d = this.data();
    if (!d) return { totalExams: 0, totalStudents: 0, avgScore: 0, completedTests: 0 };

    const avg = d.results.length > 0 
      ? Math.round(d.results.reduce((acc: any, curr: any) => acc + curr.score, 0) / d.results.length) 
      : 0;

    return {
      totalExams: d.exams.length,
      totalStudents: d.students.length,
      avgScore: avg,
      completedTests: d.results.length
    };
  });

 
  recentExams = computed(() => this.data()?.exams.slice(-3).reverse() || []);
  recentResults = computed(() => this.data()?.results.slice(-3).reverse() || []);
}
