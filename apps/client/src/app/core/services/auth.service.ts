import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/user.model';
import { UserRole } from '../models/enums';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  lastname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Flag for enabling mock mode - change to true to enable mock login for e2e tests
  private readonly MOCK_MODE = false;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private mockUsers: AuthUser[] = [
    {
      id: 1,
      email: 'student@gradeflow.com',
      role: UserRole.STUDENT,
      name: 'Adam',
      lastname: 'Nowicki',
    },
    {
      id: 2,
      email: 'teacher@gradeflow.com',
      role: UserRole.TEACHER,
      name: 'Anna',
      lastname: 'Kowalska',
    },
    {
      id: 3,
      email: 'parent@gradeflow.com',
      role: UserRole.PARENT,
      name: 'Jan',
      lastname: 'Nowicki',
    },
    {
      id: 4,
      email: 'admin@gradeflow.com',
      role: UserRole.ADMIN,
      name: 'Admin',
      lastname: 'System',
    },
  ];

  constructor(private apiService: ApiService) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Błąd parsowania użytkownika z localStorage:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthUser> {
    // Mock mode for e2e tests - check both internal flag and window flag
    const isMockMode =
      this.MOCK_MODE || (window as any).__GRADEFLOW_MOCK_MODE__;
    if (isMockMode) {
      return this.mockLogin(credentials);
    }

    // Normal API login
    return this.apiService.loginUser(credentials).pipe(
      map((response: any) => {
        if (response && response.token && response.user) {
          const authUser: AuthUser = {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role as UserRole,
          };

          localStorage.setItem('currentUser', JSON.stringify(authUser));
          localStorage.setItem('token', response.token);

          this.currentUserSubject.next(authUser);

          return authUser;
        }

        throw new Error(
          'Nieprawidłowa odpowiedź z API: ' + JSON.stringify(response)
        );
      }),
      catchError((error: any) => {
        console.error('Login failed:', error);

        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');

        if (error.status === 401) {
          return throwError(() => new Error('Nieprawidłowy email lub hasło'));
        }

        if (error.status === 0) {
          return throwError(() => new Error('Brak połączenia z serwerem'));
        }

        return throwError(
          () =>
            new Error('Błąd logowania: ' + (error.message || 'Nieznany błąd'))
        );
      })
    );
  }

  private mockLogin(credentials: LoginRequest): Observable<AuthUser> {
    // Simulate network delay
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        // Check credentials
        if (credentials.password !== 'password') {
          return throwError(() => new Error('Nieprawidłowy email lub hasło'));
        }

        // Find user by email
        const user = this.mockUsers.find((u) => u.email === credentials.email);

        if (!user) {
          return throwError(() => new Error('Nieprawidłowy email lub hasło'));
        }

        // Mock token
        const mockToken = 'mock_jwt_token_' + Date.now();

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', mockToken);

        this.currentUserSubject.next(user);

        console.log('🎭 Mock login successful for:', credentials.email);

        return of(user);
      })
    );
  }

  // Method to enable mock mode (for e2e tests)
  enableMockMode(): void {
    (this as any).MOCK_MODE = true;
    console.log('🎭 Mock mode enabled for e2e tests');
  }

  // Method to disable mock mode
  disableMockMode(): void {
    (this as any).MOCK_MODE = false;
    console.log('🎭 Mock mode disabled');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const isLoggedIn = this.currentUserSubject.value !== null;
    return isLoggedIn;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }

  register(userData: any): Observable<AuthUser> {
    return throwError(
      () => new Error('Rejestracja nie jest jeszcze dostępna')
    ).pipe(delay(1000));
  }
}
