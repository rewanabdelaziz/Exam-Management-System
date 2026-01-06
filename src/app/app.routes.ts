import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { StudentDashboard } from './student/components/student-dashboard/student-dashboard';
import { AuthDashboard } from './auth/components/auth-dashboard/auth-dashboard';
import { Register } from './auth/components/register/register';
import { authGuard } from './shared/guards/auth-guard';
import { DoctorDashboard } from './doctor/components/doctor-dashboard/doctor-dashboard';

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    {path:'auth', component: AuthDashboard},
    {path:'login/:role', component: Login},
    {path:'signUp',component:Register},
    {path:'studentDashboard',component: StudentDashboard, canActivate: [authGuard],data: { roles: ['student'] }},
    {path:'doctorDashboard',component: DoctorDashboard, canActivate: [authGuard],data: { roles: ['doctor'] }}
    
    
];
