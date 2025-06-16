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

  const token = authService.getToken();
  
  console.log('JWT Interceptor DEBUG:', {
    url: req.url,
    isAuthUrl,
    isLoggedIn: authService.isLoggedIn(),
    hasToken: !!token,
    tokenValue: token ? `${token.substring(0, 20)}...` : 'null',
    tokenLength: token ? token.length : 0,
    currentUser: authService.getCurrentUser()
  });

  if (!isAuthUrl && authService.isLoggedIn()) {
    console.log('Adding JWT token to request. Token details:', {
      exists: !!token,
      length: token ? token.length : 0,
      firstPart: token ? token.substring(0, 50) : 'null'
    });
    
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Authorization header set:', authReq.headers.get('Authorization')?.substring(0, 30) + '...');
      return next(authReq);
    } else {
      console.error('No token available despite being logged in!');
    }
  }

  console.log('Request sent without token');
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
