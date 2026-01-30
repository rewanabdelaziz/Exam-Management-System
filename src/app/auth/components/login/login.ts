import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { EMAIL_REGEX,} from '../../validators';
import {form,FormField,minLength,pattern,required} from '@angular/forms/signals';

interface loginData {
  email: string,
  password: string
}
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

   constructor(private _router:Router,
              private _activatedRoute: ActivatedRoute,
              private _auth: Auth,
              ) {
 
  }
 
  errorMsg = signal<string>('')

  loginModel = signal<loginData>({
    email:'',
    password:''
  })

  loginForm = form(this.loginModel, (schemaPath) =>{
    required(schemaPath.email,{message: 'email is required!'});
    pattern(schemaPath.email,EMAIL_REGEX, {message: 'Enter a valid email'});

    required(schemaPath.password,{message: 'password is required!'});
    minLength(schemaPath.password,6)
  })

 
  
  role: string = '';

  ngOnInit() {
    this.role = this._activatedRoute.snapshot.paramMap.get('role') || '';
  }

  navigateToAuth(){
    this._router.navigate(['/auth']);
  }

  login(){
    const formState = this.loginForm()
    if(!formState.invalid()){
      if(this.role=='student'){
        this.studentLogin()
      }else{
        this.doctorLogin()
      }
    }
  }

 studentLogin(){
  const email=this.loginModel().email
  const password=this.loginModel().password
  this._auth.studentLogin(email,password).subscribe({
    next: () =>{
      this._router.navigate(['/studentDashboard'])
    },
    error:()=>{
        this.errorMsg.set('Invalid email or password');
    }
  })
 }

 doctorLogin(){
  const email=this.loginModel().email
  const password=this.loginModel().password
  this._auth.doctorLogin(email,password).subscribe({
    next: () =>{
      this._router.navigate(['/doctorDashboard'])
    },
    error:(err)=>{
        this.errorMsg.set('Invalid email or password');
    }
  })
 }


}
