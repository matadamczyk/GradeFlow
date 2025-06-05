import {
  AuthService,
  GradesService,
  TimetableService,
} from '../../core/services';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Observable, Subject, forkJoin, of, takeUntil } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserRole } from '../../core/models/enums';

interface DashboardData {
  recentGrades: any[];
  gradeStatistics: any;
  currentLesson: any;
  nextLesson: any;
  todayTimetable: any[];
  notifications: any[];
  // Role-specific data
  teacherData?: {
    classes: any[];
    pendingGrades: any[];
    todaySchedule: any[];
    studentProgress: any[];
  };
  parentData?: {
    children: any[];
    upcomingEvents: any[];
    messages: any[];
  };
  adminData?: {
    systemStats: any;
    recentActivity: any[];
    alerts: any[];
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule,
    BadgeModule,
    TooltipModule,
    DividerModule,
    AvatarModule,
    ChartModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = signal<boolean>(true);
  currentUser = signal<any>(null);
  dashboardData = signal<DashboardData | null>(null);

  gradesTrendChart = signal<any>(null);
  subjectAveragesChart = signal<any>(null);

  userRole = computed(() => this.currentUser()?.role);
  userName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.name} ${user.lastname}` : 'Użytkownik';
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dzień dobry';
    if (hour < 18) return 'Dzień dobry';
    return 'Dobry wieczór';
  });

  // Role-specific computed properties
  isStudent = computed(() => this.userRole() === UserRole.STUDENT);
  isTeacher = computed(() => this.userRole() === UserRole.TEACHER);
  isParent = computed(() => this.userRole() === UserRole.PARENT);
  isAdmin = computed(() => this.userRole() === UserRole.ADMIN);

  // Role-specific greetings
  roleGreeting = computed(() => {
    const role = this.userRole();
    const greeting = this.greeting();
    
    switch (role) {
      case UserRole.TEACHER:
        return `${greeting}, ${this.currentUser()?.lastname ? 'Pani/Panu ' + this.currentUser()?.lastname : this.userName()}`;
      case UserRole.PARENT:
        return `${greeting}, ${this.userName()}`;
      case UserRole.ADMIN:
        return `${greeting}, ${this.userName()}`;
      default:
        return `${greeting}, ${this.userName()}`;
    }
  });

  // Computed properties for template
  unreadMessagesCount = computed(() => {
    const messages = this.dashboardData()?.parentData?.messages || [];
    return messages.filter(m => m.unread).length;
  });

  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private gradesService: GradesService,
    private timetableService: TimetableService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser.set(user);
        if (user) {
          this.loadDashboardData(user.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(userId: number): void {
    this.isLoading.set(true);
    const userRole = this.userRole();

    // Base data for all roles
    const baseData = {
      currentLesson: this.timetableService.getCurrentLesson(userId),
      nextLesson: this.timetableService.getNextLesson(userId),
      todayTimetable: this.timetableService.getDayTimetable(
        userId,
        this.getCurrentDayCode()
      ),
    };

    // Role-specific data requests
    const requests: Record<string, Observable<any>> = { ...baseData };

    switch (userRole) {
      case UserRole.STUDENT:
        requests['recentGrades'] = this.gradesService.getRecentGrades(userId, 5);
        requests['gradeStatistics'] = this.gradesService.getGradeStatistics(userId);
        break;
      
      case UserRole.TEACHER:
        requests['teacherData'] = this.loadTeacherData(userId);
        break;
      
      case UserRole.PARENT:
        requests['parentData'] = this.loadParentData(userId);
        requests['recentGrades'] = this.gradesService.getRecentGrades(userId, 5);
        break;
      
      case UserRole.ADMIN:
        requests['adminData'] = this.loadAdminData(userId);
        break;
    }

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          const dashboardData: DashboardData = {
            currentLesson: data.currentLesson,
            nextLesson: data.nextLesson,
            todayTimetable: data.todayTimetable,
            notifications: this.generateNotifications(data),
            recentGrades: data.recentGrades || [],
            gradeStatistics: data.gradeStatistics || {},
            teacherData: data.teacherData,
            parentData: data.parentData,
            adminData: data.adminData,
          };

          this.dashboardData.set(dashboardData);
          if (data.gradeStatistics) {
            this.setupCharts(data.gradeStatistics);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Błąd ładowania danych dashboard:', error);
          this.isLoading.set(false);
        },
      });
  }

  private setupCharts(statistics: any): void {
    const trendData = {
      labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'],
      datasets: [
        {
          label: 'Średnia ocen',
          data: [3.5, 3.8, 4.1, 3.9, 4.2, 4.0],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    this.gradesTrendChart.set({
      data: trendData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { min: 1, max: 6 },
        },
      },
    });

    const subjectData = {
      labels: statistics.subjectGrades?.map((sg: any) => sg.subjectName) || [],
      datasets: [
        {
          data:
            statistics.subjectGrades?.map((sg: any) => sg.weightedAverage) ||
            [],
          backgroundColor: [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
            '#98D8C8',
            '#F7DC6F',
          ],
        },
      ],
    };

    this.subjectAveragesChart.set({
      data: subjectData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }

  private generateNotifications(data: any): any[] {
    const notifications = [];

    if (data.currentLesson) {
      notifications.push({
        id: 1,
        type: 'info',
        title: 'Trwa lekcja',
        message: `${data.currentLesson.subjectName} w sali ${data.currentLesson.room}`,
        time: 'teraz',
        icon: 'pi pi-clock',
      });
    }

    if (data.nextLesson) {
      notifications.push({
        id: 2,
        type: 'warning',
        title: 'Następna lekcja',
        message: `${data.nextLesson.subjectName} o ${data.nextLesson.startTime}`,
        time: 'wkrótce',
        icon: 'pi pi-calendar',
      });
    }

    if (data.recentGrades?.length > 0) {
      const latestGrade = data.recentGrades[0];
      notifications.push({
        id: 3,
        type: latestGrade.grade_value >= 4 ? 'success' : 'error',
        title: 'Nowa ocena',
        message: `${latestGrade.subjectName}: ${latestGrade.grade_value}`,
        time: this.formatDate(latestGrade.date),
        icon: 'pi pi-star',
      });
    }

    return notifications;
  }

  private getCurrentDayCode(): string {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[new Date().getDay()];
  }

  getGradeSeverity(grade: number): 'success' | 'info' | 'warn' | 'danger' {
    if (grade >= 5) return 'success';
    if (grade >= 4) return 'info';
    if (grade >= 3) return 'warn';
    return 'danger';
  }

  getNotificationSeverity(
    type: string
  ): 'success' | 'info' | 'warn' | 'danger' {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warn';
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pl-PL');
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getAverageProgress(average: number): number {
    return (average / 6) * 100;
  }

  navigateToGrades(): void {
    this.router.navigate(['/grades']);
  }

  navigateToTimetable(): void {
    this.router.navigate(['/timetable']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  refreshDashboard(): void {
    const user = this.currentUser();
    if (user) {
      this.loadDashboardData(user.id);
    }
  }

  private loadTeacherData(userId: number): Observable<any> {
    // Mock data for teacher
    return of({
      classes: [
        { name: '3A', studentsCount: 25, subject: 'Matematyka' },
        { name: '2B', studentsCount: 22, subject: 'Fizyka' },
        { name: '1C', studentsCount: 20, subject: 'Informatyka' }
      ],
      pendingGrades: [
        { studentName: 'Jan Kowalski', assignment: 'Praca klasowa', date: '2024-01-15' },
        { studentName: 'Anna Nowak', assignment: 'Kartkówka', date: '2024-01-14' }
      ],
      todaySchedule: [
        { time: '08:00', class: '3A', subject: 'Matematyka', room: '15' },
        { time: '09:00', class: '2B', subject: 'Fizyka', room: '12' }
      ],
      studentProgress: [
        { class: '3A', average: 4.2, improvement: '+0.3' },
        { class: '2B', average: 3.8, improvement: '-0.1' }
      ]
    }).pipe(delay(500));
  }

  private loadParentData(userId: number): Observable<any> {
    // Mock data for parent
    return of({
      children: [
        { name: 'Adam Nowicki', class: '3A', average: 4.2, attendance: 95 },
        { name: 'Ewa Nowicka', class: '1B', average: 4.5, attendance: 98 }
      ],
      upcomingEvents: [
        { title: 'Wywiadówka', date: '2024-01-20', time: '18:00' },
        { title: 'Wycieczka klasy 3A', date: '2024-01-25', time: '08:00' }
      ],
      messages: [
        { from: 'Anna Kowalska', subject: 'Oceny z matematyki', unread: true },
        { from: 'Sekretariat', subject: 'Informacja o opłatach', unread: false }
      ]
    }).pipe(delay(500));
  }

  private loadAdminData(userId: number): Observable<any> {
    // Mock data for admin
    return of({
      systemStats: {
        totalUsers: 1250,
        activeUsers: 1100,
        newRegistrations: 15,
        systemLoad: 65
      },
      recentActivity: [
        { action: 'Nowy użytkownik', user: 'Jan Kowalski', time: '10:30' },
        { action: 'Błąd systemu', details: 'Database timeout', time: '09:15' }
      ],
      alerts: [
        { type: 'warning', message: 'Wysokie obciążenie serwera', priority: 'medium' },
        { type: 'info', message: 'Zaplanowana konserwacja', priority: 'low' }
      ]
    }).pipe(delay(500));
  }
}
