import { Routes } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { authGuard } from './guards/authCanMatch/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { SettingsComponent } from './components/settings/settings.component';
import { authSpreadGuard } from './guards/auth.canActivate/auth-spread.guard';

export const routes: Routes = [
    { 
      path: 'login', 
      component: AuthFormComponent,
      canActivate: [authSpreadGuard],
     
    },

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
      },
    {
      path: '',
      redirectTo: sessionStorage.getItem('token') ? '/dashboard' : '/login',
      pathMatch: 'full'
    },
    { path: '**', redirectTo: '/login' },
];
