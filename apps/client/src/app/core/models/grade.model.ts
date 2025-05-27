import { Student } from './student.model';
import { TeacherSubject } from './teacher-subject.model';
import { Timetable } from './timetable.model';

export interface Grade {
  id: number;
  student: Student;
  teacherSubject: TeacherSubject;
  lesson: Timetable;
  date: Date;
  grade_value: number;
  grade_weight: number;
  comment?: string;
}

export interface GradeWithSubject extends Omit<Grade, 'teacherSubject'> {
  subjectName: string;
  teacherName: string;
}

export interface SubjectGrades {
  subjectName: string;
  grades: GradeWithSubject[];
  average: number;
  weightedAverage: number;
}

export interface GradeStatistics {
  overallAverage: number;
  subjectGrades: SubjectGrades[];
  totalGrades: number;
}
