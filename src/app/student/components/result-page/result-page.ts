import { Component,  Signal } from '@angular/core';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Results } from '../../../shared/models/results';
import { map,  switchMap } from 'rxjs';
import { Exam } from '../../../shared/models/exam';
import { toSignal } from '@angular/core/rxjs-interop';
import { GloabalLoader } from '../../../shared/component/gloabal-loader/gloabal-loader';

@Component({
  selector: 'app-result-page',
  imports: [RouterLink,GloabalLoader],
  templateUrl: './result-page.html',
  styleUrl: './result-page.css',
})
export class ResultPage  {
  incorrectAnswers: number = 0;
  examData: Signal<Exam | undefined> 
  resultData: Signal<Results | undefined> 
  currentExamId: Signal<string | null | undefined>;
 
  constructor(
    private _activatedRouter: ActivatedRoute,
    private _manageExams: ManageExams
  ) {

    this.currentExamId = toSignal(
        this._activatedRouter.paramMap.pipe(map(params => params.get('id')))
      );

      this.examData = toSignal(
        this._activatedRouter.paramMap.pipe(
          switchMap(params => {
            const id = params.get('id') || '';
            return this._manageExams.getExamById(id);
          })
        )
      );

      this.resultData = toSignal(
        this._activatedRouter.paramMap.pipe(
          switchMap(params => {
            const id = params.get('id') || '';
            return this._manageExams.getResultByExamIdAndStudentId(id);
          })
        )
      );
  }

  
}
