import { SchoolClass } from './class.model';
import { TeacherSubject } from './teacher-subject.model';
import { WorkDay } from './enums';

export interface Timetable {
  lesson_id: number;
  studentClass: SchoolClass;
  teacherSubject: TeacherSubject;
  lesson_number: number;
  day: WorkDay;
}

export interface TimetableEntry extends Timetable {
  startTime: string;
  endTime: string;
  room?: string;
}

export interface WeeklyTimetable {
  [key: string]: TimetableEntry[];
}
