import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Student } from '../../../shared/models/student';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  regesiterForm:FormGroup
  newStudent:Student = {} as Student;
  constructor(private router: Router, private _fb: FormBuilder, private _authService:Auth) {
    this.regesiterForm = this._fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      confirmPassword: ['',[Validators.required,Validators.minLength(6)]]
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login/student']);
  }
  createAccount(){
    if(this.regesiterForm.valid){
      this.newStudent.name = this.regesiterForm.value.name;
      this.newStudent.email = this.regesiterForm.value.email;
      this.newStudent.password = this.regesiterForm.value.password;
      // console.log(this.newStudent);

      this._authService.createStudentAccount(this.newStudent).subscribe({
      next:(res)=>{
        // console.log('Account created successfully', res);
        this.router.navigate(['/login/student']);
      },
      error:(err)=>{
        console.error('Error creating account', err);
      }
    });

    }
  }

}
