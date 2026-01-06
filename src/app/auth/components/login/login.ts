import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm : FormGroup

  constructor(private _router:Router, private _activatedRoute: ActivatedRoute, private _auth:Auth, private _fb:FormBuilder) {
   this.loginForm =  this._fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.maxLength(6)]]
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
    }
  })
 }

 doctorLogin(){
  const email=this.loginForm.value.email
  const password=this.loginForm.value.password
  this._auth.doctorLogin(email,password).subscribe({
    next: (res) =>{
      console.log(res)
      this._router.navigate(['/doctorDashboard'])
    },
    error:(err)=>{
        console.error('Error', err);
    }
  })
 }
}
