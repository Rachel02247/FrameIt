import { Routes } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
    { path: 'login', component: AuthFormComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canMatch: [authGuard],
        children: [
          { path: '', redirectTo: 'analytics', pathMatch: 'full' },
          { path: 'analytics', component: AnalyticsComponent },
          { path: 'users', component: UsersComponent },
          { path: 'settings', component: SettingsComponent },
        ],
      },    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' },
    
];
