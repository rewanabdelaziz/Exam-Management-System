import { Component, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { Exam } from '../../../shared/models/exam';
import { map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-intro-to-exam',
  imports: [],
  templateUrl: './intro-to-exam.html',
  styleUrl: './intro-to-exam.css',
})
export class IntroToExam  {
  instructions = [
    'Read each question carefully before selecting your answer.',
    'You can navigate between questions using the Next and Previous buttons.',
    'A countdown timer will be displayed at the top of the screen.',
    'Once you submit your exam, you cannot change your answers.',
    'Your results will be available immediately after submission.'
  ];
 
  currentExam: Signal<Exam | undefined> 
  currentExamId: Signal<string | null | undefined>;
  constructor(private router: Router,
              private _activatedRouter: ActivatedRoute, 
              private _manageExams:ManageExams)
    {
      this.currentExamId = toSignal(
        this._activatedRouter.paramMap.pipe(map(params => params.get('id')))
      );
      
      this.currentExam = toSignal(
        this._activatedRouter.paramMap.pipe(
          switchMap(params => {
            const id = params.get('id') || '';
            return this._manageExams.getExamById(id);
          })
        )
      );
  
    }

 
  startExam() {
    this.router.navigate(['/studentDashboard/examPage/', this.currentExamId()]);
  }

  back(){
    this.router.navigate(['/studentDashboard/availableExams']);
  }
}
