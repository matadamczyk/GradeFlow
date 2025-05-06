import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/welcome-layout/welcome-layout.component').then(
        (m) => m.WelcomeLayoutComponent,
      ),
    title: 'GradeFlow - Strona główna',
  },

  {
    path: 'timetable',
    loadComponent: () =>
      import('./modules/timetable/timetable.component').then(
        (m) => m.TimetableComponent,
      ),
    title: 'Plan zajęć',
  },
  {
    path: 'grades',
    loadComponent: () =>
      import('./modules/grades/grades.component').then(
        (m) => m.GradesComponent,
      ),
    title: 'Oceny',
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./modules/account/account.component').then(
        (m) => m.AccountComponent,
      ),
    title: 'Profil',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./modules/about/about.component').then((m) => m.AboutComponent),
    title: 'O GradeFlow',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./modules/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
    title: 'Kontakt',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

//   {
//     path: 'auth',
//     loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
//     children: [
//       {
//         path: 'login',
//         loadComponent: () => import('./layouts/auth-layout/sign-in/sign-in.component').then(m => m.SignInComponent),
//         title: 'Logowanie'
//       },
//       {
//         path: 'register',
//         loadComponent: () => import('./layouts/auth-layout/sign-up/sign-up.component').then(m => m.SignUpComponent),
//         title: 'Rejestracja'
//       }
//     ]
//   },

//   // Obsługa nieistniejących tras
//   {
//     path: '**',
//     redirectTo: ''
//   }
