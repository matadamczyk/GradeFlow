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
    // Sprawdź czy użytkownik jest zalogowany (localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Przywracam użytkownika z localStorage:', user);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Błąd parsowania użytkownika z localStorage:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthUser> {
    console.log('Próba logowania:', credentials.email);

    return this.apiService.loginUser(credentials).pipe(
      map((response: any) => {
        // Sprawdź czy dostaliśmy JWT token i dane użytkownika
        if (response && response.token && response.user) {
          const authUser: AuthUser = {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role as UserRole,
          };

          console.log('Logowanie udane dla użytkownika:', authUser);

          // Zapisz token i dane użytkownika w localStorage
          localStorage.setItem('currentUser', JSON.stringify(authUser));
          localStorage.setItem('token', response.token);

          // Aktualizuj stan
          this.currentUserSubject.next(authUser);

          return authUser;
        }

        throw new Error(
          'Nieprawidłowa odpowiedź z API: ' + JSON.stringify(response)
        );
      }),
      catchError((error: any) => {
        console.error('Login failed:', error);
        
        // Usuń ewentualne stare dane
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        
        if (error.status === 401) {
          return throwError(() => new Error('Nieprawidłowy email lub hasło'));
        }
        
        if (error.status === 0) {
          return throwError(() => new Error('Brak połączenia z serwerem'));
        }
        
        return throwError(() => new Error('Błąd logowania: ' + (error.message || 'Nieznany błąd')));
      })
    );
  }

  logout(): void {
    console.log('Wylogowywanie użytkownika');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('Stan po wylogowaniu - isLoggedIn:', this.isLoggedIn());
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const isLoggedIn = this.currentUserSubject.value !== null;
    console.log(
      'Sprawdzanie stanu logowania:',
      isLoggedIn,
      'User:',
      this.currentUserSubject.value
    );
    return isLoggedIn;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log(
      'getToken() called:',
      token ? 'Token exists' : 'No token in localStorage'
    );
    return token;
  }

  // Mock registration (dla przyszłego użycia)
  register(userData: any): Observable<AuthUser> {
    // Symulacja rejestracji
    return throwError(
      () => new Error('Rejestracja nie jest jeszcze dostępna')
    ).pipe(delay(1000));
  }
}
