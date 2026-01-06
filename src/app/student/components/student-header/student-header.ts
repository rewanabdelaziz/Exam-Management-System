import { Component, Input} from '@angular/core';
import { Auth } from '../../../auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-header',
  imports: [],
  templateUrl: './student-header.html',
  styleUrl: './student-header.css',
})
export class StudentHeader {
  @Input() currentStudent: {name:string, email:string} | null = {name:'', email:''} ;

  constructor(private _auth: Auth, private _router: Router) {}
   logOut(){
    this._auth.logOut();
    this._router.navigate(['/auth']);
  }
}
