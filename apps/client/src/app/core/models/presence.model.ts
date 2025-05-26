import { Student } from './student.model';
import { Timetable } from './timetable.model';

export interface Presence {
  id: number;
  student: Student;
  lesson: Timetable;
  date: Date;
  isPresent: boolean;
}

export interface PresenceStatistics {
  totalLessons: number;
  presentLessons: number;
  attendanceRate: number;
} 