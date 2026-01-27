import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { Exam } from '../../../shared/models/exam';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-intro-to-exam',
  imports: [AsyncPipe],
  templateUrl: './intro-to-exam.html',
  styleUrl: './intro-to-exam.css',
})
export class IntroToExam implements OnInit {
  instructions = [
    'Read each question carefully before selecting your answer.',
    'You can navigate between questions using the Next and Previous buttons.',
    'A countdown timer will be displayed at the top of the screen.',
    'Once you submit your exam, you cannot change your answers.',
    'Your results will be available immediately after submission.'
  ];
  currentExam$: Observable<Exam> = {} as Observable<Exam>;
  currentExamId!:string | null;

  constructor(private router: Router,
              private _activatedRouter: ActivatedRoute, 
              private _manageExams:ManageExams) {}

  ngOnInit(): void {
     this._activatedRouter.paramMap.subscribe(params => {
      this.currentExamId = params.get('id');
    
   });

   if(this.currentExamId){
    this.getExamDetails(this.currentExamId);
   }
  
  }

  getExamDetails(id: string) {
    this.currentExam$=this._manageExams.getExamById(id)
  }

 

  startExam() {
    this.router.navigate(['/studentDashboard/examPage/', this.currentExamId]);
  }

  back(){
    this.router.navigate(['/studentDashboard/availableExams']);
  }
}
