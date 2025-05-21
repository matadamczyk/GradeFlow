import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarModule,
  CalendarView,
  DateAdapter
} from 'angular-calendar';
import { Component, OnInit, inject } from '@angular/core';
import {
  SchedulerDateFormatter,
  SchedulerEventTimesChangedEvent,
  SchedulerModule,
  SchedulerViewDay,
  SchedulerViewHour,
  SchedulerViewHourSegment
} from 'angular-calendar-scheduler';
import { Subject, takeUntil } from 'rxjs';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getDay,
  getMonth,
  isSameDay,
  isSameMonth,
  setDate,
  setHours,
  setMinutes,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  subDays,
  subHours,
  subMonths,
  subWeeks
} from 'date-fns';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

interface EventColor {
  primary: string;
  secondary: string;
}

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    SchedulerModule
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: SchedulerDateFormatter
    }
  ],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
})
export class TimetableComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private themeService = inject(ThemeService);
  
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  viewDate = new Date();
  refreshSubject = new Subject<any>();
  events: CalendarEvent[] = [];
  locale = 'en';
  hourSegments = 4; // 4 segments per hour = 15 min segments
  hourSegmentHeight = 30; // Smaller height for better visualization
  dayStartHour = 8;
  dayEndHour = 16;
  weekStartsOn = 1; // Monday

  minDate = new Date();
  maxDate = addMonths(new Date(), 1);

  loading = false;
  isDarkMode = false;

  lightModeColors = {
    math: { primary: '#1976d2', secondary: '#d1e8ff' },
    physics: { primary: '#e91e63', secondary: '#fce4ec' },
    cs: { primary: '#009688', secondary: '#e0f2f1' },
    history: { primary: '#ff9800', secondary: '#fff3e0' },
    art: { primary: '#9c27b0', secondary: '#f3e5f5' },
    english: { primary: '#3f51b5', secondary: '#e8eaf6' },
    chemistry: { primary: '#f44336', secondary: '#ffebee' },
    biology: { primary: '#4caf50', secondary: '#e8f5e9' },
    pe: { primary: '#03a9f4', secondary: '#e1f5fe' },
    music: { primary: '#673ab7', secondary: '#ede7f6' }
  };

  darkModeColors = {
    math: { primary: '#42a5f5', secondary: '#1565c0' },
    physics: { primary: '#f06292', secondary: '#c2185b' },
    cs: { primary: '#26a69a', secondary: '#00796b' },
    history: { primary: '#ffb74d', secondary: '#f57c00' },
    art: { primary: '#ba68c8', secondary: '#7b1fa2' },
    english: { primary: '#7986cb', secondary: '#303f9f' },
    chemistry: { primary: '#ef5350', secondary: '#b71c1c' },
    biology: { primary: '#66bb6a', secondary: '#1b5e20' },
    pe: { primary: '#29b6f6', secondary: '#01579b' },
    music: { primary: '#9575cd', secondary: '#4527a0' }
  };

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
        this.loadEvents();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeDate(days: number): void {
    this.viewDate = addDays(this.viewDate, days);
    this.refreshSubject.next(true);
  }

  resetDate(): void {
    this.viewDate = new Date();
    this.refreshSubject.next(true);
  }

  handleDayClick(event: any): void {
    this.viewDate = event.day.date;
    this.changeView(CalendarView.Day);
  }

  // Helper function to create dates relative to the view date
  createEventDate(dayOffset: number, hours: number, minutes = 0): Date {
    const date = new Date(this.viewDate);
    const targetDate = addDays(date, dayOffset);
    return setMinutes(setHours(startOfDay(targetDate), hours), minutes);
  }

  // Helper function to create classes with specific duration
  createClass(
    id: number,
    title: string,
    dayOffset: number,
    startHour: number,
    startMinute: number,
    durationMinutes: number,
    colorType: keyof typeof this.lightModeColors
  ): CalendarEvent {
    const colors = this.isDarkMode ? this.darkModeColors : this.lightModeColors;
    const start = this.createEventDate(dayOffset, startHour, startMinute);
    return {
      id,
      title,
      start,
      end: addMinutes(start, durationMinutes),
      color: colors[colorType],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    };
  }

  loadEvents(): void {
    this.loading = true;
    
    // Generate events for the entire week
    this.events = [
      // Monday
      this.createClass(1, 'Math Lecture', 0, 9, 0, 90, 'math'),
      this.createClass(2, 'Computer Science Lab', 0, 11, 0, 120, 'cs'),
      this.createClass(3, 'English Literature', 0, 14, 30, 90, 'english'),
      this.createClass(4, 'Physics Study Group', 0, 16, 30, 60, 'physics'),
      
      // Tuesday
      this.createClass(5, 'Physics Lab', 1, 8, 30, 120, 'physics'),
      this.createClass(6, 'Chemistry Lecture', 1, 11, 0, 90, 'chemistry'),
      this.createClass(7, 'History of Science', 1, 13, 30, 90, 'history'),
      this.createClass(8, 'Art Workshop', 1, 16, 0, 120, 'art'),
      
      // Wednesday
      this.createClass(9, 'Biology Lab', 2, 9, 0, 120, 'biology'),
      this.createClass(10, 'Math Practice', 2, 11, 30, 90, 'math'),
      this.createClass(11, 'Computer Science Theory', 2, 14, 0, 90, 'cs'),
      this.createClass(12, 'Music Appreciation', 2, 16, 0, 60, 'music'),
      
      // Thursday
      this.createClass(13, 'English Composition', 3, 8, 30, 90, 'english'),
      this.createClass(14, 'Physical Education', 3, 10, 30, 60, 'pe'),
      this.createClass(15, 'Chemistry Lab', 3, 13, 0, 120, 'chemistry'),
      this.createClass(16, 'Computer Science Project', 3, 16, 0, 120, 'cs'),
      
      // Friday
      this.createClass(17, 'Math Advanced Topics', 4, 9, 0, 90, 'math'),
      this.createClass(18, 'Biology Lecture', 4, 11, 0, 90, 'biology'),
      this.createClass(19, 'History Seminar', 4, 13, 30, 90, 'history'),
      this.createClass(20, 'Art History', 4, 15, 30, 90, 'art'),
      
      // Some weekend activities
      this.createClass(21, 'Study Group - Physics', 5, 10, 0, 120, 'physics'),
      this.createClass(22, 'Music Practice', 5, 14, 0, 120, 'music'),
      this.createClass(23, 'Biology Field Trip', 6, 9, 0, 180, 'biology'),
      this.createClass(24, 'Chess Club', 6, 14, 0, 120, 'cs')
    ];
    
    setTimeout(() => {
      this.loading = false;
      this.refreshSubject.next(true);
    }, 500);
  }

  changeView(view: CalendarView): void {
    this.view = view;
  }

  eventTimesChanged({ event, newStart, newEnd }: SchedulerEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refreshSubject.next(true);
  }

  viewDaysOptionChanged(viewDays: number): void {
    console.log('viewDaysOptionChanged', viewDays);
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked', hour);
  }

  segmentClicked(segment: SchedulerViewHourSegment): void {
    console.log('segmentClicked', segment);
  }

  eventClicked(event: CalendarEvent): void {
    console.log('eventClicked', event);
  }
}
