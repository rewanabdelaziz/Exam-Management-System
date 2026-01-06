import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-dashboard',
  imports: [],
  templateUrl: './auth-dashboard.html',
  styleUrl: './auth-dashboard.css',
})
export class AuthDashboard {
  constructor(private _router: Router) {}

  navigateToStudentAuth() {
    this._router.navigate(['/login/student']);
  }
  navigateToDoctorAuth() {
    this._router.navigate(['/login/doctor']);
  }
}
