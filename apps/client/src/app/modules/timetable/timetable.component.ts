import { Component, OnInit, computed, signal } from '@angular/core';
import { TimetableEntry, WeeklyTimetable, WorkDay } from '../../core/models';

import { AuthService } from '../../core/services/auth.service';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Observable } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimetableService } from '../../core/services';
import { TooltipModule } from 'primeng/tooltip';
import { UserRole } from '../../core/models/enums';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    SkeletonModule,
    BadgeModule,
    TooltipModule,
    DividerModule,
    PanelModule,
  ],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
})
export class TimetableComponent implements OnInit {
  weeklyTimetable$!: Observable<WeeklyTimetable>;
  currentLesson$!: Observable<TimetableEntry | null>;
  nextLesson$!: Observable<TimetableEntry | null>;

  isLoading = true;
  currentDay = new Date().getDay();
  currentUser = signal<any>(null);

  // Role-specific computed properties
  userRole = computed(() => this.currentUser()?.role);
  isStudent = computed(() => this.userRole() === UserRole.STUDENT);
  isTeacher = computed(() => this.userRole() === UserRole.TEACHER);
  isParent = computed(() => this.userRole() === UserRole.PARENT);
  isAdmin = computed(() => this.userRole() === UserRole.ADMIN);

  UserRole = UserRole;

  weekDays = [
    { key: WorkDay.MON, label: 'Poniedziałek', short: 'Pon' },
    { key: WorkDay.TUE, label: 'Wtorek', short: 'Wt' },
    { key: WorkDay.WED, label: 'Środa', short: 'Śr' },
    { key: WorkDay.THU, label: 'Czwartek', short: 'Czw' },
    { key: WorkDay.FRI, label: 'Piątek', short: 'Pt' },
  ];

  timeSlots = [
    { period: 1, start: '08:00', end: '08:45' },
    { period: 2, start: '08:55', end: '09:40' },
    { period: 3, start: '09:50', end: '10:35' },
    { period: 4, start: '10:45', end: '11:30' },
    { period: 5, start: '11:40', end: '12:25' },
    { period: 6, start: '12:35', end: '13:20' },
    { period: 7, start: '13:30', end: '14:15' },
    { period: 8, start: '14:25', end: '15:10' },
  ];

  constructor(
    private timetableService: TimetableService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) {
        this.loadTimetableData();
      }
    });
  }

  private loadTimetableData(): void {
    this.isLoading = true;
    const user = this.currentUser();
    
    if (!user) {
      this.isLoading = false;
      return;
    }

    const userId = user.id;

    this.weeklyTimetable$ = this.timetableService.getWeeklyTimetable(userId);
    this.currentLesson$ = this.timetableService.getCurrentLesson(userId);
    this.nextLesson$ = this.timetableService.getNextLesson(userId);

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getLessonForDayAndPeriod(
    timetable: WeeklyTimetable,
    day: WorkDay,
    period: number
  ): TimetableEntry | null {
    const daySchedule = timetable[day];
    return (
      daySchedule?.find((lesson) => lesson.lesson_number === period) || null
    );
  }

  getSubjectColor(subjectName: string): string {
    const colors = [
      '#FF6B6B', // czerwony
      '#4ECDC4', // turkusowy
      '#45B7D1', // niebieski
      '#96CEB4', // zielony
      '#FFEAA7', // żółty
      '#DDA0DD', // lawenda
      '#F7DC6F', // złoty
      '#BB8FCE', // fioletowy
      '#85C1E9', // jasny niebieski
      '#98D8C8', // miętowy
    ];

    const hash = subjectName.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }

  isCurrentTimeSlot(period: number): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const slot = this.timeSlots.find((s) => s.period === period);

    if (!slot) return false;

    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }

  getCurrentDayKey(): WorkDay {
    const today = new Date().getDay();
    switch (today) {
      case 1:
        return WorkDay.MON;
      case 2:
        return WorkDay.TUE;
      case 3:
        return WorkDay.WED;
      case 4:
        return WorkDay.THU;
      case 5:
        return WorkDay.FRI;
      default:
        return WorkDay.MON;
    }
  }

  isToday(day: WorkDay): boolean {
    return day === this.getCurrentDayKey();
  }

  refreshData(): void {
    this.loadTimetableData();
  }

  formatTime(time: string): string {
    return time;
  }

  getLessonDuration(): string {
    return '45 min';
  }

  getCurrentWeekDisplay(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
      });
    };

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  }

  getDayDate(day: WorkDay): string {
    const now = new Date();
    const currentDay = now.getDay();
    const dayNumber = this.getDayNumber(day);

    const targetDate = new Date(now);
    const diff = dayNumber - currentDay;
    targetDate.setDate(now.getDate() + diff);

    return targetDate.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  private getDayNumber(day: WorkDay): number {
    switch (day) {
      case WorkDay.MON:
        return 1;
      case WorkDay.TUE:
        return 2;
      case WorkDay.WED:
        return 3;
      case WorkDay.THU:
        return 4;
      case WorkDay.FRI:
        return 5;
      default:
        return 1;
    }
  }

  getTooltipText(lesson: TimetableEntry): string {
    const teacher = `${lesson.teacherSubject.teacher.name} ${lesson.teacherSubject.teacher.lastname}`;
    const room = lesson.room ? ` - Sala ${lesson.room}` : '';
    const time = `${lesson.startTime} - ${lesson.endTime}`;

    return `${lesson.teacherSubject.subject.name}\n${teacher}\n${time}${room}`;
  }

  onLessonClick(lesson: TimetableEntry): void {
    console.log('Clicked lesson:', lesson);
  }
}
