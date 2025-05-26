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
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private mockUsers: AuthUser[] = [
    { id: 1, email: 'student@gradeflow.com', role: UserRole.STUDENT, name: 'Adam', lastname: 'Nowicki' },
    { id: 2, email: 'teacher@gradeflow.com', role: UserRole.TEACHER, name: 'Anna', lastname: 'Kowalska' },
    { id: 3, email: 'parent@gradeflow.com', role: UserRole.PARENT, name: 'Jan', lastname: 'Nowicki' },
    { id: 4, email: 'admin@gradeflow.com', role: UserRole.ADMIN, name: 'Admin', lastname: 'System' }
  ];

  constructor() {
    // Sprawdź czy użytkownik jest zalogowany (localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthUser> {
    // Symulacja logowania
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token');
      this.currentUserSubject.next(user);
      return of(user).pipe(delay(1000)); // Symulacja opóźnienia sieci
    } else {
      return throwError(() => new Error('Nieprawidłowe dane logowania')).pipe(delay(1000));
    }
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
    return this.currentUserSubject.value !== null;
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
    return throwError(() => new Error('Rejestracja nie jest jeszcze dostępna')).pipe(delay(1000));
  }
} 