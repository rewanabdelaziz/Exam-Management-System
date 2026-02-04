import { Component, inject } from '@angular/core';
import { Auth } from '../../../auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
private _auth = inject(Auth);
  private _router = inject(Router);


  goBack() {
    const user = this._auth.currentUser();
    if (user?.role === 'doctor') {
      this._router.navigate(['/doctorDashboard']);
    } else if (user?.role === 'student') {
      this._router.navigate(['/studentDashboard']);
    } else {
      this._auth.logOut()
    }
  }
}
