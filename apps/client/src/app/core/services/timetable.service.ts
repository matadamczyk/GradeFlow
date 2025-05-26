import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(private mockDataService: MockDataService) {}

  getStudentTimetable(studentId: number): Observable<any[]> {
    // Dla uproszczenia, używamy klasy pierwszego ucznia
    const student = this.mockDataService.getStudentById(studentId);
    if (!student) {
      return of([]);
    }
    
    const timetable = this.mockDataService.getTimetableByClass(student.studentClass.id);
    return of(timetable).pipe(delay(500));
  }

  getWeeklyTimetable(studentId: number): Observable<{[day: string]: any[]}> {
    const student = this.mockDataService.getStudentById(studentId);
    if (!student) {
      return of({});
    }

    const timetable = this.mockDataService.getTimetableByClass(student.studentClass.id);
    const weeklyTimetable: {[day: string]: any[]} = {};

    // Grupuj lekcje według dni
    timetable.forEach(entry => {
      if (!weeklyTimetable[entry.day]) {
        weeklyTimetable[entry.day] = [];
      }
      weeklyTimetable[entry.day].push(entry);
    });

    // Sortuj lekcje w każdym dniu według numeru lekcji
    Object.keys(weeklyTimetable).forEach(day => {
      weeklyTimetable[day].sort((a, b) => a.lesson_number - b.lesson_number);
    });

    return of(weeklyTimetable).pipe(delay(500));
  }

  getDayTimetable(studentId: number, day: string): Observable<any[]> {
    const student = this.mockDataService.getStudentById(studentId);
    if (!student) {
      return of([]);
    }

    const timetable = this.mockDataService.getTimetableByClass(student.studentClass.id);
    const dayTimetable = timetable
      .filter(entry => entry.day === day)
      .sort((a, b) => a.lesson_number - b.lesson_number);

    return of(dayTimetable).pipe(delay(500));
  }

  getCurrentLesson(studentId: number): Observable<any | null> {
    const now = new Date();
    const currentDay = this.getCurrentDayCode();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minuty od północy

    const student = this.mockDataService.getStudentById(studentId);
    if (!student) {
      return of(null);
    }

    const timetable = this.mockDataService.getTimetableByClass(student.studentClass.id);
    const todayLessons = timetable.filter(entry => entry.day === currentDay);

    const currentLesson = todayLessons.find(lesson => {
      const startTime = this.timeToMinutes(lesson.startTime);
      const endTime = this.timeToMinutes(lesson.endTime);
      return currentTime >= startTime && currentTime <= endTime;
    });

    return of(currentLesson || null).pipe(delay(500));
  }

  getNextLesson(studentId: number): Observable<any | null> {
    const now = new Date();
    const currentDay = this.getCurrentDayCode();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const student = this.mockDataService.getStudentById(studentId);
    if (!student) {
      return of(null);
    }

    const timetable = this.mockDataService.getTimetableByClass(student.studentClass.id);
    const todayLessons = timetable
      .filter(entry => entry.day === currentDay)
      .sort((a, b) => a.lesson_number - b.lesson_number);

    const nextLesson = todayLessons.find(lesson => {
      const startTime = this.timeToMinutes(lesson.startTime);
      return currentTime < startTime;
    });

    return of(nextLesson || null).pipe(delay(500));
  }

  // Metody pomocnicze
  private getCurrentDayCode(): string {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = new Date().getDay();
    return days[today];
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getDayLabel(dayCode: string): string {
    const dayLabels: { [key: string]: string } = {
      'MON': 'Poniedziałek',
      'TUE': 'Wtorek',
      'WED': 'Środa',
      'THU': 'Czwartek',
      'FRI': 'Piątek'
    };
    return dayLabels[dayCode] || dayCode;
  }

  getLessonTimeSlots(): string[] {
    return [
      '08:00-08:45',
      '08:55-09:40',
      '09:50-10:35',
      '10:45-11:30',
      '11:40-12:25',
      '12:35-13:20',
      '13:30-14:15',
      '14:25-15:10'
    ];
  }
} 