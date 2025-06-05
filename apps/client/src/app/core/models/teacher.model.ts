export interface Teacher {
  id: number;
  name: string;
  lastname: string;
}

export interface TeacherWithSubjects extends Teacher {
  subjects: string[];
}
