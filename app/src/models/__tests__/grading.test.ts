import {
  gradeToPoint,
  isPass,
  PASS_MARK,
  scoreToGrade,
  scoreToPoint,
} from '../grading';

describe('grading scale (Nigerian 5-point)', () => {
  describe('scoreToGrade', () => {
    it.each([
      [100, 'A'],
      [70, 'A'],
      [69, 'B'],
      [60, 'B'],
      [59, 'C'],
      [50, 'C'],
      [49, 'D'],
      [45, 'D'],
      [44, 'E'],
      [40, 'E'],
      [39, 'F'],
      [0, 'F'],
    ])('score %i -> grade %s', (score, grade) => {
      expect(scoreToGrade(score)).toBe(grade);
    });
  });

  describe('gradeToPoint', () => {
    it.each([
      ['A', 5],
      ['B', 4],
      ['C', 3],
      ['D', 2],
      ['E', 1],
      ['F', 0],
    ] as const)('grade %s -> point %i', (grade, point) => {
      expect(gradeToPoint(grade)).toBe(point);
    });
  });

  describe('scoreToPoint', () => {
    it('chains score -> grade -> point', () => {
      expect(scoreToPoint(85)).toBe(5);
      expect(scoreToPoint(65)).toBe(4);
      expect(scoreToPoint(55)).toBe(3);
      expect(scoreToPoint(47)).toBe(2);
      expect(scoreToPoint(42)).toBe(1);
      expect(scoreToPoint(30)).toBe(0);
    });
  });

  describe('isPass', () => {
    it('passes at the pass mark', () => {
      expect(isPass(PASS_MARK)).toBe(true);
    });
    it('fails below the pass mark', () => {
      expect(isPass(PASS_MARK - 1)).toBe(false);
      expect(isPass(0)).toBe(false);
    });
    it('passes above the pass mark', () => {
      expect(isPass(100)).toBe(true);
      expect(isPass(50)).toBe(true);
    });
  });
});
