import { Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';
import { AuthComponent } from '../components/auth/auth.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    canMatch: [authGuard],
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
