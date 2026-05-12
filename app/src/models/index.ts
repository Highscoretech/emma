export type CourseType = 'CORE/COMPULSORY COURSE' | 'ELECTIVE';

export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type Term = 'FIRST SEMESTER' | 'SECOND SEMESTER';

export interface CourseEntry {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  type: CourseType;
  score: number;
}

export interface Semester {
  id: string;
  level: string;
  session: string;
  term: Term;
  courses: CourseEntry[];
  createdAt: number;
  updatedAt: number;
}
