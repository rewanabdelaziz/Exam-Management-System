import { Component } from '@angular/core';
import { ManageExams } from '../../services/manage-exams';
import { BehaviorSubject} from 'rxjs';
import {  DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-exams',
  imports: [RouterLink, DatePipe],
  templateUrl: './all-exams.html',
  styleUrl: './all-exams.css',
})
export class AllExams {

 private  refreshExams$ ;
 examsList
  constructor(private _manageExams: ManageExams,
              private _toastr:ToastrService
  ) {
    this.refreshExams$ = new BehaviorSubject<void>(undefined);
    this.examsList =this._manageExams.allExams
  }





  deleteExam(examId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red', 
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true 
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(examId);
      }
    });
  }
  
  private executeDelete(examId: string) {
    this._manageExams.deleteExam(examId).subscribe({
      next: () => {
        Swal.fire(
          'Deleted!',
          'The exam has been deleted successfully.',
          'success'
        );
        this.refreshExams$.next();
      },
      error: (error) => {
        Swal.fire(
          'Error!',
          'Something went wrong while deleting.',
          'error'
        );
        console.error(error);
      }
    });
  }
}
