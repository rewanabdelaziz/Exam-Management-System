import { CommonModule, NgClass } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { User } from '../../../shared/models/student';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass,RouterLink,CommonModule, RouterModule,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  currentUser: Signal<User | null | undefined>

  constructor(private _router:Router,private _auth:Auth) {
    this.currentUser = toSignal(this._auth.getcurrentUser())
   
  }


  logOut(){
    this._auth.logOut();
    this._router.navigate(['/auth']);
  }
  
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}
