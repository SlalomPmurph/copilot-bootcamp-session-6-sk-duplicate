# Data Model: Overdue Todo Items Identification

**Feature**: 001-overdue-todos  
**Date**: 2026-02-03  
**Status**: Complete

## Overview

This feature requires **no changes to the data model**. The overdue status is a **computed property** derived from existing fields at runtime on the client side. All necessary data already exists in the Todo entity.

---

## Existing Entity: Todo

The Todo entity already contains all fields required to compute overdue status:

### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | integer | Yes | Auto-increment, Primary Key | Unique identifier |
| `title` | string | Yes | Max 255 characters, non-empty | Todo description |
| `dueDate` | string (date) | No | ISO format YYYY-MM-DD or null | Due date (no time component) |
| `completed` | integer | Yes | 0 or 1 (boolean) | Completion status |
| `createdAt` | string (timestamp) | Yes | ISO timestamp | Creation timestamp |

### Database Schema (SQLite - No Changes)

```sql
-- Existing schema in backend (no modifications needed)
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  dueDate TEXT,  -- Stores YYYY-MM-DD format
  completed INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## Computed Property: isOverdue

The overdue status is computed dynamically in the frontend using the following logic:

### Computation Logic

```javascript
/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - Due date in YYYY-MM-DD format
 * @param {number|boolean} completed - Completion status (0/false = incomplete, 1/true = complete)
 * @returns {boolean} - True if overdue, false otherwise
 */
function isOverdue(dueDate, completed) {
  // Not overdue if no due date
  if (!dueDate) return false;
  
  // Not overdue if completed
  if (completed) return false;
  
  // Normalize dates to midnight for date-only comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  // Overdue if due date is strictly before today
  return due < today;
}
```

### Business Rules

1. **Overdue Definition**: A todo is overdue if and only if:
   - `dueDate` is set (not null)
   - `completed` is false (0)
   - `dueDate` is strictly before the current date (today is NOT overdue)

2. **Edge Cases**:
   - **No due date** (`dueDate = null`) → NOT overdue (FR-004)
   - **Completed** (`completed = 1`) → NOT overdue, regardless of due date (FR-003)
   - **Due today** → NOT overdue (FR-006)
   - **Invalid date** → NOT overdue (safe fallback)

3. **Timezone Handling**: Uses client's local timezone for all date comparisons (FR-002)

### State Transitions

```
┌─────────────────┐
│ Todo Created    │
│ dueDate = null  │──────────────────────┐
│ completed = 0   │                      │
└─────────────────┘                      │
         │                               │
         │ User sets due date            │
         ▼                               │
┌─────────────────┐                      │
│ Todo with       │                      │
│ Due Date        │                      │
│ dueDate = date  │                      │
│ completed = 0   │                      │
└─────────────────┘                      │
         │                               │
         ├─ due > today ──► NOT OVERDUE  │
         │                               │
         ├─ due = today ──► NOT OVERDUE  │
         │                               │
         └─ due < today ──► OVERDUE ◄────┘
                  │
                  │ User marks complete
                  ▼
         ┌─────────────────┐
         │ Completed       │
         │ completed = 1   │──► NOT OVERDUE
         └─────────────────┘
                  │
                  │ User unmarks complete
                  │ (if still due < today)
                  ▼
              OVERDUE
```

---

## No Backend Changes Required

### Rationale

1. **Data Sufficiency**: All required data (`dueDate`, `completed`) already exists
2. **Client-Side Computation**: Overdue status is UI-specific and changes with client's local date
3. **Performance**: Computing overdue status client-side is O(1) per todo, trivial for typical list sizes
4. **Timezone Accuracy**: Client-side computation ensures correct timezone handling (FR-002)
5. **Simplicity**: No need to persist computed values or add backend logic

### API Response (Unchanged)

```json
{
  "id": 1,
  "title": "Review pull request",
  "dueDate": "2026-02-01",
  "completed": 0,
  "createdAt": "2026-01-28T10:30:00Z"
}
```

Frontend computes: `isOverdue("2026-02-01", 0)` → `true` (if today is 2026-02-03)

---

## Validation Rules

### Frontend Validation

No new validation rules are introduced. Existing validation remains:

- `title`: Required, non-empty, max 255 characters
- `dueDate`: Optional, must be valid YYYY-MM-DD format if provided
- `completed`: Boolean (0 or 1)

### Date Validation

The `isOverdue` function handles invalid dates gracefully:
- Invalid date strings return `false` (not overdue)
- `new Date("invalid")` creates Invalid Date object, which fails `<` comparison

---

## Impact Analysis

### Database
- ✅ No schema changes
- ✅ No migrations required
- ✅ No new queries or indexes

### Backend API
- ✅ No endpoint changes
- ✅ No new routes
- ✅ No response format changes

### Frontend
- ⚠️ New utility function: `isOverdue()` in `src/utils/dateUtils.js`
- ⚠️ Modified components: `TodoCard.js`, `TodoList.js` to compute and pass overdue status
- ⚠️ New CSS classes: `.overdue` in theme.css or App.css

### Data Migration
- ✅ Not applicable - no schema changes

---

## Testing Considerations

### Data-Related Tests

1. **Utility Function Tests** (`dateUtils.test.js`):
   - Test with past, present, and future dates
   - Test with completed todos
   - Test with null/undefined due dates
   - Test with invalid date formats
   - Mock system time for deterministic results

2. **Component Tests** (`TodoCard.test.js`, `TodoList.test.js`):
   - Verify overdue class applied when `isOverdue` returns true
   - Verify overdue class removed when todo marked complete
   - Verify overdue class not applied to completed todos with past due dates
   - Verify todos without due dates never show overdue

3. **Integration Tests**:
   - Test date transitions (today becomes yesterday)
   - Test completion status changes
   - Test visual indicators in both light and dark themes

### Test Data Fixtures

```javascript
// Mock todos for testing
export const testTodos = {
  overdue: {
    id: 1,
    title: 'Overdue Task',
    dueDate: '2026-02-01', // Past (when today is 2026-02-03)
    completed: 0,
    createdAt: '2026-01-28T00:00:00Z'
  },
  dueToday: {
    id: 2,
    title: 'Due Today',
    dueDate: '2026-02-03', // Today
    completed: 0,
    createdAt: '2026-02-01T00:00:00Z'
  },
  dueFuture: {
    id: 3,
    title: 'Due Tomorrow',
    dueDate: '2026-02-04', // Future
    completed: 0,
    createdAt: '2026-02-01T00:00:00Z'
  },
  completedOverdue: {
    id: 4,
    title: 'Completed Overdue',
    dueDate: '2026-02-01', // Past but completed
    completed: 1,
    createdAt: '2026-01-28T00:00:00Z'
  },
  noDueDate: {
    id: 5,
    title: 'No Due Date',
    dueDate: null,
    completed: 0,
    createdAt: '2026-02-01T00:00:00Z'
  }
};
```

---

## Performance Considerations

### Time Complexity
- **Per-todo computation**: O(1) - simple date comparison
- **Full list computation**: O(n) where n = number of todos
- **Expected**: n < 1000, so total computation time < 1ms

### Space Complexity
- **Additional memory**: Negligible - no data duplication
- **Computed property**: Boolean flag, not persisted

### Optimization Opportunities
- Not needed for current scale
- If list grows beyond 10,000 items, consider memoization

---

## Summary

- **No data model changes required**
- **Overdue status is a computed property** using existing `dueDate` and `completed` fields
- **Client-side computation** ensures correct timezone handling and simplicity
- **Zero backend impact** - all changes are frontend-only
- **Fully testable** with mocked system time
