import { Observable, of } from 'rxjs';
import { TimetableEntry, WeeklyTimetable } from '../models';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { UserRole } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class TimetableService {
  constructor(
    private mockDataService: MockDataService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getStudentTimetable(studentId: number): Observable<TimetableEntry[]> {
    return this.apiService.getStudentByUserId(studentId).pipe(
      switchMap((student: any) => {
        return this.apiService.getTimetableByStudentClass(
          student.studentClass.id
        );
      }),
      map((timetables: any[]) => {
        const mappedTimetable = timetables.map((entry) =>
          this.mapApiToTimetableEntry(entry)
        );
        return mappedTimetable;
      }),
      catchError((error: any) => {
        console.warn('API error, falling back to mock data:', error);
        const student = this.mockDataService.getStudentById(studentId);
        if (!student) {
          return of([]);
        }

        const timetable = this.mockDataService.getTimetableByClass(
          student.studentClass.id
        );

        const mappedTimetable = timetable.map((entry) =>
          this.mapToTimetableEntry(entry)
        );
        return of(mappedTimetable);
      }),
      delay(300)
    );
  }

  getTeacherTimetable(teacherId: number): Observable<TimetableEntry[]> {
    return this.apiService.getTeacherByUserId(teacherId).pipe(
      switchMap((teacher: any) => {
        return this.apiService.getTimetableByTeacher(teacher.id);
      }),
      map((timetables: any[]) => {
        const mappedTimetable = timetables.map((entry) =>
          this.mapApiToTimetableEntry(entry)
        );
        return mappedTimetable;
      }),
      catchError((error: any) => {
        console.warn(
          'API error for teacher timetable, falling back to mock data:',
          error
        );
        return of([]);
      }),
      delay(300)
    );
  }

  getWeeklyTimetable(userId: number): Observable<WeeklyTimetable> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      console.warn('No current user found');
      return of({});
    }

    let timetableObservable: Observable<TimetableEntry[]>;

    if (currentUser.role === UserRole.TEACHER) {
      timetableObservable = this.getTeacherTimetable(userId);
    } else {
      timetableObservable = this.getStudentTimetable(userId);
    }

    return timetableObservable.pipe(
      map((timetableEntries: TimetableEntry[]) => {
        const weeklyTimetable: WeeklyTimetable = {};

        timetableEntries.forEach((entry) => {
          if (!weeklyTimetable[entry.day]) {
            weeklyTimetable[entry.day] = [];
          }
          weeklyTimetable[entry.day].push(entry);
        });

        Object.keys(weeklyTimetable).forEach((day) => {
          weeklyTimetable[day].sort(
            (a, b) => a.lesson_number - b.lesson_number
          );
        });

        return weeklyTimetable;
      })
    );
  }

  getDayTimetable(
    studentId: number,
    day: string
  ): Observable<TimetableEntry[]> {
    const student = this.mockDataService.getStudentById(studentId);
    if (!student) {
      return of([]);
    }

    const timetable = this.mockDataService.getTimetableByClass(
      student.studentClass.id
    );
    const dayTimetable = timetable
      .filter((entry) => entry.day === day)
      .map((entry) => this.mapToTimetableEntry(entry))
      .sort((a, b) => a.lesson_number - b.lesson_number);

    return of(dayTimetable).pipe(delay(500));
  }

  getCurrentLesson(userId: number): Observable<TimetableEntry | null> {
    const now = new Date();
    const currentDay = this.getCurrentDayCode();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return of(null);
    }

    let timetableObservable: Observable<TimetableEntry[]>;

    if (currentUser.role === UserRole.TEACHER) {
      timetableObservable = this.getTeacherTimetable(userId);
    } else {
      timetableObservable = this.getStudentTimetable(userId);
    }

    return timetableObservable.pipe(
      map((timetableEntries: TimetableEntry[]) => {
        const todayLessons = timetableEntries.filter(
          (entry) => entry.day === currentDay
        );

        const currentLesson = todayLessons.find((lesson) => {
          const startTime = this.timeToMinutes(lesson.startTime);
          const endTime = this.timeToMinutes(lesson.endTime);
          return currentTime >= startTime && currentTime <= endTime;
        });

        return currentLesson || null;
      })
    );
  }

  getNextLesson(userId: number): Observable<TimetableEntry | null> {
    const now = new Date();
    const currentDay = this.getCurrentDayCode();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return of(null);
    }

    let timetableObservable: Observable<TimetableEntry[]>;

    if (currentUser.role === UserRole.TEACHER) {
      timetableObservable = this.getTeacherTimetable(userId);
    } else {
      timetableObservable = this.getStudentTimetable(userId);
    }

    return timetableObservable.pipe(
      map((timetableEntries: TimetableEntry[]) => {
        const todayLessons = timetableEntries
          .filter((entry) => entry.day === currentDay)
          .sort((a, b) => a.lesson_number - b.lesson_number);

        const nextLesson = todayLessons.find((lesson) => {
          const startTime = this.timeToMinutes(lesson.startTime);
          return currentTime < startTime;
        });

        return nextLesson || null;
      })
    );
  }

  private mapApiToTimetableEntry(apiEntry: any): TimetableEntry {
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

    const lessonNumber = apiEntry.lesson_number || 1;
    const timeSlot = timeSlots[lessonNumber - 1] || timeSlots[0];

    return {
      lesson_id: apiEntry.lesson_id || apiEntry.id,
      studentClass: apiEntry.studentClass || { id: 0, number: 0, letter: 'A' },
      teacherSubject: {
        id: apiEntry.teacherSubject?.id || apiEntry.id,
        subject: {
          id: apiEntry.teacherSubject?.subject?.id || 0,
          name: apiEntry.teacherSubject?.subject?.name || 'Unknown Subject',
        },
        teacher: {
          id: apiEntry.teacherSubject?.teacher?.id || 0,
          name: apiEntry.teacherSubject?.teacher?.name || 'Unknown',
          lastname: apiEntry.teacherSubject?.teacher?.lastname || 'Teacher',
        },
      },
      lesson_number: lessonNumber,
      day: apiEntry.day || 'MON',
      startTime: apiEntry.startTime || timeSlot.start,
      endTime: apiEntry.endTime || timeSlot.end,
      room: apiEntry.room || `Sala ${lessonNumber}`,
    };
  }

  private mapToTimetableEntry(mockEntry: any): TimetableEntry {
    return {
      lesson_id: mockEntry.lesson_id,
      studentClass: mockEntry.studentClass,
      teacherSubject: {
        id: mockEntry.lesson_id,
        subject: {
          id: mockEntry.lesson_id,
          name: mockEntry.subjectName,
        },
        teacher: {
          id: mockEntry.lesson_id,
          name: mockEntry.teacherName.split(' ')[0],
          lastname: mockEntry.teacherName.split(' ')[1] || '',
        },
      },
      lesson_number: mockEntry.lesson_number,
      day: mockEntry.day as any,
      startTime: mockEntry.startTime,
      endTime: mockEntry.endTime,
      room: mockEntry.room,
    };
  }

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
      MON: 'Poniedziałek',
      TUE: 'Wtorek',
      WED: 'Środa',
      THU: 'Czwartek',
      FRI: 'Piątek',
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
      '14:25-15:10',
    ];
  }
}
