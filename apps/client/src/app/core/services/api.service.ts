import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = this.getApiUrl();

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      return 'http://localhost:8080/api';
    } else {
      return 'https://gradeflow-bdmy.onrender.com/api';
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

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
    return this.http
      .post(`${this.apiUrl}/users/register`, userData, {
        headers: this.getHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(
        map((response) => {
          try {
            return response ? JSON.parse(response as string) : {};
          } catch (e) {
            // If response is not JSON, return the text response
            return { message: response || 'User created successfully' };
          }
        })
      );
  }

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

  getAllTimetables(): Observable<any[]> {
    return this.get<any[]>('/timetables');
  }

  getAllTeachers(): Observable<any[]> {
    return this.get<any[]>('/teachers');
  }

  getAllStudents(): Observable<any[]> {
    return this.get<any[]>('/students');
  }

  getStudentByUserId(userId: number): Observable<any> {
    return this.get<any>(`/students/user/${userId}`);
  }

  getTeacherByUserId(userId: number): Observable<any> {
    return this.getAllTeachers().pipe(
      map((teachers: any[]) => {
        const teacher = teachers.find((t) => t.userId === userId);
        if (!teacher) {
          throw new Error(`No teacher found for user ID: ${userId}`);
        }
        return teacher;
      })
    );
  }

  getAllClasses(): Observable<any[]> {
    return this.get<any[]>('/classes');
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.put<any>(`/users/${userId}`, userData);
  }

  changePassword(userId: number, passwordData: any): Observable<any> {
    return this.post<any>(`/users/${userId}/change-password`, passwordData);
  }

  getTimetableByStudentClass(classId: number): Observable<any[]> {
    return this.get<any[]>(`/timetables/studentClass/${classId}`);
  }

  getTimetableByTeacher(teacherId: number): Observable<any[]> {
    return this.get<any[]>(`/timetables/teacher/${teacherId}`);
  }

  getTimetableByStudent(studentId: number): Observable<any[]> {
    return this.getAllTimetables();
  }

  getTeachersByStudentClass(classId: number): Observable<any[]> {
    return this.get<any[]>(`/teachers/studentClass/${classId}`);
  }

  getStudentsByClass(classId: number): Observable<any[]> {
    return this.get<any[]>(`/students/studentClass/${classId}`);
  }

  getTeacherSubjectAssignments(): Observable<any[]> {
    return this.get<any[]>('/teacherSubjects');
  }

  getGradesByStudentAndTeacherSubject(
    studentId: number,
    teacherSubjectId: number
  ): Observable<any[]> {
    return this.get<any[]>(
      `/grades/student/${studentId}/teacherSubject/${teacherSubjectId}`
    );
  }

  getAllEvents(): Observable<any[]> {
    return this.get<any[]>('/events');
  }

  getEventsByClass(classId: number): Observable<any[]> {
    return this.get<any[]>(`/events/class/${classId}`);
  }

  createEvent(eventData: any): Observable<any> {
    return this.post<any>('/events/create', eventData);
  }

  updateEvent(eventId: number, eventData: any): Observable<any> {
    return this.put<any>(`/events/update/${eventId}`, eventData);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.delete<any>(`/events/delete/${eventId}`);
  }

  getTeacherClasses(teacherId: number): Observable<any[]> {
    return this.get<any[]>(`/teachers/${teacherId}/classes`);
  }

  getTeacherSubjects(teacherId: number): Observable<any[]> {
    return this.get<any[]>(`/teachers/${teacherId}/subjects`);
  }

  getGradesByTeacher(teacherId: number): Observable<any[]> {
    return this.get<any[]>(`/grades/teacher/${teacherId}`);
  }
}
