// Keep the old class for backward compatibility if needed
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

  // Skip adding token for login and register endpoints
  const isAuthUrl =
    req.url.includes('/api/users/login') ||
    req.url.includes('/api/users/register');

  console.log('JWT Interceptor:', {
    url: req.url,
    isAuthUrl,
    isLoggedIn: authService.isLoggedIn(),
    hasToken: !!authService.getToken(),
  });

  if (!isAuthUrl && authService.isLoggedIn()) {
    const token = authService.getToken();
    console.log(
      'Adding JWT token to request:',
      token ? 'Token present' : 'No token'
    );
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Authorization header added to request');
      return next(authReq);
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
