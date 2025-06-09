import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Generic HTTP methods
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  // Specific API methods
  
  // Users
  getAllUsers(): Observable<any[]> {
    return this.get<any[]>('/users');
  }

  getUserById(id: number): Observable<any> {
    return this.get<any>(`/users/${id}`);
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.post<any>('/users/login', credentials);
  }

  registerUser(userData: any): Observable<any> {
    return this.post<any>('/users/register', userData);
  }

  // Grades
  getAllGrades(): Observable<any[]> {
    return this.get<any[]>('/grades');
  }

  getGradesByStudent(studentId: number): Observable<any[]> {
    return this.get<any[]>(`/grades/student/${studentId}`);
  }

  addGrade(gradeData: any): Observable<any> {
    return this.post<any>('/grades/add', gradeData);
  }

  updateGrade(gradeId: number, gradeData: any): Observable<any> {
    return this.put<any>(`/grades/update/${gradeId}`, gradeData);
  }

  deleteGrade(gradeId: number): Observable<any> {
    return this.delete<any>(`/grades/delete/${gradeId}`);
  }

  // Timetables
  getAllTimetables(): Observable<any[]> {
    return this.get<any[]>('/timetables');
  }

  // Teachers
  getAllTeachers(): Observable<any[]> {
    return this.get<any[]>('/teachers');
  }

  // Students
  getAllStudents(): Observable<any[]> {
    return this.get<any[]>('/students');
  }

  getStudentByUserId(userId: number): Observable<any> {
    // Workaround: endpoint /students/user/{userId} returns 403
    // Get all students and filter by userId client-side
    return this.getAllStudents().pipe(
      map((students: any[]) => {
        const student = students.find(s => s.userId === userId);
        if (!student) {
          throw new Error(`No student found for user ID: ${userId}`);
        }
        return student;
      })
    );
  }

  // Classes
  getAllClasses(): Observable<any[]> {
    return this.get<any[]>('/classes');
  }

  // User Profile
  updateUser(userId: number, userData: any): Observable<any> {
    return this.put<any>(`/users/${userId}`, userData);
  }

  // Password Change
  changePassword(userId: number, passwordData: any): Observable<any> {
    return this.post<any>(`/users/${userId}/change-password`, passwordData);
  }

  // Timetable specific endpoints
  getTimetableByStudentClass(classId: number): Observable<any[]> {
    return this.get<any[]>(`/timetables/studentClass/${classId}`);
  }

  getTimetableByStudent(studentId: number): Observable<any[]> {
    // For now, we'll use all timetables and filter client-side
    // TODO: Backend should provide endpoint for student-specific timetable
    return this.getAllTimetables();
  }
} 