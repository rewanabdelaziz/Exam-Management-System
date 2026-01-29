import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMAIL_REGEX,PASSWORD_REGEX } from '../../validators';
// import {form,required} from '@angular/forms/signals';

interface loginData {
  email: string,
  password: string
}
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm : FormGroup
  errorMsg: string = '';
  loginModel = signal<loginData>
  // loginForm = form(this.loginModel, (schemaPath) =>{
  //   required()
  // })
  constructor(private _router:Router, 
              private _activatedRoute: ActivatedRoute,
              private _auth:Auth, 
              private _fb:FormBuilder) {
   this.loginForm =  this._fb.group({
    email:['',[Validators.required,Validators.pattern(EMAIL_REGEX)]],
    password:['',[Validators.required,Validators.minLength(6)]]
   })
  }
  
  role: string = '';

  ngOnInit() {
    this.role = this._activatedRoute.snapshot.paramMap.get('role') || '';
  }

  navigateToAuth(){
    this._router.navigate(['/auth']);
  }

  login(){
    if(this.loginForm.valid){
      if(this.role=='student'){
        this.studentLogin()
      }else{
        this.doctorLogin()
      }
    }
  }

 studentLogin(){
  const email=this.loginForm.value.email
  const password=this.loginForm.value.password
  this._auth.studentLogin(email,password).subscribe({
    next: (res) =>{
      // console.log(res)
      this._router.navigate(['/studentDashboard'])
    },
    error:(err)=>{
        console.error('Error', err);
        this.errorMsg = 'Invalid email or password';
    }
  })
 }

 doctorLogin(){
  const email=this.loginForm.value.email
  const password=this.loginForm.value.password
  this._auth.doctorLogin(email,password).subscribe({
    next: (res) =>{
      // console.log(res)
      this._router.navigate(['/doctorDashboard'])
    },
    error:(err)=>{
        console.error('Error', err);
        this.errorMsg = 'Invalid email or password';
    }
  })
 }


}
