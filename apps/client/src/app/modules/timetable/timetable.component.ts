import { Component, OnInit } from '@angular/core';
import { TimetableEntry, WeeklyTimetable, WorkDay } from '../../core/models';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
// PrimeNG imports
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Observable } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
// Core imports
import { TimetableService } from '../../core/services';
import { TooltipModule } from 'primeng/tooltip';

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
    PanelModule
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
  
  // Mapowanie dni tygodnia
  weekDays = [
    { key: WorkDay.MON, label: 'Poniedziałek', short: 'Pon' },
    { key: WorkDay.TUE, label: 'Wtorek', short: 'Wt' },
    { key: WorkDay.WED, label: 'Środa', short: 'Śr' },
    { key: WorkDay.THU, label: 'Czwartek', short: 'Czw' },
    { key: WorkDay.FRI, label: 'Piątek', short: 'Pt' }
  ];
  
  // Godziny lekcji
  timeSlots = [
    { period: 1, start: '08:00', end: '08:45' },
    { period: 2, start: '08:55', end: '09:40' },
    { period: 3, start: '09:50', end: '10:35' },
    { period: 4, start: '10:45', end: '11:30' },
    { period: 5, start: '11:40', end: '12:25' },
    { period: 6, start: '12:35', end: '13:20' },
    { period: 7, start: '13:30', end: '14:15' },
    { period: 8, start: '14:25', end: '15:10' }
  ];

  constructor(private timetableService: TimetableService) {}

  ngOnInit(): void {
    this.loadTimetableData();
  }

  private loadTimetableData(): void {
    this.isLoading = true;
    
    const studentId = 1; // Domyślnie pierwszy uczeń
    
    // Pobierz plan tygodniowy
    this.weeklyTimetable$ = this.timetableService.getWeeklyTimetable(studentId);
    
    // Pobierz aktualną lekcję
    this.currentLesson$ = this.timetableService.getCurrentLesson(studentId);
    
    // Pobierz następną lekcję
    this.nextLesson$ = this.timetableService.getNextLesson(studentId);
    
    // Symulacja zakończenia ładowania
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getLessonForDayAndPeriod(timetable: WeeklyTimetable, day: WorkDay, period: number): TimetableEntry | null {
    const daySchedule = timetable[day];
    return daySchedule?.find(lesson => lesson.lesson_number === period) || null;
  }

  getSubjectColor(subjectName: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const hash = subjectName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  isCurrentTimeSlot(period: number): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const slot = this.timeSlots.find(s => s.period === period);
    
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
      case 1: return WorkDay.MON;
      case 2: return WorkDay.TUE;
      case 3: return WorkDay.WED;
      case 4: return WorkDay.THU;
      case 5: return WorkDay.FRI;
      default: return WorkDay.MON; // Domyślnie poniedziałek dla weekendu
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
}
