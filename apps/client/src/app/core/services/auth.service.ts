import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/user.model';
import { UserRole } from '../models/enums';
import { delay } from 'rxjs/operators';

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

  constructor() {
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

    // Symulacja logowania
    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (user && credentials.password === 'password') {
      console.log('Logowanie udane dla użytkownika:', user);

      // Zapisz w localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token');

      // Aktualizuj stan
      this.currentUserSubject.next(user);

      console.log('Stan po logowaniu - isLoggedIn:', this.isLoggedIn());
      console.log('Stan po logowaniu - currentUser:', this.getCurrentUser());

      return of(user).pipe(delay(1000)); // Symulacja opóźnienia sieci
    } else {
      console.log('Logowanie nieudane - nieprawidłowe dane');
      return throwError(() => new Error('Nieprawidłowe dane logowania')).pipe(
        delay(1000)
      );
    }
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
    return localStorage.getItem('token');
  }

  // Mock registration (dla przyszłego użycia)
  register(userData: any): Observable<AuthUser> {
    // Symulacja rejestracji
    return throwError(
      () => new Error('Rejestracja nie jest jeszcze dostępna')
    ).pipe(delay(1000));
  }
}
