import { LEVELS } from '../data/courseCatalog';

export const MIN_UNITS = 1;
export const MAX_UNITS = 6;

export const MIN_SESSION_START_YEAR = 2000;
export const MAX_SESSION_START_YEAR = 2050;

/** Levels the student is allowed to pick. */
export const VALID_LEVELS: readonly string[] = LEVELS;

export function isValidLevel(level: string): boolean {
  return VALID_LEVELS.includes(level.trim());
}

/**
 * A session must be a consecutive-year range like "2022/2023" where the
 * second year is exactly one more than the first, within a sane range.
 */
export function validateSession(session: string): string | null {
  const value = session.trim();
  const match = /^(\d{4})\/(\d{4})$/.exec(value);
  if (!match) {
    return 'Use the format YYYY/YYYY, e.g. 2024/2025';
  }
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (end !== start + 1) {
    return 'Years must be consecutive, e.g. 2024/2025';
  }
  if (start < MIN_SESSION_START_YEAR || start > MAX_SESSION_START_YEAR) {
    return `Start year must be between ${MIN_SESSION_START_YEAR} and ${MAX_SESSION_START_YEAR}`;
  }
  return null;
}

/** Credit units must be a whole number between 1 and 6 (project = 6). */
export function validateUnits(units: number): string | null {
  if (!Number.isInteger(units) || units < MIN_UNITS || units > MAX_UNITS) {
    return `Units must be between ${MIN_UNITS} and ${MAX_UNITS}`;
  }
  return null;
}

/** A score must be a number between 0 and 100. */
export function validateScore(score: number): string | null {
  if (isNaN(score) || score < 0 || score > 100) {
    return 'Score must be between 0 and 100';
  }
  return null;
}
