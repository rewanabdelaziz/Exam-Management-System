import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../../shared/models/student';
import { EMAIL_REGEX,PASSWORD_REGEX } from '../../validators';
import { ToastrService } from 'ngx-toastr';
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';

export interface registerData {
  name:string,
  email: string,
  password: string,
  confirmPassword: string
}

@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule,FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  newStudent:User = {} as User;
  AllEmails:string[]=[];

  registerModel = signal<registerData>({
    name:'',
    email: '',
    password: '',
    confirmPassword: ''
  })
  emailTakenError = signal<string | null>(null);

  constructor(private router: Router, private _fb: FormBuilder, private _authService:Auth,private toastr: ToastrService) {
 
  }
  regesiterForm = form(this.registerModel,(schemaPath) => {
    required(schemaPath.name,{message: 'Name is required!'});
    minLength(schemaPath.name,3,{message:'Name must be at least 3 characters'})

    required(schemaPath.email,{message: 'email is required!'});
    pattern(schemaPath.email,EMAIL_REGEX, {message: 'Enter a valid email'});

    required(schemaPath.password,{message: 'password is required!'});
    pattern(schemaPath.password,PASSWORD_REGEX, 
           {message: 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, and one number '});

    required(schemaPath.confirmPassword,{message: 'confirm password is required!'});
    pattern(schemaPath.confirmPassword,PASSWORD_REGEX);

    const data = this.registerModel(); 
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      ({
        key: 'passwordMismatch',
        message: 'Passwords do not match!',
        path: schemaPath.confirmPassword 
      });
    }
  
  })

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
    this.emailTakenError.set(null);
    const isEmailTaken = this.isEmailTaken(this.registerModel().email);
    
    if(isEmailTaken){
      this.emailTakenError.set('This email is already taken!');
      return;
    }

    if(!this.regesiterForm().invalid()){
      this.newStudent.name = this.registerModel().name;
      this.newStudent.email = this.registerModel().email;
      this.newStudent.password = this.registerModel().password;
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
