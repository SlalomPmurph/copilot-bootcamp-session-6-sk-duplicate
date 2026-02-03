import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Fixed test date: February 3, 2026 at noon
    jest.setSystemTime(new Date('2026-02-03T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Past due dates', () => {
    it('should return true for past due date (incomplete)', () => {
      expect(isOverdue('2026-02-01', false)).toBe(true);
    });

    it('should return true for past due date (completed = 0)', () => {
      expect(isOverdue('2026-02-01', 0)).toBe(true);
    });

    it('should return true for far past date', () => {
      expect(isOverdue('2025-01-01', false)).toBe(true);
    });
  });

  describe('Current/future due dates', () => {
    it('should return false for today (due today is NOT overdue)', () => {
      expect(isOverdue('2026-02-03', false)).toBe(false);
    });

    it('should return false for future due date', () => {
      expect(isOverdue('2026-02-10', false)).toBe(false);
    });

    it('should return false for far future date', () => {
      expect(isOverdue('2027-12-31', false)).toBe(false);
    });
  });

  describe('Completed todos', () => {
    it('should return false for completed overdue todo (completed = true)', () => {
      expect(isOverdue('2026-02-01', true)).toBe(false);
    });

    it('should return false for completed overdue todo (completed = 1)', () => {
      expect(isOverdue('2026-02-01', 1)).toBe(false);
    });

    it('should return false for completed current todo', () => {
      expect(isOverdue('2026-02-03', true)).toBe(false);
    });

    it('should return false for completed future todo', () => {
      expect(isOverdue('2026-02-10', true)).toBe(false);
    });
  });

  describe('No due date', () => {
    it('should return false when dueDate is null', () => {
      expect(isOverdue(null, false)).toBe(false);
    });

    it('should return false when dueDate is undefined', () => {
      expect(isOverdue(undefined, false)).toBe(false);
    });

    it('should return false when dueDate is empty string', () => {
      expect(isOverdue('', false)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid date gracefully', () => {
      expect(isOverdue('invalid-date', false)).toBe(false);
    });

    it('should handle malformed date string', () => {
      expect(isOverdue('2026-13-45', false)).toBe(false);
    });
  });

  describe('Midnight boundary', () => {
    it('should normalize dates to midnight for comparison', () => {
      // Yesterday at any time should be overdue
      expect(isOverdue('2026-02-02', false)).toBe(true);
    });

    it('should not be overdue on the due date itself', () => {
      // Today should not be overdue regardless of current time
      expect(isOverdue('2026-02-03', false)).toBe(false);
    });
  });
});
