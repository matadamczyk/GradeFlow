import { AuthService, AuthUser } from './auth.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { GradesService } from './grades.service';
import { Injectable } from '@angular/core';
import { UserRole } from '../models/enums';

export interface UserProfile extends AuthUser {
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  bio?: string;
  // Pola specyficzne dla różnych ról
  studentClass?: string;
  studentNumber?: string;
  teacherSubjects?: string[];
  parentChildren?: string[];
  lastLogin?: string;
  accountCreated?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  private mockProfiles: UserProfile[] = [
    {
      id: 1,
      email: 'student@gradeflow.com',
      role: UserRole.STUDENT,
      name: 'Adam',
      lastname: 'Nowicki',
      phone: '+48 123 456 789',
      address: 'ul. Aleja 29 Listopada 15, 31-425 Kraków',
      dateOfBirth: '2005-03-15',
      bio: 'Uczeń klasy 3A, interesuje się matematyką i informatyką.',
      studentClass: '3A',
      studentNumber: '15',
      lastLogin: '2024-01-15T10:30:00',
      accountCreated: '2023-09-01T08:00:00',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 2,
      email: 'teacher@gradeflow.com',
      role: UserRole.TEACHER,
      name: 'Anna',
      lastname: 'Kowalska',
      phone: '+48 987 654 321',
      address: 'ul. Nauczycielska 8, 31-425 Kraków',
      dateOfBirth: '1985-07-22',
      bio: 'Nauczyciel matematyki i fizyki z 15-letnim doświadczeniem.',
      teacherSubjects: ['Matematyka', 'Fizyka', 'Informatyka'],
      lastLogin: '2024-01-15T09:15:00',
      accountCreated: '2020-08-15T10:00:00',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 3,
      email: 'parent@gradeflow.com',
      role: UserRole.PARENT,
      name: 'Jan',
      lastname: 'Nowicki',
      phone: '+48 555 123 456',
      address: 'ul. Rodzinna 25, 31-425 Kraków',
      dateOfBirth: '1975-11-10',
      bio: 'Rodzic ucznia Adama Nowickiego, aktywnie uczestniczę w życiu szkoły.',
      parentChildren: ['Adam Nowicki (3A)', 'Ewa Nowicka (1B)'],
      lastLogin: '2024-01-15T18:45:00',
      accountCreated: '2023-09-01T12:00:00',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 4,
      email: 'admin@gradeflow.com',
      role: UserRole.ADMIN,
      name: 'Admin',
      lastname: 'System',
      phone: '+48 800 100 200',
      address: 'ul. Administracyjna 1, 31-425 Kraków',
      bio: 'Administrator systemu GradeFlow.',
      lastLogin: '2024-01-15T07:00:00',
      accountCreated: '2020-01-01T00:00:00',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private gradesService: GradesService
  ) {
    // Subskrybuj zmiany aktualnego użytkownika
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadUserProfile(user.id);
      } else {
        this.userProfileSubject.next(null);
      }
    });
  }

  private loadUserProfile(userId: number): void {
    const profile = this.mockProfiles.find((p) => p.id === userId);
    if (profile) {
      this.userProfileSubject.next(profile);
    }
  }

  getUserProfile(): Observable<UserProfile> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Użytkownik nie jest zalogowany'));
    }

    return this.apiService.getUserById(currentUser.id).pipe(
      map((apiUser: any) => {
        // Map API response to UserProfile
        const profile: UserProfile = {
          id: apiUser.id,
          email: apiUser.email,
          role: apiUser.role as UserRole,
          name: apiUser.name || '',
          lastname: apiUser.lastname || '',
          phone: apiUser.phone || '',
          address: apiUser.address || '',
          dateOfBirth: apiUser.dateOfBirth || '',
          bio: apiUser.bio || '',
          lastLogin: apiUser.lastLogin || new Date().toISOString(),
          accountCreated: apiUser.accountCreated || new Date().toISOString(),
          avatar: apiUser.avatar || `https://ui-avatars.com/api/?name=${apiUser.email}&background=random`,
        };
        return profile;
      }),
      catchError((error: any) => {
        console.warn('API error, falling back to mock data:', error);
        const profile = this.mockProfiles.find((p) => p.id === currentUser.id);
        if (profile) {
          return of(profile);
        } else {
          return throwError(() => new Error('Profil użytkownika nie został znaleziony'));
        }
      }),
      delay(300)
    );
  }

  updateProfile(updateData: ProfileUpdateRequest): Observable<UserProfile> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Użytkownik nie jest zalogowany'));
    }

    const profileIndex = this.mockProfiles.findIndex(
      (p) => p.id === currentUser.id
    );
    if (profileIndex === -1) {
      return throwError(
        () => new Error('Profil użytkownika nie został znaleziony')
      );
    }

    // Aktualizuj profil
    this.mockProfiles[profileIndex] = {
      ...this.mockProfiles[profileIndex],
      ...updateData,
    };

    // Aktualizuj również dane w AuthService
    const updatedAuthUser: AuthUser = {
      ...currentUser,
      name: updateData.name || currentUser.name,
      lastname: updateData.lastname || currentUser.lastname,
    };

    // Zaktualizuj localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedAuthUser));

    // Emit nowy profil
    this.userProfileSubject.next(this.mockProfiles[profileIndex]);

    return of(this.mockProfiles[profileIndex]).pipe(delay(1000));
  }

  changePassword(passwordData: PasswordChangeRequest): Observable<boolean> {
    // Symulacja zmiany hasła
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return throwError(() => new Error('Nowe hasła nie są identyczne'));
    }

    if (passwordData.currentPassword !== 'password') {
      return throwError(() => new Error('Aktualne hasło jest nieprawidłowe'));
    }

    if (passwordData.newPassword.length < 6) {
      return throwError(
        () => new Error('Nowe hasło musi mieć co najmniej 6 znaków')
      );
    }

    return of(true).pipe(delay(1000));
  }

  uploadAvatar(file: File): Observable<string> {
    // Symulacja uploadu avatara
    return of(
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    ).pipe(delay(2000));
  }

  deleteAccount(): Observable<boolean> {
    // Symulacja usunięcia konta
    return of(true).pipe(delay(1500));
  }

  getAccountStatistics(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Użytkownik nie jest zalogowany'));
    }

    switch (currentUser.role) {
      case UserRole.STUDENT:
        // For students, get real statistics from grades
        return this.apiService.getStudentByUserId(currentUser.id).pipe(
          switchMap((student: any) => {
            return this.gradesService.getGradeStatistics(student.id).pipe(
              map((gradeStats: any) => {
                const stats = {
                  totalGrades: gradeStats.totalGrades || 0,
                  averageGrade: gradeStats.overallAverage || 0,
                  attendanceRate: 95, // Still mock - no attendance API
                  completedAssignments: gradeStats.totalGrades || 0,
                  totalAssignments: gradeStats.totalGrades || 0,
                  favoriteSubject: gradeStats.subjectGrades?.length > 0 
                    ? gradeStats.subjectGrades[0].subjectName 
                    : 'Brak danych',
                };
                console.log('Real account statistics for student:', stats);
                return stats;
              })
            );
          }),
          catchError((error: any) => {
            console.warn('Error getting real statistics, falling back to mock:', error);
            return of({
              totalGrades: 0,
              averageGrade: 0,
              attendanceRate: 95,
              completedAssignments: 0,
              totalAssignments: 0,
              favoriteSubject: 'Brak danych',
            });
          })
        );
      
      case UserRole.TEACHER:
        return of({
          totalStudents: 120,
          totalClasses: 5,
          averageClassGrade: 3.8,
          gradedAssignments: 156,
          pendingGrades: 12,
          teachingExperience: 15,
        }).pipe(delay(800));
        
      case UserRole.PARENT:
        return of({
          totalChildren: 2,
          averageGrade: 4.1,
          attendanceRate: 92,
          upcomingEvents: 3,
          unreadMessages: 2,
          meetingsScheduled: 1,
        }).pipe(delay(800));
        
      case UserRole.ADMIN:
        return of({
          totalUsers: 1250,
          totalStudents: 800,
          totalTeachers: 45,
          totalParents: 400,
          systemUptime: 99.8,
          activeClasses: 32,
        }).pipe(delay(800));
        
      default:
        return of({}).pipe(delay(800));
    }
  }
}
