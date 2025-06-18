import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isAuthUrl =
    req.url.includes('/api/users/login') ||
    req.url.includes('/api/users/register');

  const token = authService.getToken();
  const isLoggedIn = authService.isLoggedIn();

  if (!isAuthUrl && isLoggedIn) {
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    } else {
      console.error('No token available despite being logged in!');
    }
  }

  return next(req);
};

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return jwtInterceptor(request, next.handle.bind(next)) as Observable<
      HttpEvent<any>
    >;
  }
}
