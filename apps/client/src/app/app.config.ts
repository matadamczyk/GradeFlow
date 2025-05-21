import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { DateAdapter } from 'angular-calendar';
import { MyPreset } from '../mypreset';
// Calendar imports
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    // Date adapter for the calendar
    { provide: DateAdapter, useFactory: adapterFactory },
  ],
};
