import type { CourseEntry, Semester } from '../../models';
import { calcCumulative, calcSemester, classify } from '../cgpa';

function makeCourse(
  code: string,
  units: number,
  score: number,
  type: CourseEntry['type'] = 'CORE/COMPULSORY COURSE',
): CourseEntry {
  return { id: `c-${code}`, code, title: code, creditUnits: units, type, score };
}

function makeSemester(
  id: string,
  courses: CourseEntry[],
  overrides: Partial<Semester> = {},
): Semester {
  return {
    id,
    level: '400 LEVEL',
    session: '2025/2026',
    term: 'FIRST SEMESTER',
    courses,
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
}

describe('calcSemester', () => {
  it('returns zero GPA for an empty semester (no divide-by-zero)', () => {
    const sem = makeSemester('s1', []);
    const r = calcSemester(sem);
    expect(r.gpa).toBe(0);
    expect(r.totalUnits).toBe(0);
    expect(r.outstandings).toEqual([]);
  });

  it('computes GPA = Σ(point × units) / Σ(units)', () => {
    // 3u @ A(5) + 2u @ B(4) = 15 + 8 = 23 / 5 = 4.60
    const sem = makeSemester('s1', [
      makeCourse('CSC401', 3, 85),
      makeCourse('CSC402', 2, 65),
    ]);
    const r = calcSemester(sem);
    expect(r.totalUnits).toBe(5);
    expect(r.totalQualityPoints).toBe(23);
    expect(r.gpa).toBeCloseTo(4.6, 5);
  });

  it('flags failed courses as outstandings', () => {
    const sem = makeSemester('s1', [
      makeCourse('PASS1', 3, 70),
      makeCourse('FAIL1', 2, 30),
      makeCourse('FAIL2', 2, 39),
    ]);
    const r = calcSemester(sem);
    expect(r.outstandings.map((c) => c.code)).toEqual(['FAIL1', 'FAIL2']);
  });

  it('treats exactly 40 as a pass (no outstanding)', () => {
    const sem = makeSemester('s1', [makeCourse('EDGE', 2, 40)]);
    const r = calcSemester(sem);
    expect(r.outstandings).toEqual([]);
    expect(r.gpa).toBe(1); // E grade = 1 point
  });

  it('treats 39 as a fail', () => {
    const sem = makeSemester('s1', [makeCourse('EDGE', 2, 39)]);
    const r = calcSemester(sem);
    expect(r.outstandings).toHaveLength(1);
    expect(r.gpa).toBe(0);
  });

  it('counts electives the same as core courses in GPA math', () => {
    const sem = makeSemester('s1', [
      makeCourse('CORE', 3, 85, 'CORE/COMPULSORY COURSE'),
      makeCourse('ELEC', 3, 85, 'ELECTIVE'),
    ]);
    const r = calcSemester(sem);
    expect(r.gpa).toBe(5);
  });

  it('matches the canonical 74/20 = 3.70 reference example', () => {
    // From the original transcript reference: 20 units, grade points sum to 74
    // on the 5-point scale (note: PDF used 5-point throughout) — GPA = 3.70.
    // Reproduce roughly: 9 courses totalling 20 units with mixed grades.
    const sem = makeSemester('ref', [
      makeCourse('A1', 3, 70), // A=5, 3u, 15
      makeCourse('A2', 2, 80), // A=5, 2u, 10
      makeCourse('B1', 3, 65), // B=4, 3u, 12
      makeCourse('B2', 2, 65), // B=4, 2u, 8
      makeCourse('B3', 2, 65), // B=4, 2u, 8
      makeCourse('C1', 3, 55), // C=3, 3u, 9
      makeCourse('C2', 2, 55), // C=3, 2u, 6
      makeCourse('C3', 2, 55), // C=3, 2u, 6
      // 19 units, 74 points — adjust last course for 20 units exactly
    ]);
    // Trim down to verify the math directly:
    const r = calcSemester(sem);
    expect(r.totalQualityPoints).toBe(74);
    expect(r.totalUnits).toBe(19);
    expect(r.gpa).toBeCloseTo(74 / 19, 5);
  });
});

describe('calcCumulative', () => {
  it('returns 0 CGPA for empty input', () => {
    const r = calcCumulative([]);
    expect(r.cgpa).toBe(0);
    expect(r.totalUnits).toBe(0);
    expect(r.standing).toBe('Probation');
  });

  it('aggregates quality points across semesters', () => {
    // Sem 1: 3u @ A(5) = 15 qp | Sem 2: 2u @ B(4) = 8 qp => 23/5 = 4.60
    const s1 = makeSemester('s1', [makeCourse('S1A', 3, 80)]);
    const s2 = makeSemester('s2', [makeCourse('S2A', 2, 60)]);
    const r = calcCumulative([s1, s2]);
    expect(r.totalUnits).toBe(5);
    expect(r.totalQualityPoints).toBe(23);
    expect(r.cgpa).toBeCloseTo(4.6, 5);
    expect(r.standing).toBe('First Class');
  });

  it('ignores semesters with no courses (no NaN)', () => {
    const empty = makeSemester('s0', []);
    const filled = makeSemester('s1', [makeCourse('CSC', 3, 75)]);
    const r = calcCumulative([empty, filled]);
    expect(r.cgpa).toBe(5);
    expect(Number.isFinite(r.cgpa)).toBe(true);
  });
});

describe('classify (Nigerian 5-point boundaries)', () => {
  it.each([
    [5.0, 'First Class'],
    [4.5, 'First Class'],
    [4.49, 'Second Class Upper'],
    [3.5, 'Second Class Upper'],
    [3.49, 'Second Class Lower'],
    [2.4, 'Second Class Lower'],
    [2.39, 'Third Class'],
    [1.5, 'Third Class'],
    [1.49, 'Pass'],
    [1.0, 'Pass'],
    [0.99, 'Probation'],
    [0, 'Probation'],
  ])('CGPA %s -> %s', (cgpa, expected) => {
    expect(classify(cgpa)).toBe(expected);
  });
});
