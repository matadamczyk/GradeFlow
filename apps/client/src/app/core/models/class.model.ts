import { Teacher } from './teacher.model';

export interface SchoolClass {
  id: number;
  letter: string;
  number: number;
  tutor: Teacher;
}

export interface SchoolClassWithStudentCount extends SchoolClass {
  studentCount: number;
} 