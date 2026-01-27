import { Component, computed, OnInit, signal} from '@angular/core';
import { forkJoin, interval, map, Observable, takeWhile, tap, timer } from 'rxjs';
import { Exam } from '../../../shared/models/exam';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe} from '@angular/common';
import { Auth } from '../../../auth/services/auth';
import { User } from '../../../shared/models/student';
import { Results } from '../../../shared/models/results';
import { ToastrService } from 'ngx-toastr';
import { S } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-exam-page',
  imports: [AsyncPipe ],
  templateUrl: './exam-page.html',
  styleUrl: './exam-page.css',
})
export class ExamPage implements OnInit {
  currentExam$: Observable<Exam> = {} as Observable<Exam>;
  currentExamId:string ='';
  currentQuestionIndex = 0;
  userAnswers: string[] = []; 
  studentInfo$:Observable<User | null> = {} as Observable<User | null>; 
  resultData: Results = {} as Results;
  start!: Date ;
  
  remainingSeconds = signal<number>(0);
  displayTime = computed(() => {
    const mins = Math.floor(this.remainingSeconds() / 60);
    const secs = this.remainingSeconds() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  startTime!: number;
  durationInSeconds = 0;
  isSubmitted = false;


  constructor(private _manageExams: ManageExams,
              private _activatedRouter: ActivatedRoute,
              private _auth:Auth,
              private _router:Router,
              private _toastr:ToastrService
            ) {}

  ngOnInit(): void {
     this._activatedRouter.paramMap.subscribe(params => {
      this.currentExamId = params.get('id') || '';
      if(this.currentExamId){
        this.currentExam$ = this._manageExams.getExamById(this.currentExamId).pipe(
          tap(exam => { 
            this.initTimer(exam.duration);
          })
        );
      }
    });

    this.currentExam$.subscribe(exam => {
        this.initTimer(exam.duration);
    });


   this.studentInfo$ = this._auth.getcurrentUser()
   this.start = new Date();
  
  }

 

  initTimer(durationInMinutes: number) {

    const storageKey = `exam_end_time_${this.currentExamId}`;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {

      const now = new Date();
      const end = new Date(now.getTime() + durationInMinutes * 60000);
      endTime = end.getTime().toString();
      localStorage.setItem(storageKey, endTime);
    }

 
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = parseInt(endTime!) - now;

      if (distance <= 0) {
        clearInterval(intervalId);
        this.remainingSeconds.set(0);
        localStorage.removeItem(storageKey);
        this.autoSubmit(); 
      } else {
        this.remainingSeconds.set(Math.floor(distance / 1000));
      }
    }, 1000);

  }


  getExamDetails(id: string) {
    this.currentExam$=this._manageExams.getExamById(id).pipe(
      tap(exam => {
        this.initTimer(exam.duration);
      })
    );
  }

  prev(){
    this.currentQuestionIndex--;
  }

  next(){
    this.currentQuestionIndex++;
  }

  selectAnswer(option: string) {
    this.userAnswers[this.currentQuestionIndex] = option;
  }
  
  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  submitExam(userId: string, examId: string, answers: string[]) {
   
    const submitAt = new Date();
    const durationInMinutes = Math.floor((submitAt.getTime() - this.start.getTime()) / 60000);

    forkJoin({
      scoreData: this._manageExams.calculateScore(answers, examId),
      studentAnswersData: this._manageExams.getStudentAnswersArray(answers, examId)
    }).subscribe(({ scoreData, studentAnswersData }) => {
        this.resultData = {
          studentId: userId,
          examId: examId,
          score: scoreData.score,
          passed: scoreData.passed,
          TotalcorrectAnswers: scoreData.totalCorrectAnswers,
          totalQuestions: scoreData.totalQuestions,
          startedAt: this.start.toISOString(),
          submittedAt: submitAt.toISOString(),
          durationInMinutes: durationInMinutes,
          answers: studentAnswersData.answers
        };

        // console.log(this.resultData);
        this._manageExams.submitResult(this.resultData).subscribe({
          next: (res) => {
            // console.log('Result submitted successfully', res);
            this._toastr.success('exam submitted successfully', 'Success');
            this._router.navigate(['/studentDashboard/resultPage', examId]);
          },
          error: (err) => {
            console.error('Error submitting result', err);
          }
        }  
        );
      });

    
  }

  autoSubmit() {
    if (!this.isSubmitted) {
      this._toastr.warning('Time is up! Submitting your exam...');
      // اسحب الـ User ID من الـ studentInfo$ وطلّع الـ submitExam
      this.studentInfo$.subscribe(user => {
        if (user) this.submitExam(user.id, this.currentExamId, this.userAnswers);
      });
      this.isSubmitted = true;
    }
  }

  
}
