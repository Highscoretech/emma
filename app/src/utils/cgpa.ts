import type { CourseEntry, Semester } from '../models';
import { isPass, scoreToGrade, scoreToPoint } from '../models/grading';

export interface CourseResult {
  course: CourseEntry;
  grade: ReturnType<typeof scoreToGrade>;
  gradePoint: number;
  qualityPoints: number;
  passed: boolean;
}

export interface SemesterResult {
  semester: Semester;
  rows: CourseResult[];
  totalUnits: number;
  totalQualityPoints: number;
  gpa: number;
  outstandings: CourseEntry[];
}

export interface CumulativeResult {
  semesters: SemesterResult[];
  totalUnits: number;
  totalQualityPoints: number;
  cgpa: number;
  standing: AcademicStanding;
}

export type AcademicStanding =
  | 'First Class'
  | 'Second Class Upper'
  | 'Second Class Lower'
  | 'Third Class'
  | 'Pass'
  | 'Probation';

export function calcSemester(semester: Semester): SemesterResult {
  const rows: CourseResult[] = semester.courses.map((course) => {
    const grade = scoreToGrade(course.score);
    const gradePoint = scoreToPoint(course.score);
    return {
      course,
      grade,
      gradePoint,
      qualityPoints: gradePoint * course.creditUnits,
      passed: isPass(course.score),
    };
  });

  const totalUnits = rows.reduce((sum, r) => sum + r.course.creditUnits, 0);
  const totalQualityPoints = rows.reduce((sum, r) => sum + r.qualityPoints, 0);
  const gpa = totalUnits === 0 ? 0 : totalQualityPoints / totalUnits;
  const outstandings = rows.filter((r) => !r.passed).map((r) => r.course);

  return {
    semester,
    rows,
    totalUnits,
    totalQualityPoints,
    gpa,
    outstandings,
  };
}

export function calcCumulative(semesters: Semester[]): CumulativeResult {
  const results = semesters.map(calcSemester);
  const totalUnits = results.reduce((sum, r) => sum + r.totalUnits, 0);
  const totalQualityPoints = results.reduce(
    (sum, r) => sum + r.totalQualityPoints,
    0,
  );
  const cgpa = totalUnits === 0 ? 0 : totalQualityPoints / totalUnits;
  return {
    semesters: results,
    totalUnits,
    totalQualityPoints,
    cgpa,
    standing: classify(cgpa),
  };
}

export function classify(cgpa: number): AcademicStanding {
  if (cgpa >= 4.5) return 'First Class';
  if (cgpa >= 3.5) return 'Second Class Upper';
  if (cgpa >= 2.4) return 'Second Class Lower';
  if (cgpa >= 1.5) return 'Third Class';
  if (cgpa >= 1.0) return 'Pass';
  return 'Probation';
}
