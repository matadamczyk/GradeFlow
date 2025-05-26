import { Subject } from './subject.model';
import { Teacher } from './teacher.model';

export interface TeacherSubject {
  id: number;
  teacher: Teacher;
  subject: Subject;
} 