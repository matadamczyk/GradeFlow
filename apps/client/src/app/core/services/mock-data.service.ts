import { Injectable } from '@angular/core';

// Podstawowe interfejsy dla mock data
interface MockSubject {
  id: number;
  name: string;
}

interface MockTeacher {
  id: number;
  name: string;
  lastname: string;
}

interface MockClass {
  id: number;
  letter: string;
  number: number;
  tutor: MockTeacher;
}

interface MockStudent {
  id: number;
  name: string;
  lastname: string;
  studentClass: MockClass;
}

interface MockGrade {
  id: number;
  student: MockStudent;
  date: Date;
  grade_value: number;
  grade_weight: number;
  comment?: string;
  subjectName: string;
  teacherName: string;
}

interface MockTimetableEntry {
  lesson_id: number;
  studentClass: MockClass;
  subjectName: string;
  teacherName: string;
  lesson_number: number;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  // Mock Subjects
  private mockSubjects: MockSubject[] = [
    { id: 1, name: 'Matematyka' },
    { id: 2, name: 'Język Polski' },
    { id: 3, name: 'Język Angielski' },
    { id: 4, name: 'Historia' },
    { id: 5, name: 'Geografia' },
    { id: 6, name: 'Biologia' },
    { id: 7, name: 'Chemia' },
    { id: 8, name: 'Fizyka' },
    { id: 9, name: 'Informatyka' },
    { id: 10, name: 'Wychowanie Fizyczne' }
  ];

  // Mock Teachers
  private mockTeachers: MockTeacher[] = [
    { id: 1, name: 'Anna', lastname: 'Kowalska' },
    { id: 2, name: 'Jan', lastname: 'Nowak' },
    { id: 3, name: 'Maria', lastname: 'Wiśniewska' },
    { id: 4, name: 'Piotr', lastname: 'Wójcik' },
    { id: 5, name: 'Katarzyna', lastname: 'Kowalczyk' },
    { id: 6, name: 'Tomasz', lastname: 'Kamiński' },
    { id: 7, name: 'Agnieszka', lastname: 'Lewandowska' },
    { id: 8, name: 'Michał', lastname: 'Zieliński' },
    { id: 9, name: 'Magdalena', lastname: 'Szymańska' },
    { id: 10, name: 'Robert', lastname: 'Woźniak' }
  ];

  // Mock Classes
  private mockClasses: MockClass[] = [
    { id: 1, letter: 'A', number: 1, tutor: this.mockTeachers[0] },
    { id: 2, letter: 'B', number: 1, tutor: this.mockTeachers[1] },
    { id: 3, letter: 'A', number: 2, tutor: this.mockTeachers[2] },
    { id: 4, letter: 'B', number: 2, tutor: this.mockTeachers[3] },
    { id: 5, letter: 'A', number: 3, tutor: this.mockTeachers[4] },
    { id: 6, letter: 'B', number: 3, tutor: this.mockTeachers[5] }
  ];

  // Mock Students
  private mockStudents: MockStudent[] = [
    { id: 1, name: 'Adam', lastname: 'Nowicki', studentClass: this.mockClasses[0] },
    { id: 2, name: 'Ewa', lastname: 'Kowalska', studentClass: this.mockClasses[0] },
    { id: 3, name: 'Paweł', lastname: 'Wiśniewski', studentClass: this.mockClasses[1] },
    { id: 4, name: 'Anna', lastname: 'Dąbrowska', studentClass: this.mockClasses[1] },
    { id: 5, name: 'Marcin', lastname: 'Lewandowski', studentClass: this.mockClasses[2] }
  ];

  // Mock Grades
  private mockGrades: MockGrade[] = [
    {
      id: 1,
      student: this.mockStudents[0],
      date: new Date('2024-01-15'),
      grade_value: 4.5,
      grade_weight: 3,
      comment: 'Bardzo dobra praca klasowa',
      subjectName: 'Matematyka',
      teacherName: 'Anna Kowalska'
    },
    {
      id: 2,
      student: this.mockStudents[0],
      date: new Date('2024-01-20'),
      grade_value: 5.0,
      grade_weight: 2,
      comment: 'Doskonała odpowiedź ustna',
      subjectName: 'Matematyka',
      teacherName: 'Anna Kowalska'
    },
    {
      id: 3,
      student: this.mockStudents[0],
      date: new Date('2024-01-18'),
      grade_value: 3.5,
      grade_weight: 1,
      comment: 'Zadanie domowe',
      subjectName: 'Język Polski',
      teacherName: 'Jan Nowak'
    },
    {
      id: 4,
      student: this.mockStudents[0],
      date: new Date('2024-01-22'),
      grade_value: 4.0,
      grade_weight: 2,
      comment: 'Sprawdzian z lektury',
      subjectName: 'Język Polski',
      teacherName: 'Jan Nowak'
    },
    {
      id: 5,
      student: this.mockStudents[0],
      date: new Date('2024-01-25'),
      grade_value: 5.0,
      grade_weight: 3,
      comment: 'Prezentacja grupowa',
      subjectName: 'Język Angielski',
      teacherName: 'Maria Wiśniewska'
    },
    {
      id: 6,
      student: this.mockStudents[0],
      date: new Date('2024-01-28'),
      grade_value: 3.0,
      grade_weight: 1,
      comment: 'Kartkówka',
      subjectName: 'Historia',
      teacherName: 'Piotr Wójcik'
    },
    {
      id: 7,
      student: this.mockStudents[0],
      date: new Date('2024-02-01'),
      grade_value: 4.5,
      grade_weight: 2,
      comment: 'Test z geografii',
      subjectName: 'Geografia',
      teacherName: 'Katarzyna Kowalczyk'
    }
  ];

  // Mock Timetable
  private mockTimetable: MockTimetableEntry[] = [
    {
      lesson_id: 1,
      studentClass: this.mockClasses[0],
      subjectName: 'Matematyka',
      teacherName: 'Anna Kowalska',
      lesson_number: 1,
      day: 'MON',
      startTime: '08:00',
      endTime: '08:45',
      room: '101'
    },
    {
      lesson_id: 2,
      studentClass: this.mockClasses[0],
      subjectName: 'Język Polski',
      teacherName: 'Jan Nowak',
      lesson_number: 2,
      day: 'MON',
      startTime: '08:55',
      endTime: '09:40',
      room: '102'
    },
    {
      lesson_id: 3,
      studentClass: this.mockClasses[0],
      subjectName: 'Język Angielski',
      teacherName: 'Maria Wiśniewska',
      lesson_number: 3,
      day: 'MON',
      startTime: '09:50',
      endTime: '10:35',
      room: '103'
    },
    {
      lesson_id: 4,
      studentClass: this.mockClasses[0],
      subjectName: 'Historia',
      teacherName: 'Piotr Wójcik',
      lesson_number: 4,
      day: 'MON',
      startTime: '10:45',
      endTime: '11:30',
      room: '104'
    },
    {
      lesson_id: 5,
      studentClass: this.mockClasses[0],
      subjectName: 'Geografia',
      teacherName: 'Katarzyna Kowalczyk',
      lesson_number: 5,
      day: 'MON',
      startTime: '11:40',
      endTime: '12:25',
      room: '105'
    },
    // Tuesday
    {
      lesson_id: 6,
      studentClass: this.mockClasses[0],
      subjectName: 'Matematyka',
      teacherName: 'Anna Kowalska',
      lesson_number: 1,
      day: 'TUE',
      startTime: '08:00',
      endTime: '08:45',
      room: '101'
    },
    {
      lesson_id: 7,
      studentClass: this.mockClasses[0],
      subjectName: 'Fizyka',
      teacherName: 'Anna Kowalska',
      lesson_number: 2,
      day: 'TUE',
      startTime: '08:55',
      endTime: '09:40',
      room: '201'
    },
    {
      lesson_id: 8,
      studentClass: this.mockClasses[0],
      subjectName: 'Informatyka',
      teacherName: 'Tomasz Kamiński',
      lesson_number: 3,
      day: 'TUE',
      startTime: '09:50',
      endTime: '10:35',
      room: '301'
    }
  ];

  // Getters for mock data
  getSubjects(): MockSubject[] {
    return [...this.mockSubjects];
  }

  getTeachers(): MockTeacher[] {
    return [...this.mockTeachers];
  }

  getClasses(): MockClass[] {
    return [...this.mockClasses];
  }

  getStudents(): MockStudent[] {
    return [...this.mockStudents];
  }

  getGrades(): MockGrade[] {
    return [...this.mockGrades];
  }

  getTimetable(): MockTimetableEntry[] {
    return [...this.mockTimetable];
  }

  // Helper methods
  getStudentById(id: number): MockStudent | undefined {
    return this.mockStudents.find(student => student.id === id);
  }

  getGradesByStudent(studentId: number): MockGrade[] {
    return this.mockGrades.filter(grade => grade.student.id === studentId);
  }

  getTimetableByClass(classId: number): MockTimetableEntry[] {
    return this.mockTimetable.filter(entry => entry.studentClass.id === classId);
  }

  getSubjectGrades(studentId: number) {
    const studentGrades = this.getGradesByStudent(studentId);
    const subjectMap = new Map<string, MockGrade[]>();

    // Group grades by subject
    studentGrades.forEach(grade => {
      if (!subjectMap.has(grade.subjectName)) {
        subjectMap.set(grade.subjectName, []);
      }
      subjectMap.get(grade.subjectName)!.push(grade);
    });

    // Calculate averages for each subject
    return Array.from(subjectMap.entries()).map(([subjectName, grades]) => {
      const average = grades.reduce((sum, grade) => sum + grade.grade_value, 0) / grades.length;
      const weightedSum = grades.reduce((sum, grade) => sum + (grade.grade_value * grade.grade_weight), 0);
      const totalWeight = grades.reduce((sum, grade) => sum + grade.grade_weight, 0);
      const weightedAverage = weightedSum / totalWeight;

      return {
        subjectName,
        grades,
        average: Math.round(average * 100) / 100,
        weightedAverage: Math.round(weightedAverage * 100) / 100
      };
    });
  }

  getCurrentStudent(): MockStudent {
    return this.mockStudents[0]; // Domyślnie zwracamy pierwszego ucznia
  }

  getOverallAverage(studentId: number): number {
    const grades = this.getGradesByStudent(studentId);
    if (grades.length === 0) return 0;
    
    const weightedSum = grades.reduce((sum, grade) => sum + (grade.grade_value * grade.grade_weight), 0);
    const totalWeight = grades.reduce((sum, grade) => sum + grade.grade_weight, 0);
    
    return Math.round((weightedSum / totalWeight) * 100) / 100;
  }
} 