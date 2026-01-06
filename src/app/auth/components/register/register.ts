import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../../shared/models/student';
import { passwordMatchValidator,EMAIL_REGEX,PASSWORD_REGEX } from '../../validators';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  regesiterForm:FormGroup
  newStudent:User = {} as User;
  AllEmails:string[]=[];

  constructor(private router: Router, private _fb: FormBuilder, private _authService:Auth,private toastr: ToastrService) {
    this.regesiterForm = this._fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      email: ['',[Validators.required,Validators.pattern(EMAIL_REGEX)]],
      password: ['',[Validators.required,Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: ['',[Validators.required,Validators.pattern(PASSWORD_REGEX)]],
    }, 
    {validators: passwordMatchValidator}
  );
  }

  ngOnInit(): void {
    this.getAllEmails();
  }

  navigateToLogin() {
    this.router.navigate(['/login/student']);
  }
  getAllEmails(){
    this._authService.getAllStudentsEmails().subscribe({
      next:(res)=>{
        this.AllEmails=res;
      },
      error:(err)=>{
        console.error('Error fetching emails', err);
      }
    });
  }

  isEmailTaken(email: string): boolean {
    return this.AllEmails.includes(email);
  }
  createAccount(){
    const isEmailTaken = this.isEmailTaken(this.regesiterForm.value.email);
    if(isEmailTaken){
      this.regesiterForm.controls['email'].setErrors({'emailTaken': true});
      return;
    }

    if(this.regesiterForm.valid ){
      this.newStudent.name = this.regesiterForm.value.name;
      this.newStudent.email = this.regesiterForm.value.email;
      this.newStudent.password = this.regesiterForm.value.password;
      // console.log(this.newStudent);

      this._authService.createStudentAccount(this.newStudent).subscribe({
      next:(res)=>{
        // console.log('Account created successfully', res);
        
        this.toastr.success('user created successfully', 'Success');
  
        this.router.navigate(['/login/student']);
      },
      error:(err)=>{
        console.error('Error creating account', err);
      }
    });

    }
  }

}
