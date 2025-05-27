import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/welcome-layout/welcome-layout.component').then(
        (m) => m.WelcomeLayoutComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./modules/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./modules/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'timetable',
    loadComponent: () =>
      import('./modules/timetable/timetable.component').then(
        (m) => m.TimetableComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'grades',
    loadComponent: () =>
      import('./modules/grades/grades.component').then(
        (m) => m.GradesComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./modules/account/account.component').then(
        (m) => m.AccountComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
