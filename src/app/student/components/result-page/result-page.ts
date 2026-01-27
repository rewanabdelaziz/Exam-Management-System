import { Component, OnInit } from '@angular/core';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Results } from '../../../shared/models/results';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Exam } from '../../../shared/models/exam';

@Component({
  selector: 'app-result-page',
  imports: [AsyncPipe,RouterLink],
  templateUrl: './result-page.html',
  styleUrl: './result-page.css',
})
export class ResultPage implements OnInit {
  resultData$:Observable<Results> = {} as Observable<Results>;
  examData$: Observable<Exam> = {} as Observable<Exam>;
  incorrectAnswers: number = 0;

  constructor(
    private _route: ActivatedRoute,
    private _manageExams: ManageExams
  ) {}

  ngOnInit(): void {
    const examId = this._route.snapshot.paramMap.get('id');
    if (examId) {
     this.resultData$ = this._manageExams.getResultByExamIdAndStudentId(examId);
     this.examData$ = this._manageExams.getExamById(examId);
  }
}
}
