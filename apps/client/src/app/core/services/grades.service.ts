import { Observable, forkJoin, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  constructor(
    private mockDataService: MockDataService,
    private apiService: ApiService
  ) {}

  getStudentGrades(studentId: number): Observable<any[]> {
    return this.apiService.getGradesByStudent(studentId).pipe(
      map((grades: any[]) => {
        return grades.map((grade) => ({
          ...grade,
          subjectName:
            grade.teacherSubject?.subject?.name ||
            grade.subjectName ||
            'Unknown Subject',
        }));
      }),
      catchError((error: any) => {
        console.warn('API error, falling back to mock data:', error);
        const grades = this.mockDataService.getGradesByStudent(studentId);
        return of(grades);
      }),
      delay(300)
    );
  }

  getGradeStatistics(studentId: number): Observable<any> {
    return this.apiService.getGradesByStudent(studentId).pipe(
      map((grades: any[]) => {
        const totalGrades = grades.length;
        const totalWeightedScore = grades.reduce(
          (sum, grade) => sum + grade.grade_value * (grade.grade_weight || 1),
          0
        );
        const totalWeight = grades.reduce(
          (sum, grade) => sum + (grade.grade_weight || 1),
          0
        );
        const overallAverage =
          totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

        const subjectGrades = this.calculateSubjectGrades(grades);

        const monthlyTrends = this.calculateMonthlyTrends(grades);

        return {
          overallAverage,
          subjectGrades,
          totalGrades,
          monthlyTrends,
        };
      }),
      catchError((error: any) => {
        console.warn('API error, falling back to mock data:', error);
        const subjectGrades = this.mockDataService.getSubjectGrades(studentId);
        const overallAverage =
          this.mockDataService.getOverallAverage(studentId);
        const totalGrades =
          this.mockDataService.getGradesByStudent(studentId).length;
        const mockGrades = this.mockDataService.getGradesByStudent(studentId);
        const monthlyTrends = this.calculateMonthlyTrends(mockGrades);

        return of({
          overallAverage,
          subjectGrades,
          totalGrades,
          monthlyTrends,
        });
      }),
      delay(300)
    );
  }

  private calculateSubjectGrades(grades: any[]): any[] {
    const subjectMap = new Map();

    grades.forEach((grade) => {
      const subjectName =
        grade.teacherSubject?.subject?.name ||
        grade.subjectName ||
        'Unknown Subject';
      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, []);
      }
      const mappedGrade = {
        ...grade,
        subjectName: subjectName,
      };
      subjectMap.get(subjectName).push(mappedGrade);
    });

    return Array.from(subjectMap.entries()).map(
      ([subjectName, subjectGrades]) => {
        const totalWeightedScore = subjectGrades.reduce(
          (sum: number, grade: any) =>
            sum + grade.grade_value * (grade.grade_weight || 1),
          0
        );
        const totalWeight = subjectGrades.reduce(
          (sum: number, grade: any) => sum + (grade.grade_weight || 1),
          0
        );
        const weightedAverage =
          totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

        const average =
          subjectGrades.reduce(
            (sum: number, grade: any) => sum + grade.grade_value,
            0
          ) / subjectGrades.length;

        return {
          subjectName,
          grades: subjectGrades,
          average: average,
          weightedAverage: weightedAverage,
        };
      }
    );
  }

  getSubjectGrades(studentId: number): Observable<any[]> {
    return this.apiService.getGradesByStudent(studentId).pipe(
      map((grades: any[]) => this.calculateSubjectGrades(grades)),
      catchError((error: any) => {
        console.warn('API error, falling back to mock data:', error);
        const subjectGrades = this.mockDataService.getSubjectGrades(studentId);
        return of(subjectGrades);
      }),
      delay(300)
    );
  }

  getRecentGrades(studentId: number, limit = 5): Observable<any[]> {
    return this.apiService.getGradesByStudent(studentId).pipe(
      map((grades: any[]) => {
        const mappedGrades = grades.map((grade) => ({
          ...grade,
          subjectName:
            grade.teacherSubject?.subject?.name ||
            grade.subjectName ||
            'Unknown Subject',
        }));

        return mappedGrades
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      }),
      catchError((error: any) => {
        console.warn('API error, falling back to mock data:', error);
        const allGrades = this.mockDataService.getGradesByStudent(studentId);
        const recentGrades = allGrades
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
        return of(recentGrades);
      }),
      delay(300)
    );
  }

  getGradesBySubject(
    studentId: number,
    subjectName: string
  ): Observable<any[]> {
    const allGrades = this.mockDataService.getGradesByStudent(studentId);
    const subjectGrades = allGrades.filter(
      (grade) => grade.subjectName === subjectName
    );

    return of(subjectGrades).pipe(delay(500));
  }

  getGradesByDateRange(
    studentId: number,
    startDate: Date,
    endDate: Date
  ): Observable<any[]> {
    const allGrades = this.mockDataService.getGradesByStudent(studentId);
    const filteredGrades = allGrades.filter((grade) => {
      const gradeDate = new Date(grade.date);
      return gradeDate >= startDate && gradeDate <= endDate;
    });

    return of(filteredGrades).pipe(delay(500));
  }

  getGradesTrend(studentId: number): Observable<any[]> {
    const grades = this.mockDataService.getGradesByStudent(studentId);
    const trend = grades
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((grade, index) => ({
        date: grade.date,
        grade: grade.grade_value,
        subject: grade.subjectName,
        index: index + 1,
      }));

    return of(trend).pipe(delay(500));
  }

  getSubjectAverages(
    studentId: number
  ): Observable<{ subject: string; average: number }[]> {
    const subjectGrades = this.mockDataService.getSubjectGrades(studentId);
    const averages = subjectGrades.map((sg) => ({
      subject: sg.subjectName,
      average: sg.average,
    }));

    return of(averages).pipe(delay(500));
  }

  private calculateMonthlyTrends(grades: any[]): any[] {
    if (grades.length === 0) {
      return [
        { month: 'Sty', average: 0 },
        { month: 'Lut', average: 0 },
        { month: 'Mar', average: 0 },
        { month: 'Kwi', average: 0 },
        { month: 'Maj', average: 0 },
        { month: 'Cze', average: 0 },
      ];
    }

    const currentYear = new Date().getFullYear();

    const monthNames = [
      'Sty',
      'Lut',
      'Mar',
      'Kwi',
      'Maj',
      'Cze',
      'Lip',
      'Sie',
      'Wrz',
      'Paź',
      'Lis',
      'Gru',
    ];

    const monthlyGrades = new Map<string, any[]>();

    grades.forEach((grade) => {
      const gradeDate = new Date(grade.date);
      if (gradeDate.getFullYear() === currentYear) {
        const monthKey = monthNames[gradeDate.getMonth()];
        if (!monthlyGrades.has(monthKey)) {
          monthlyGrades.set(monthKey, []);
        }
        monthlyGrades.get(monthKey)!.push(grade);
      }
    });

    const trends: any[] = [];
    const currentMonth = new Date().getMonth();

    for (let i = Math.max(0, currentMonth - 5); i <= currentMonth; i++) {
      const monthName = monthNames[i];
      const monthGrades = monthlyGrades.get(monthName) || [];

      if (monthGrades.length > 0) {
        const totalWeightedScore = monthGrades.reduce(
          (sum, grade) => sum + grade.grade_value * (grade.grade_weight || 1),
          0
        );
        const totalWeight = monthGrades.reduce(
          (sum, grade) => sum + (grade.grade_weight || 1),
          0
        );
        const average = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
        trends.push({
          month: monthName,
          average: Math.round(average * 100) / 100,
        });
      } else if (trends.length > 0) {
        trends.push({
          month: monthName,
          average: trends[trends.length - 1].average,
        });
      } else {
        const overallAvg =
          grades.length > 0
            ? (() => {
                const totalWeightedScore = grades.reduce(
                  (sum, grade) =>
                    sum + grade.grade_value * (grade.grade_weight || 1),
                  0
                );
                const totalWeight = grades.reduce(
                  (sum, grade) => sum + (grade.grade_weight || 1),
                  0
                );
                return totalWeight > 0 ? totalWeightedScore / totalWeight : 3.5;
              })()
            : 3.5;
        trends.push({
          month: monthName,
          average: Math.round(overallAvg * 100) / 100,
        });
      }
    }

    if (trends.length < 3) {
      const lastAverage =
        trends.length > 0 ? trends[trends.length - 1].average : 3.5;
      while (trends.length < 6) {
        const monthIndex = (currentMonth - (6 - trends.length)) % 12;
        if (monthIndex < 0) break;
        trends.unshift({
          month: monthNames[monthIndex],
          average: lastAverage,
        });
      }
    }

    return trends;
  }

  getTeacherClasses(teacherId: number): Observable<any[]> {
    return this.apiService.getTeacherClasses(teacherId).pipe(
      catchError((error: any) => {
        console.warn(
          'API error for teacher classes, using fallback data:',
          error
        );
        return of([
          { id: 1, number: 1, letter: 'A', studentsCount: 25 },
          { id: 2, number: 2, letter: 'B', studentsCount: 23 },
          { id: 3, number: 3, letter: 'A', studentsCount: 22 },
        ]);
      })
    );
  }

  getStudentsForClass(classId: number): Observable<any[]> {
    return this.apiService.getStudentsByClass(classId).pipe(
      catchError((error: any) => {
        console.warn(
          'API error for class students, using fallback data:',
          error
        );
        return of([]);
      })
    );
  }

  getTeacherSubjects(teacherId: number): Observable<any[]> {
    return this.apiService.getTeacherSubjects(teacherId).pipe(
      catchError((error: any) => {
        console.warn(
          'API error for teacher subjects, using fallback data:',
          error
        );
        return of([
          { id: 1, name: 'Matematyka' },
          { id: 2, name: 'Fizyka' },
        ]);
      })
    );
  }

  addGrade(gradeData: any): Observable<any> {
    return this.apiService.addGrade(gradeData).pipe(
      catchError((error: any) => {
        console.error('Error adding grade:', error);
        throw error;
      })
    );
  }

  getGradesByTeacher(teacherId: number): Observable<any[]> {
    return this.apiService.getGradesByTeacher(teacherId).pipe(
      map((grades: any[]) => {
        return grades.map((grade) => ({
          ...grade,
          subjectName:
            grade.teacherSubject?.subject?.name ||
            grade.subjectName ||
            'Unknown Subject',
          studentName: `${grade.student?.name} ${grade.student?.lastname}`,
          className: `${grade.student?.studentClass?.number}${grade.student?.studentClass?.letter}`,
        }));
      }),
      catchError((error: any) => {
        console.warn(
          'API error for teacher grades, using fallback data:',
          error
        );
        return of([]);
      })
    );
  }

  getEventsByClass(classId: number): Observable<any[]> {
    return this.apiService.getEventsByClass(classId).pipe(
      map((schedules: any[]) => {
        return schedules.map((schedule) => ({
          id: schedule.id,
          title: schedule.title,
          type: this.extractTypeFromTitle(schedule.title),
          date: schedule.date,
          description: schedule.comment || '',
          lesson: schedule.lesson,
        }));
      }),
      catchError((error: any) => {
        console.warn('API error for class events, using fallback data:', error);
        return of([
          {
            id: 1,
            title: 'Sprawdzian z matematyki',
            type: 'test',
            date: new Date('2024-02-15'),
            description: 'Sprawdzian z działań na liczbach rzeczywistych',
          },
          {
            id: 2,
            title: 'Kartkówka z fizyki',
            type: 'quiz',
            date: new Date('2024-02-20'),
            description: 'Kartkówka z mechaniki',
          },
        ]);
      })
    );
  }

  private extractTypeFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('sprawdzian')) return 'test';
    if (lowerTitle.includes('kartkówka')) return 'quiz';
    if (lowerTitle.includes('praca klasowa')) return 'exam';
    if (lowerTitle.includes('egzamin')) return 'final_exam';
    if (lowerTitle.includes('projekt')) return 'project';
    if (lowerTitle.includes('prezentacja')) return 'presentation';
    if (lowerTitle.includes('wycieczka')) return 'trip';
    return 'other';
  }

  createEvent(eventData: any): Observable<any> {
    return this.apiService.createEvent(eventData).pipe(
      catchError((error: any) => {
        console.error('Error creating event:', error);
        throw error;
      })
    );
  }

  updateEvent(eventId: number, eventData: any): Observable<any> {
    return this.apiService.updateEvent(eventId, eventData).pipe(
      catchError((error: any) => {
        console.error('Error updating event:', error);
        throw error;
      })
    );
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.apiService.deleteEvent(eventId).pipe(
      catchError((error: any) => {
        console.error('Error deleting event:', error);
        throw error;
      })
    );
  }

  getClassStatistics(
    classId: number,
    teacherSubjectId: number
  ): Observable<any> {
    return this.apiService.getStudentsByClass(classId).pipe(
      switchMap((students: any[]) => {
        const gradeRequests = students.map((student) =>
          this.apiService
            .getGradesByStudentAndTeacherSubject(student.id, teacherSubjectId)
            .pipe(map((grades) => ({ student, grades })))
        );

        return forkJoin(gradeRequests);
      }),
      map((studentGrades: any[]) => {
        const totalStudents = studentGrades.length;
        const allGrades = studentGrades.flatMap((sg) => sg.grades);
        const classAverage =
          allGrades.length > 0
            ? allGrades.reduce((sum, grade) => sum + grade.grade_value, 0) /
              allGrades.length
            : 0;

        const gradeDistribution = {
          excellent: allGrades.filter((g) => g.grade_value >= 5).length,
          good: allGrades.filter((g) => g.grade_value >= 4 && g.grade_value < 5)
            .length,
          satisfactory: allGrades.filter(
            (g) => g.grade_value >= 3 && g.grade_value < 4
          ).length,
          poor: allGrades.filter((g) => g.grade_value < 3).length,
        };

        return {
          totalStudents,
          classAverage: Math.round(classAverage * 100) / 100,
          totalGrades: allGrades.length,
          gradeDistribution,
          studentGrades: studentGrades.map((sg) => ({
            student: sg.student,
            grades: sg.grades,
            average:
              sg.grades.length > 0
                ? sg.grades.reduce(
                    (sum: number, grade: any) => sum + grade.grade_value,
                    0
                  ) / sg.grades.length
                : 0,
          })),
        };
      }),
      catchError((error: any) => {
        console.warn(
          'API error for class statistics, using fallback data:',
          error
        );
        return of({
          totalStudents: 0,
          classAverage: 0,
          totalGrades: 0,
          gradeDistribution: {
            excellent: 0,
            good: 0,
            satisfactory: 0,
            poor: 0,
          },
          studentGrades: [],
        });
      })
    );
  }
}
