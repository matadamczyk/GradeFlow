import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getTeacherDashboardData(teacherId: number): Observable<any> {
    return forkJoin({
      teachers: this.apiService.getAllTeachers(),
      classes: this.apiService.getAllClasses(),
      students: this.apiService.getAllStudents(),
      teacherSubjects: this.apiService.getTeacherSubjectAssignments(),
      timetables: this.apiService.getAllTimetables(),
      grades: this.apiService.getAllGrades(),
    }).pipe(
      map((data) => {
        const currentTeacher = data.teachers.find(
          (t: any) => t.id === teacherId
        );
        if (!currentTeacher) {
          throw new Error('Teacher not found');
        }

        const teacherSubjects = data.teacherSubjects.filter(
          (ts: any) => ts.teacher.id === teacherId
        );

        const teacherClasses = this.getTeacherClasses(
          teacherId,
          data.timetables,
          data.classes,
          teacherSubjects
        );

        const teacherStudents = this.getTeacherStudents(
          teacherClasses,
          data.students
        );

        const todaySchedule = this.getTodayScheduleForTeacher(
          teacherId,
          data.timetables,
          teacherSubjects,
          data.classes
        );

        const studentProgress = this.calculateStudentProgress(
          teacherClasses,
          teacherStudents,
          data.grades,
          teacherSubjects
        );

        const pendingGrades = this.getPendingGrades(teacherStudents);

        return {
          teacher: currentTeacher,
          classes: teacherClasses,
          subjects: teacherSubjects.map((ts: any) => ts.subject),
          pendingGrades,
          todaySchedule,
          studentProgress,
          totalStudents: teacherStudents.length,
          totalClasses: teacherClasses.length,
        };
      }),
      catchError((error: any) => {
        console.error('Error loading teacher dashboard data:', error);
        return of(null);
      })
    );
  }

  getTeacherDashboardDataByUserId(userId: number): Observable<any> {
    return this.apiService.getTeacherByUserId(userId).pipe(
      switchMap((teacher: any) => {
        return this.getTeacherDashboardData(teacher.id);
      }),
      catchError((error: any) => {
        console.error('Error loading teacher by userId:', error);
        return of(null);
      })
    );
  }

  private getTeacherClasses(
    teacherId: number,
    timetables: any[],
    classes: any[],
    teacherSubjects: any[]
  ): any[] {
    const teacherSubjectIds = teacherSubjects.map((ts: any) => ts.id);

    const classIds = new Set(
      timetables
        .filter((t: any) => teacherSubjectIds.includes(t.teacherSubject.id))
        .map((t: any) => t.studentClass.id)
    );

    return classes.filter((c: any) => classIds.has(c.id));
  }

  private getTeacherStudents(teacherClasses: any[], students: any[]): any[] {
    const classIds = teacherClasses.map((c: any) => c.id);
    return students.filter((s: any) => classIds.includes(s.studentClass.id));
  }

  private getTodayScheduleForTeacher(
    teacherId: number,
    timetables: any[],
    teacherSubjects: any[],
    classes: any[]
  ): any[] {
    const today = this.getCurrentDayCode();
    const teacherSubjectIds = teacherSubjects.map((ts: any) => ts.id);

    return timetables
      .filter(
        (t: any) =>
          t.day === today && teacherSubjectIds.includes(t.teacherSubject.id)
      )
      .map((t: any) => ({
        time: this.getLessonTime(t.lesson_number),
        class: `${t.studentClass.number}${t.studentClass.letter}`,
        subject: t.teacherSubject.subject.name,
        room: t.room || 'Brak',
        lesson_number: t.lesson_number,
      }))
      .sort((a: any, b: any) => a.lesson_number - b.lesson_number);
  }

  private calculateStudentProgress(
    teacherClasses: any[],
    teacherStudents: any[],
    grades: any[],
    teacherSubjects: any[]
  ): any[] {
    const teacherSubjectIds = teacherSubjects.map((ts: any) => ts.id);

    return teacherClasses.map((cls: any) => {
      const classStudents = teacherStudents.filter(
        (s: any) => s.studentClass.id === cls.id
      );

      const classGrades = grades.filter(
        (g: any) =>
          classStudents.some((s: any) => s.id === g.student.id) &&
          teacherSubjectIds.includes(g.teacherSubject.id)
      );

      const average =
        classGrades.length > 0
          ? classGrades.reduce(
              (sum: number, grade: any) => sum + grade.grade_value,
              0
            ) / classGrades.length
          : 0;

      return {
        class: `${cls.number}${cls.letter}`,
        studentsCount: classStudents.length,
        average: Math.round(average * 100) / 100,
        improvement: this.calculateImprovement(classGrades),
      };
    });
  }

  private getPendingGrades(students: any[]): any[] {
    return students.slice(0, 3).map((student: any, index: number) => ({
      studentName: `${student.name} ${student.lastname}`,
      assignment: ['Praca klasowa', 'Kartkówka', 'Projekt'][index],
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      studentId: student.id,
    }));
  }

  private calculateImprovement(grades: any[]): string {
    if (grades.length < 2) return '+0.0';

    const recent = grades.slice(-5);
    const older = grades.slice(-10, -5);

    if (older.length === 0) return '+0.0';

    const recentAvg =
      recent.reduce((sum: number, g: any) => sum + g.grade_value, 0) /
      recent.length;
    const olderAvg =
      older.reduce((sum: number, g: any) => sum + g.grade_value, 0) /
      older.length;

    const improvement = recentAvg - olderAvg;
    return improvement >= 0
      ? `+${improvement.toFixed(1)}`
      : improvement.toFixed(1);
  }

  private getCurrentDayCode(): string {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[new Date().getDay()];
  }

  private getLessonTime(lessonNumber: number): string {
    const times = [
      '08:00',
      '08:55',
      '09:50',
      '10:45',
      '11:40',
      '12:35',
      '13:30',
      '14:25',
      '15:20',
    ];
    return times[lessonNumber - 1] || '08:00';
  }

  getStudentsFromClass(classId: number): Observable<any[]> {
    return this.apiService.getStudentsByClass(classId);
  }

  getStudentGradesForTeacherSubject(
    studentId: number,
    teacherSubjectId: number
  ): Observable<any[]> {
    return this.apiService.getGradesByStudentAndTeacherSubject(
      studentId,
      teacherSubjectId
    );
  }
}
