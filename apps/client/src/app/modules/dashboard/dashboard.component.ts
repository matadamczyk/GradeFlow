import {
  ApiService,
  AuthService,
  GradesService,
  TeacherService,
  TimetableService,
} from '../../core/services';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Observable, Subject, forkJoin, of, takeUntil } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

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
  upcomingEvents?: any[];
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
  currentStudent = signal<any>(null);
  dashboardData = signal<DashboardData | null>(null);

  gradesTrendChart = signal<any>(null);
  subjectAveragesChart = signal<any>(null);

  userRole = computed(() => this.currentUser()?.role);
  userName = computed(() => {
    const user = this.currentUser();
    const student = this.currentStudent();

    if (user?.role === UserRole.STUDENT && student) {
      return `${student.name} ${student.lastname}`;
    }

    return user ? `${user.email}` : 'Użytkownik';
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dzień dobry';
    if (hour < 18) return 'Dzień dobry';
    return 'Dobry wieczór';
  });

  isStudent = computed(() => this.userRole() === UserRole.STUDENT);
  isTeacher = computed(() => this.userRole() === UserRole.TEACHER);
  isParent = computed(() => this.userRole() === UserRole.PARENT);
  isAdmin = computed(() => this.userRole() === UserRole.ADMIN);

  roleGreeting = computed(() => {
    const role = this.userRole();
    const greeting = this.greeting();
    const user = this.currentUser();
    const student = this.currentStudent();

    switch (role) {
      case UserRole.STUDENT:
        if (student) {
          return `${greeting}, ${student.name}`;
        }
        return `${greeting}, ${user?.email}`;
      case UserRole.TEACHER:
        return `${greeting}, ${user?.email}`;
      case UserRole.PARENT:
        return `${greeting}, ${user?.email}`;
      case UserRole.ADMIN:
        return `${greeting}, ${user?.email}`;
      default:
        return `${greeting}, ${user?.email}`;
    }
  });

  nameGreeting = computed(() => {
    const user = this.currentUser();
    const student = this.currentStudent();
    const greeting = this.greeting();

    if (user?.role === UserRole.STUDENT && student) {
      return `${greeting}, ${student.name} ${student.lastname}`;
    }

    return `${greeting}, ${user?.email}`;
  });

  unreadMessagesCount = computed(() => {
    const messages = this.dashboardData()?.parentData?.messages || [];
    return messages.filter((m) => m.unread).length;
  });

  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private gradesService: GradesService,
    private timetableService: TimetableService,
    private apiService: ApiService,
    private router: Router,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.testApiConnection();

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser.set(user);
        if (user) {
          this.loadDashboardData(user.id);
        }
      });
  }

  private testApiConnection(): void {
    this.apiService.getAllUsers().subscribe({
      error: (error) => {
        console.error('❌ API connection failed:', error);
      },
    });
  }

  private calculateSystemLoad(data: any): number {

    const totalUsers = data.users.length;
    const activeUsers = data.users.filter(
      (u: any) => u.isActive !== false
    ).length;
    const totalStudents = data.students.length;
    const totalTeachers = data.teachers.length;
    const totalGrades = data.grades?.length || 0;

  
    const userLoad = Math.min((totalUsers / 100) * 40, 40);


    const activityLoad = totalUsers > 0 ? (activeUsers / totalUsers) * 30 : 0;

    const dataLoad = Math.min((totalGrades / 1000) * 20, 20);

    const randomFactor = Math.random() * 10;

    const totalLoad = Math.round(
      userLoad + activityLoad + dataLoad + randomFactor
    );
    return Math.min(totalLoad, 100);
  }

  private generateRecentActivity(data: any): any[] {
    const activities: any[] = [];
    const now = new Date();


    const recentUsers = data.users
      .filter((u: any) => {
        if (!u.createdAt) return false;
        const userDate = new Date(u.createdAt);
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        return userDate > threeDaysAgo;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);

    recentUsers.forEach((user: any) => {
      const createdDate = new Date(user.createdAt);
      activities.push({
        action: 'Nowa rejestracja',
        user: `${user.email} (${user.role})`,
        time: this.formatActivityTime(createdDate),
        icon: 'pi-user-plus',
        severity: 'success',
      });
    });

    if (data.grades && data.grades.length > 0) {
      const recentGrades = data.grades
        .filter((g: any) => {
          if (!g.date) return false;
          const gradeDate = new Date(g.date);
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          return gradeDate > oneDayAgo;
        })
        .slice(0, 2);

      recentGrades.forEach((grade: any) => {
        const gradeDate = new Date(grade.date);
        activities.push({
          action: 'Nowa ocena',
          user: `Ocena ${grade.grade_value} dodana`,
          time: this.formatActivityTime(gradeDate),
          icon: 'pi-star',
          severity: 'info',
        });
      });
    }

    activities.push({
      action: 'System aktywny',
      user: `${
        data.users.filter((u: any) => u.isActive !== false).length
      } aktywnych użytkowników`,
      time: this.formatActivityTime(now),
      icon: 'pi-check-circle',
      severity: 'info',
    });

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }

  private generateSystemAlerts(systemStats: any, data: any): any[] {
    const alerts: any[] = [];

    if (systemStats.systemLoad > 80) {
      alerts.push({
        type: 'error',
        message: `Wysokie obciążenie systemu: ${systemStats.systemLoad}%`,
        priority: 'high',
        icon: 'pi-exclamation-triangle',
      });
    } else if (systemStats.systemLoad > 60) {
      alerts.push({
        type: 'warn',
        message: `Średnie obciążenie systemu: ${systemStats.systemLoad}%`,
        priority: 'medium',
        icon: 'pi-info-circle',
      });
    }

    if (systemStats.newRegistrations > 10) {
      alerts.push({
        type: 'success',
        message: `${systemStats.newRegistrations} nowych rejestracji w tym tygodniu`,
        priority: 'low',
        icon: 'pi-users',
      });
    }

    const inactiveUsers = systemStats.totalUsers - systemStats.activeUsers;
    if (inactiveUsers > systemStats.totalUsers * 0.3) {
      alerts.push({
        type: 'warn',
        message: `${inactiveUsers} nieaktywnych użytkowników w systemie`,
        priority: 'medium',
        icon: 'pi-user-minus',
      });
    }

    alerts.push({
      type: 'info',
      message: `System zarządza ${systemStats.totalUsers} użytkownikami`,
      priority: 'low',
      icon: 'pi-info',
    });

    return alerts.slice(0, 3);
  }

  private formatActivityTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Teraz';
    } else if (diffMins < 60) {
      return `${diffMins} min temu`;
    } else if (diffHours < 24) {
      return `${diffHours} godz. temu`;
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(userId: number): void {
    this.isLoading.set(true);
    const userRole = this.userRole();

    if (userRole === UserRole.STUDENT) {
      this.apiService.getStudentByUserId(userId).subscribe({
        next: (student: any) => {
          this.currentStudent.set(student);
          this.loadStudentDashboardData(userId, student.id);
        },
        error: (error) => {
          console.error('Dashboard: Error getting student data:', error);
          this.isLoading.set(false);
        },
      });
    } else {
      this.loadGeneralDashboardData(userId, userRole);
    }
  }

  private loadStudentDashboardData(userId: number, studentId: number): void {
    const baseData = {
      currentLesson: this.timetableService.getCurrentLesson(userId),
      nextLesson: this.timetableService.getNextLesson(userId),
      todayTimetable: this.timetableService.getDayTimetable(
        userId,
        this.getCurrentDayCode()
      ),
      recentGrades: this.gradesService.getRecentGrades(studentId, 5),
      gradeStatistics: this.gradesService.getGradeStatistics(studentId),
      upcomingEvents: this.loadStudentEvents(studentId),
    };

    forkJoin(baseData)
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
            upcomingEvents: data.upcomingEvents || [],
          };

          this.dashboardData.set(dashboardData);
          if (data.gradeStatistics) {
            this.setupCharts(data.gradeStatistics);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('❌ Błąd ładowania danych dashboard studenta:', error);
          this.isLoading.set(false);
        },
      });
  }

  private loadGeneralDashboardData(userId: number, userRole: string): void {
    const baseData = {
      currentLesson: this.timetableService.getCurrentLesson(userId),
      nextLesson: this.timetableService.getNextLesson(userId),
      todayTimetable: this.timetableService.getDayTimetable(
        userId,
        this.getCurrentDayCode()
      ),
    };

    const requests: Record<string, Observable<any>> = { ...baseData };

    switch (userRole) {
      case UserRole.TEACHER:
        requests['teacherData'] = this.loadTeacherData(userId);
        break;

      case UserRole.PARENT:
        requests['parentData'] = this.loadParentData(userId);
        requests['recentGrades'] = this.gradesService.getRecentGrades(
          userId,
          5
        );
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
            upcomingEvents: data.upcomingEvents || [],
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
    const trendLabels = statistics.monthlyTrends?.map(
      (trend: any) => trend.month
    ) || ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'];

    const trendValues =
      statistics.monthlyTrends?.map((trend: any) => trend.average) || [];

    if (
      trendValues.length === 0 ||
      trendValues.every((val: number) => val === 0)
    ) {
      const baseAverage = statistics.overallAverage || 3.5;
      const adjustedValues = trendLabels.map((_: string, index: number) => {
        return Math.round((baseAverage + index * 0.1) * 100) / 100;
      });
      trendValues.splice(0, trendValues.length, ...adjustedValues);
    }

    const trendData = {
      labels: trendLabels,
      datasets: [
        {
          label: 'Średnia ocen',
          data: trendValues,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    this.gradesTrendChart.set({
      data: trendData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function (context: any) {
                return `Miesiąc: ${context[0].label}`;
              },
              label: function (context: any) {
                return `Średnia: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
              },
            },
          },
          y: {
            min: 1,
            max: 6,
            grid: {
              color: 'rgba(107, 114, 128, 0.1)',
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
              },
              stepSize: 1,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
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
            '#FF8A65',
            '#81C784',
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#ffffff',
        },
      ],
    };

    this.subjectAveragesChart.set({
      data: subjectData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function (context: any) {
                return `${context.label}: ${context.parsed}`;
              },
            },
          },
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
        message: `${
          data.currentLesson.teacherSubject?.subject?.name ||
          'Nieznany przedmiot'
        } w sali ${data.currentLesson.room || 'Nieznana sala'}`,
        time: 'teraz',
        icon: 'pi pi-clock',
      });
    }

    if (data.nextLesson) {
      notifications.push({
        id: 2,
        type: 'warning',
        title: 'Następna lekcja',
        message: `${
          data.nextLesson.teacherSubject?.subject?.name || 'Nieznany przedmiot'
        } o ${data.nextLesson.startTime}`,
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

  getEventIcon(type: string): string {
    switch (type) {
      case 'test':
        return 'pi-file-edit';
      case 'quiz':
        return 'pi-file';
      case 'trip':
        return 'pi-map-marker';
      case 'presentation':
        return 'pi-desktop';
      case 'meeting':
        return 'pi-users';
      case 'event':
        return 'pi-calendar';
      default:
        return 'pi-calendar';
    }
  }

  getEventTypeLabel(type: string): string {
    switch (type) {
      case 'test':
        return 'Sprawdzian';
      case 'quiz':
        return 'Kartkówka';
      case 'trip':
        return 'Wycieczka';
      case 'presentation':
        return 'Prezentacja';
      case 'meeting':
        return 'Zebranie';
      case 'event':
        return 'Wydarzenie';
      default:
        return 'Wydarzenie';
    }
  }

  getDaysUntilEvent(date: string): number {
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  refreshDashboard(): void {
    const user = this.currentUser();
    if (user) {
      this.loadDashboardData(user.id);
    }
  }

  private loadTeacherData(userId: number): Observable<any> {
    return this.teacherService.getTeacherDashboardDataByUserId(userId).pipe(
      map((teacherData: any) => {
        if (!teacherData) {
          console.warn('No teacher data found for userId:', userId);
          return {
            classes: [
              { name: '3A', studentsCount: 25, subject: 'Matematyka' },
              { name: '2B', studentsCount: 22, subject: 'Fizyka' },
              { name: '1C', studentsCount: 20, subject: 'Informatyka' },
            ],
            pendingGrades: [
              {
                studentName: 'Jan Kowalski',
                assignment: 'Praca klasowa',
                date: '2024-01-15',
              },
              {
                studentName: 'Anna Nowak',
                assignment: 'Kartkówka',
                date: '2024-01-14',
              },
            ],
            todaySchedule: [
              { time: '08:00', class: '3A', subject: 'Matematyka', room: '15' },
              { time: '09:00', class: '2B', subject: 'Fizyka', room: '12' },
            ],
            studentProgress: [
              { class: '3A', average: 4.2, improvement: '+0.3' },
              { class: '2B', average: 3.8, improvement: '-0.1' },
            ],
          };
        }

        return {
          classes: teacherData.classes.map((cls: any) => ({
            name: `${cls.number}${cls.letter}`,
            studentsCount:
              teacherData.studentProgress.find(
                (sp: any) => sp.class === `${cls.number}${cls.letter}`
              )?.studentsCount || 0,
            subject:
              teacherData.subjects.length > 0
                ? teacherData.subjects[0].name
                : 'Brak przedmiotu',
          })),
          pendingGrades: teacherData.pendingGrades || [],
          todaySchedule: teacherData.todaySchedule || [],
          studentProgress: teacherData.studentProgress || [],
          totalStudents: teacherData.totalStudents || 0,
          totalClasses: teacherData.totalClasses || 0,
        };
      }),
      catchError((error: any) => {
        console.error('Error loading teacher data:', error);
        return of({
          classes: [
            { name: '3A', studentsCount: 25, subject: 'Matematyka' },
            { name: '2B', studentsCount: 22, subject: 'Fizyka' },
          ],
          pendingGrades: [
            {
              studentName: 'Błąd ładowania',
              assignment: 'Problem z API',
              date: new Date().toISOString().split('T')[0],
            },
          ],
          todaySchedule: [],
          studentProgress: [],
        });
      })
    );
  }

  private loadParentData(userId: number): Observable<any> {
    return of({
      children: [
        { name: 'Adam Nowicki', class: '3A', average: 4.2, attendance: 95 },
        { name: 'Ewa Nowicka', class: '1B', average: 4.5, attendance: 98 },
      ],
      upcomingEvents: [
        { title: 'Wywiadówka', date: '2024-01-20', time: '18:00' },
        { title: 'Wycieczka klasy 3A', date: '2024-01-25', time: '08:00' },
      ],
      messages: [
        { from: 'Anna Kowalska', subject: 'Oceny z matematyki', unread: true },
        {
          from: 'Sekretariat',
          subject: 'Informacja o opłatach',
          unread: false,
        },
      ],
    }).pipe(delay(500));
  }

  private loadAdminData(userId: number): Observable<any> {
    return forkJoin({
      users: this.apiService.getAllUsers(),
      students: this.apiService.getAllStudents(),
      teachers: this.apiService.getAllTeachers(),
      grades: this.apiService.getAllGrades(),
    }).pipe(
      map((data: any) => {
        const systemStats = {
          totalUsers: data.users.length,
          activeUsers: data.users.filter((u: any) => u.isActive !== false)
            .length,
          newRegistrations: data.users.filter((u: any) => {
            if (!u.createdAt) return false;
            const userDate = new Date(u.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return userDate > weekAgo;
          }).length,
          systemLoad: this.calculateSystemLoad(data),
        };

        const recentActivity = this.generateRecentActivity(data);

        const alerts = this.generateSystemAlerts(systemStats, data);

        return { systemStats, recentActivity, alerts };
      }),
      catchError((error: any) => {
        console.error('Error loading admin data:', error);
        return of({
          systemStats: {
            totalUsers: 0,
            activeUsers: 0,
            newRegistrations: 0,
            systemLoad: 0,
          },
          recentActivity: [
            {
              action: 'Błąd ładowania',
              details: 'Problem z API',
              time: 'Teraz',
            },
          ],
          alerts: [
            {
              type: 'warning',
              message: 'Problem z połączeniem API',
              priority: 'high',
            },
          ],
        });
      })
    );
  }

  private loadStudentEvents(studentId: number): Observable<any[]> {
    const student = this.currentStudent();

    if (!student || !student.studentClass?.id) {
      return of([]);
    }

    const classId = student.studentClass.id;

    return this.gradesService.getEventsByClass(classId).pipe(
      map((events: any[]) => {
        return events
          .map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description || '',
            date: event.date,
            time: this.getLessonStartTime(event.lesson?.lesson_number),
            type: this.extractEventType(event.title),
            subject:
              event.lesson?.teacherSubject?.subject?.name ||
              'Nieznany przedmiot',
            teacher: this.getTeacherFullName(
              event.lesson?.teacherSubject?.teacher
            ),
            severity: this.getEventSeverity(this.extractEventType(event.title)),
            lesson: event.lesson,
          }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
      }),
      catchError((error: any) => {
        console.error('Error loading student events:', error);
        return of([]);
      })
    );
  }

  private getLessonStartTime(lessonNumber: number): string {
    const timeSlots = [
      { start: '08:00', end: '08:45' },
      { start: '08:55', end: '09:40' },
      { start: '09:50', end: '10:35' },
      { start: '10:45', end: '11:30' },
      { start: '11:40', end: '12:25' },
      { start: '12:35', end: '13:20' },
      { start: '13:30', end: '14:15' },
      { start: '14:25', end: '15:10' },
    ];

    if (!lessonNumber || lessonNumber < 1 || lessonNumber > timeSlots.length) {
      return '08:00'; 
    }

    return timeSlots[lessonNumber - 1].start;
  }

  private extractEventType(title: string): string {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('sprawdzian')) return 'test';
    if (titleLower.includes('kartkówka') || titleLower.includes('kartkowka'))
      return 'quiz';
    if (titleLower.includes('wycieczka')) return 'trip';
    if (titleLower.includes('prezentacja')) return 'presentation';
    if (titleLower.includes('zebranie')) return 'meeting';
    return 'event';
  }

  private getEventSeverity(
    type: string
  ): 'success' | 'info' | 'warn' | 'danger' {
    switch (type) {
      case 'test':
        return 'warn';
      case 'quiz':
        return 'info';
      case 'trip':
        return 'success';
      case 'presentation':
        return 'info';
      case 'meeting':
        return 'warn';
      default:
        return 'info';
    }
  }

  private getTeacherFullName(teacher: any): string {
    if (!teacher) return 'Nieznany nauczyciel';
    return `${teacher.name} ${teacher.lastname}`.trim();
  }
}
