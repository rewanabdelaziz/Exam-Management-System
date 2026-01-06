import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { StudentDashboard } from './student/components/student-dashboard/student-dashboard';
import { AuthDashboard } from './auth/components/auth-dashboard/auth-dashboard';
import { Register } from './auth/components/register/register';

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    {path:'auth', component: AuthDashboard},
    {path:'login/:role', component: Login},
    {path:'studentDashboard',component: StudentDashboard},
    {path:'signUp',component:Register}
    
];
