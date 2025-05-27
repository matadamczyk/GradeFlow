import { SchoolClass } from './class.model';

export interface Student {
  id: number;
  name: string;
  lastname: string;
  studentClass: SchoolClass;
}

export interface StudentWithGrades extends Student {
  averageGrade: number;
  gradeCount: number;
}
