import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

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
        console.log('Student grades raw API data:', grades);
        // Map grades with subjectName for compatibility
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
        // Calculate statistics from API data
        const totalGrades = grades.length;
        const overallAverage =
          grades.length > 0
            ? grades.reduce((sum, grade) => sum + grade.grade_value, 0) /
              grades.length
            : 0;

        // Group by subject for subject grades
        const subjectGrades = this.calculateSubjectGrades(grades);

        // Calculate monthly trends
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
    console.log('Calculating subject grades from API data:', grades);
    const subjectMap = new Map();

    grades.forEach((grade) => {
      // Map API structure: grade.teacherSubject.subject.name
      const subjectName =
        grade.teacherSubject?.subject?.name ||
        grade.subjectName ||
        'Unknown Subject';
      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, []);
      }
      // Add mapped grade with subjectName for compatibility
      const mappedGrade = {
        ...grade,
        subjectName: subjectName,
      };
      subjectMap.get(subjectName).push(mappedGrade);
    });

    return Array.from(subjectMap.entries()).map(
      ([subjectName, subjectGrades]) => {
        const average =
          subjectGrades.reduce(
            (sum: number, grade: any) => sum + grade.grade_value,
            0
          ) / subjectGrades.length;
        return {
          subjectName,
          grades: subjectGrades,
          average: average,
          weightedAverage: average, // For now, treat as same as average
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
        console.log('Recent grades raw API data:', grades);
        // Map grades with subjectName for compatibility
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
      average: sg.weightedAverage,
    }));

    return of(averages).pipe(delay(500));
  }

  private calculateMonthlyTrends(grades: any[]): any[] {
    if (grades.length === 0) {
      // Return default trend data if no grades
      return [
        { month: 'Sty', average: 0 },
        { month: 'Lut', average: 0 },
        { month: 'Mar', average: 0 },
        { month: 'Kwi', average: 0 },
        { month: 'Maj', average: 0 },
        { month: 'Cze', average: 0 },
      ];
    }

    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Month names in Polish
    const monthNames = [
      'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
      'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'
    ];

    // Group grades by month
    const monthlyGrades = new Map<string, any[]>();
    
    grades.forEach(grade => {
      const gradeDate = new Date(grade.date);
      if (gradeDate.getFullYear() === currentYear) {
        const monthKey = monthNames[gradeDate.getMonth()];
        if (!monthlyGrades.has(monthKey)) {
          monthlyGrades.set(monthKey, []);
        }
        monthlyGrades.get(monthKey)!.push(grade);
      }
    });

    // Calculate averages for each month
    const trends: any[] = [];
    const currentMonth = new Date().getMonth();
    
    // Show trends for the past 6 months or available months
    for (let i = Math.max(0, currentMonth - 5); i <= currentMonth; i++) {
      const monthName = monthNames[i];
      const monthGrades = monthlyGrades.get(monthName) || [];
      
      if (monthGrades.length > 0) {
        const average = monthGrades.reduce((sum, grade) => sum + grade.grade_value, 0) / monthGrades.length;
        trends.push({
          month: monthName,
          average: Math.round(average * 100) / 100
        });
      } else if (trends.length > 0) {
        // If no grades for this month, use the last known average
        trends.push({
          month: monthName,
          average: trends[trends.length - 1].average
        });
      } else {
        // If this is the first month and no grades, use overall average or 0
        const overallAvg = grades.length > 0 
          ? grades.reduce((sum, grade) => sum + grade.grade_value, 0) / grades.length
          : 3.5; // Default starting average
        trends.push({
          month: monthName,
          average: Math.round(overallAvg * 100) / 100
        });
      }
    }

    // Ensure we have at least 3 data points for a meaningful trend
    if (trends.length < 3) {
      const lastAverage = trends.length > 0 ? trends[trends.length - 1].average : 3.5;
      while (trends.length < 6) {
        const monthIndex = (currentMonth - (6 - trends.length)) % 12;
        if (monthIndex < 0) break;
        trends.unshift({
          month: monthNames[monthIndex],
          average: lastAverage
        });
      }
    }

    return trends;
  }
}
