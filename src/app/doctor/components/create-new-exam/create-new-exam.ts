import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ManageExams } from '../../services/manage-exams';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Exam } from '../../../shared/models/exam';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-new-exam',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './create-new-exam.html',
  styleUrl: './create-new-exam.css',
})
export class CreateNewExam implements OnInit {
  examId: string | null = null;
  isEditMode: boolean = false;
  newExamForm! :FormGroup;
  dateofCreation!:Date;
 
  constructor(private _manageExams: ManageExams,
              private _router:Router,
              private _activatedRoute: ActivatedRoute,
              private _fb:FormBuilder,
              private _toastr:ToastrService,
              private _cd : ChangeDetectorRef
             ) {

      this.newExamForm = this._fb.group({
        title:['',Validators.required],
        description:['',Validators.required],
        duration:['30',[Validators.required,Validators.min(1)]],
        totalQuestions:[0],
        passingScore:['75',[Validators.required, Validators.min(1), Validators.max(100)]],
        questions: this._fb.array([])
      })

   }
  
  

  ngOnInit(): void {
    this.examId = this._activatedRoute.snapshot.paramMap.get('id');
    if(this.examId){
      this.isEditMode = true;
      this.loadExam(this.examId);
    }

      
  }

  loadExam(examId:string){
    this._manageExams.getExamById(examId).subscribe({
      next:(examData)=>{
        this.newExamForm.patchValue({
          title: examData.title,
          description: examData.description,
          duration: examData.duration,
          totalQuestions: examData.totalQuestions,
          passingScore: examData.passingScore
        });
        this.dateofCreation = examData.dateOfCreation;
        this.questions.clear(); // Clear existing questions
        examData.questions.forEach(question => {
          const questionForm = this._fb.group({
            questionText: [question.questionText, Validators.required],
            options: this._fb.array(
              question.options.map(option => this._fb.control(option, Validators.required))
            ),
            correctAnswer: [question.correctAnswer, Validators.required]
          });
          this.questions.push(questionForm);
        });
        
        this._cd.detectChanges();
      }
    });

  }

  confirmAndSave() {
    if (this.newExamForm.invalid) {
      this._toastr.error('Please fill all required fields correctly', 'Validation Error');
      return;
    }
    const actionText = this.isEditMode ? 'Update' : 'Create';

    Swal.fire({
      title: `Confirm ${actionText}?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this exam?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${actionText}!`,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isEditMode) {
          this.editExam();
        } else {
          this.createExam();
        }
      }
    });
  }

  editExam(){
    
      const examData:Exam={
        ...this.newExamForm.value,
        dateOfCreation: this.dateofCreation,
      }
      this._manageExams.editExam(this.examId!,examData).subscribe({
        next:()=>{
          // console.log("exam edited successfully",response);
          this._toastr.success('exam edited successfully', 'Success');
          this._router.navigate(['/doctorDashboard/exams']);
        },
        error:(error)=>{
          console.error("error editing exam",error);
        }
      })
  }

  

  createExam(){
   
      const examData:Exam={   
        ...this.newExamForm.value,
        dateOfCreation: new Date(),
      }
      this._manageExams.createExam(examData).subscribe({
        next:()=>{
          // console.log("exam created successfully",response);
          this._toastr.success('exam created successfully', 'Success');
          this._router.navigate(['/doctorDashboard/exams']);
        },
        error:(error)=>{
          console.error("error creating exam",error);
        }
      })
    
  }

  //  getter
  get questions() {
  return this.newExamForm.get('questions') as FormArray;
  }

  get correctAnswer() {
    return this.questions.get('correctAnswer');
  }

  //  method to add a new question FormGroup to questions FormArray
  addQuestion() {
    const questionForm = this._fb.group({
      questionText: ['', Validators.required],
      options: this._fb.array([ 
        this._fb.control('', Validators.required),
        this._fb.control('', Validators.required),
        this._fb.control('', Validators.required),
        this._fb.control('', Validators.required)
      ]),
      correctAnswer: ['', Validators.required]
    });

    this.questions.push(questionForm);
    // Update totalQuestions value
    this.newExamForm.patchValue({
      totalQuestions: this.questions.length
    });

  }


  // remove questions
  removeQuestion(index: number) {
    this.questions.removeAt(index); 

    // Update totalQuestions value
    this.newExamForm.patchValue({
      totalQuestions: this.questions.length
    });

  }

 
  isCorrectOption(questionIndex: number, optionIndex: number): boolean {
    const questionGroup = this.questions.at(questionIndex) as FormGroup;
    if (!questionGroup) return false;
    const question = this.questions?.at(questionIndex);
    const optionValue = question?.get('options')?.get(optionIndex.toString())?.value;
    const correctAnswer = question?.get('correctAnswer')?.value;
    return correctAnswer !== '' && optionValue === correctAnswer;
  }



}