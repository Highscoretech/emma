import {
  isValidLevel,
  validateScore,
  validateSession,
  validateUnits,
} from '../validation';

describe('validateSession', () => {
  it('accepts consecutive-year sessions', () => {
    expect(validateSession('2022/2023')).toBeNull();
    expect(validateSession('2049/2050')).toBeNull();
    expect(validateSession('  2024/2025  ')).toBeNull();
  });

  it('rejects non-consecutive years', () => {
    expect(validateSession('2022/2024')).not.toBeNull();
    expect(validateSession('2023/2022')).not.toBeNull();
  });

  it('rejects malformed input', () => {
    expect(validateSession('0/0')).not.toBeNull();
    expect(validateSession('nonsense')).not.toBeNull();
    expect(validateSession('2022')).not.toBeNull();
    expect(validateSession('22/23')).not.toBeNull();
  });

  it('rejects out-of-range years', () => {
    expect(validateSession('1990/1991')).not.toBeNull();
    expect(validateSession('2099/2100')).not.toBeNull();
  });
});

describe('isValidLevel', () => {
  it('accepts 100–400', () => {
    expect(isValidLevel('100')).toBe(true);
    expect(isValidLevel('400')).toBe(true);
  });

  it('rejects nonsense levels', () => {
    expect(isValidLevel('0')).toBe(false);
    expect(isValidLevel('10')).toBe(false);
    expect(isValidLevel('')).toBe(false);
  });
});

describe('validateUnits', () => {
  it('accepts 1–6', () => {
    expect(validateUnits(1)).toBeNull();
    expect(validateUnits(6)).toBeNull();
  });

  it('rejects values outside 1–6 and non-integers', () => {
    expect(validateUnits(0)).not.toBeNull();
    expect(validateUnits(7)).not.toBeNull();
    expect(validateUnits(2.5)).not.toBeNull();
  });
});

describe('validateScore', () => {
  it('accepts 0–100', () => {
    expect(validateScore(0)).toBeNull();
    expect(validateScore(72)).toBeNull();
    expect(validateScore(100)).toBeNull();
  });

  it('rejects out-of-range scores', () => {
    expect(validateScore(-1)).not.toBeNull();
    expect(validateScore(101)).not.toBeNull();
  });
});
