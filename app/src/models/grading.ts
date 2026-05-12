import type { LetterGrade } from './index';

export interface GradePointEntry {
  grade: LetterGrade;
  point: number;
  minScore: number;
}

export const GRADE_SCALE: readonly GradePointEntry[] = [
  { grade: 'A', point: 5, minScore: 70 },
  { grade: 'B', point: 4, minScore: 60 },
  { grade: 'C', point: 3, minScore: 50 },
  { grade: 'D', point: 2, minScore: 45 },
  { grade: 'E', point: 1, minScore: 40 },
  { grade: 'F', point: 0, minScore: 0 },
] as const;

export const MAX_GPA = 5;
export const PASS_MARK = 40;

export function scoreToGrade(score: number): LetterGrade {
  for (const entry of GRADE_SCALE) {
    if (score >= entry.minScore) return entry.grade;
  }
  return 'F';
}

export function gradeToPoint(grade: LetterGrade): number {
  return GRADE_SCALE.find((e) => e.grade === grade)?.point ?? 0;
}

export function scoreToPoint(score: number): number {
  return gradeToPoint(scoreToGrade(score));
}

export function isPass(score: number): boolean {
  return score >= PASS_MARK;
}
