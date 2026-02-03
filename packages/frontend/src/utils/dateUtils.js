/**
 * Date utility functions for todo application
 */

/**
 * Determines if a todo is overdue based on its due date and completion status
 * 
 * @param {string|null} dueDate - Due date in YYYY-MM-DD format
 * @param {number|boolean} completed - Completion status (0/false = incomplete, 1/true = complete)
 * @returns {boolean} - True if overdue (past due and not completed), false otherwise
 * 
 * @example
 * isOverdue('2026-02-01', false) // true if today is after Feb 1, 2026
 * isOverdue('2026-02-01', true)  // false (completed todos are never overdue)
 * isOverdue(null, false)          // false (no due date)
 */
export function isOverdue(dueDate, completed) {
  // Not overdue if no due date set
  if (!dueDate) {
    return false;
  }
  
  // Not overdue if task is completed
  if (completed) {
    return false;
  }
  
  // Normalize today's date to midnight (00:00:00) for date-only comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Normalize due date to midnight
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  // Overdue if due date is strictly before today
  return due < today;
}
