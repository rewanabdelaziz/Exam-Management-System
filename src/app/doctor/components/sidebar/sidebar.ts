import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass,RouterLink,CommonModule, RouterModule,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{
  currentUserName: string = '';
  currentUserEmail: string = '';
  currentUser$: Observable<{ name: string; email: string  } | null> = {} as Observable<{ name: string; email: string  } | null>;
  constructor(private _router:Router,private _auth:Auth) {
   
  }
  ngOnInit(): void {
    this.currentUser$=this._auth.getcurrentUser().pipe(
     map(user => user ? { name: user.name, email: user.email } : null)
    );
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
