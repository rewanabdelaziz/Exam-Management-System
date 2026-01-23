import { Component } from '@angular/core';
import { ManageExams } from '../../services/manage-exams';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { currentExam } from '../../../shared/models/exam';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-all-exams',
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './all-exams.html',
  styleUrl: './all-exams.css',
})
export class AllExams {

 private refreshExams$ = new BehaviorSubject<void>(undefined);
  examsList$ = this.refreshExams$.pipe(
    switchMap(() => this._manageExams.getAllExams())
  );

  constructor(private _manageExams: ManageExams,
              private _toastr:ToastrService
  ) {}

  // ngOnInit(): void {
  //   this.examsList$ = this._manageExams.getAllExams()
  // }

  deleteExam(examId:string){
    this._manageExams.deleteExam(examId).subscribe({
      next:()=>{
        // Refresh the exams list after deletion
        this._toastr.success('exam deleted successfully');
        this.refreshExams$.next();
      },
      error:(error)=>{
        console.error("error deleting exam",error);
      }
    })
  }
}
