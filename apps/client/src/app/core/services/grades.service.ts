import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  constructor(private mockDataService: MockDataService) {}

  getStudentGrades(studentId: number): Observable<any[]> {
    const grades = this.mockDataService.getGradesByStudent(studentId);
    return of(grades).pipe(delay(500));
  }

  getGradeStatistics(studentId: number): Observable<any> {
    const subjectGrades = this.mockDataService.getSubjectGrades(studentId);
    const overallAverage = this.mockDataService.getOverallAverage(studentId);
    const totalGrades = this.mockDataService.getGradesByStudent(studentId).length;

    const statistics = {
      overallAverage,
      subjectGrades,
      totalGrades
    };

    return of(statistics).pipe(delay(500));
  }

  getSubjectGrades(studentId: number): Observable<any[]> {
    const subjectGrades = this.mockDataService.getSubjectGrades(studentId);
    return of(subjectGrades).pipe(delay(500));
  }

  getRecentGrades(studentId: number, limit = 5): Observable<any[]> {
    const allGrades = this.mockDataService.getGradesByStudent(studentId);
    const recentGrades = allGrades
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
    
    return of(recentGrades).pipe(delay(500));
  }

  getGradesBySubject(studentId: number, subjectName: string): Observable<any[]> {
    const allGrades = this.mockDataService.getGradesByStudent(studentId);
    const subjectGrades = allGrades.filter(grade => grade.subjectName === subjectName);
    
    return of(subjectGrades).pipe(delay(500));
  }

  getGradesByDateRange(studentId: number, startDate: Date, endDate: Date): Observable<any[]> {
    const allGrades = this.mockDataService.getGradesByStudent(studentId);
    const filteredGrades = allGrades.filter(grade => {
      const gradeDate = new Date(grade.date);
      return gradeDate >= startDate && gradeDate <= endDate;
    });
    
    return of(filteredGrades).pipe(delay(500));
  }

  // Metody pomocnicze dla wykresów i statystyk
  getGradesTrend(studentId: number): Observable<any[]> {
    const grades = this.mockDataService.getGradesByStudent(studentId);
    const trend = grades
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((grade, index) => ({
        date: grade.date,
        grade: grade.grade_value,
        subject: grade.subjectName,
        index: index + 1
      }));
    
    return of(trend).pipe(delay(500));
  }

  getSubjectAverages(studentId: number): Observable<{subject: string, average: number}[]> {
    const subjectGrades = this.mockDataService.getSubjectGrades(studentId);
    const averages = subjectGrades.map(sg => ({
      subject: sg.subjectName,
      average: sg.weightedAverage
    }));
    
    return of(averages).pipe(delay(500));
  }
} 