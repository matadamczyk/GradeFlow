import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard - sprawdzanie dostępu, isLoggedIn:', isLoggedIn);

    if (isLoggedIn) {
      return true;
    } else {
      console.log('AuthGuard - brak dostępu, przekierowanie na stronę główną');
      this.router.navigate(['/']);
      return false;
    }
  }
}
