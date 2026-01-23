import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { StudentDashboard } from './student/components/student-dashboard/student-dashboard';
import { AuthDashboard } from './auth/components/auth-dashboard/auth-dashboard';
import { Register } from './auth/components/register/register';
import { authGuard } from './shared/guards/auth-guard';
import { DoctorDashboard } from './doctor/components/doctor-dashboard/doctor-dashboard';
import { Statistics } from './doctor/components/statistics/statistics';
import { Exams } from './doctor/components/exams/exams';
import { Results } from './doctor/components/results/results';
import { CreateNewExam } from './doctor/components/create-new-exam/create-new-exam';
import { AllExams } from './doctor/components/all-exams/all-exams';

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    {path:'auth', component: AuthDashboard},
    {path:'login/:role', component: Login},
    {path:'signUp',component:Register},
    {path:'studentDashboard',component: StudentDashboard, canActivate: [authGuard],data: { roles: ['student'] }},
    {path:'doctorDashboard',component: DoctorDashboard, canActivate: [authGuard],data: { roles: ['doctor'] },
        children: [
            {path: '', redirectTo: 'statistics', pathMatch: 'full' },
            {path: 'statistics', component: Statistics },
            {path: 'exams',component: Exams,
                children: [
                    {path: '', redirectTo: 'examsTabel', pathMatch: 'full' },
                    {path: 'examsTabel', component: AllExams},
                    {path: 'createNewExam', component: CreateNewExam},
                    {path: 'editExam/:id', component: CreateNewExam}
                ]
            },
            {path: 'results',component: Results},
           

        ]
    },
];
