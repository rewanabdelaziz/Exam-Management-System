import { Component, computed, effect, HostListener, OnDestroy, OnInit, Signal, signal} from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';
import { Exam } from '../../../shared/models/exam';
import { ManageExams } from '../../../doctor/services/manage-exams';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { User } from '../../../shared/models/student';
import { Results } from '../../../shared/models/results';
import { ToastrService } from 'ngx-toastr';
import { toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-page',
  imports: [],
  templateUrl: './exam-page.html',
  styleUrl: './exam-page.css',
})
export class ExamPage implements OnInit,OnDestroy {
  // show default warning message when close tab 
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.isSubmitting()) {
      $event.returnValue = true;
    }
  }

  currentQuestionIndex = 0;
  userAnswers: string[] = []; 
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
  isSubmitting = signal(false); 
  
  currentExam: Signal<Exam | undefined>
  studentInfo: Signal<User | null >
  currentExamId: Signal<string | null | undefined>;
  private timerId:any;

  constructor(private _manageExams: ManageExams,
              private _activatedRouter: ActivatedRoute,
              private _auth:Auth,
              private _router:Router,
              private _toastr:ToastrService
            ) 
  {
     this.currentExam = toSignal(
        this._activatedRouter.paramMap.pipe(
          switchMap(params => {
            const id = params.get('id') || '';
            return this._manageExams.getExamById(id)
          })
        )
      );

      this.studentInfo =this._auth.currentUser

      this.currentExamId = toSignal(
        this._activatedRouter.paramMap.pipe(map(params => params.get('id')))
      );

    effect(() => {
      const exam = this.currentExam(); 
      if (exam && exam.duration && !this.timerId) { 
        this.initTimer(exam.duration);
      }
    });

  }

  ngOnInit(): void {
   this.start = new Date();
  }

  ngOnDestroy(): void {
    if(this.timerId) clearInterval(this.timerId)
  }
 
  // call by angular router
 async canDeactivate(): Promise<boolean> {
  if (this.isSubmitting()) return true;

  // Swal.fire return promise
  const result = await Swal.fire({
    title: "are you sure?",
    text: "your answers won't be saved!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'leave',
    cancelButtonText: 'stay',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  return result.isConfirmed; 
}

 

  initTimer(durationInMinutes: number) {
    const examId = this.currentExamId()
    if(!examId) return

    const storageKey = `exam_end_time_${examId}`;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {

      const now = new Date();
      const end = new Date(now.getTime() + durationInMinutes * 60000);
      endTime = end.getTime().toString();
      localStorage.setItem(storageKey, endTime);
    }
      
    this.timerId = setInterval(() => {
      const now = new Date().getTime();
      const distance = parseInt(endTime!) - now;

      if (distance <= 0) {
        clearInterval(this.timerId);
        this.remainingSeconds.set(0);
        localStorage.removeItem(storageKey);
        this.autoSubmit(); 
      } else {
        this.remainingSeconds.set(Math.floor(distance / 1000));
      }
    }, 1000);

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

  submitExam( examId: string, answers: string[]) {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    // console.log("student",this.studentInfo())
    const submitAt = new Date();
    const durationInMinutes = Math.floor((submitAt.getTime() - this.start.getTime()) / 60000);

    forkJoin({
      scoreData: this._manageExams.calculateScore(answers, examId),
      studentAnswersData: this._manageExams.getStudentAnswersArray(answers, examId)
    }).subscribe(({ scoreData, studentAnswersData }) => {
        this.resultData = {
          studentId: this.studentInfo()?._id!,
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

        this._manageExams.submitResult(this.resultData).subscribe({
          next: () => {
            localStorage.removeItem(`exam_end_time_${examId}`);
            this._toastr.success('exam submitted successfully', 'Success');
            this._router.navigate(['/studentDashboard/resultPage', examId]);
          },
          error: (err) => {
            console.error('Error submitting result', err);
            this.isSubmitting.set(false)
          }
        }  
        );
      });

    
  }

  autoSubmit() {
    if (!this.isSubmitting()) {
      const student = this.studentInfo();
      const examId = this.currentExamId();

      if(student?._id && examId){
        console.log("student",student)
        this._toastr.warning('Time is up! Submitting your exam...');
        this.submitExam( examId, this.userAnswers);
        this.isSubmitting.set(true)
      }
      
    }
  }

  
}
