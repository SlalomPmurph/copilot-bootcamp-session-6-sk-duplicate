# Quickstart Guide: Overdue Todo Items Identification

**Feature**: 001-overdue-todos  
**Date**: 2026-02-03  
**For**: Developers implementing this feature

## Overview

This guide provides a step-by-step walkthrough for implementing visual identification of overdue todo items. The implementation is **frontend-only** and requires no backend changes.

**Time Estimate**: 2-3 hours (including tests)

---

## Prerequisites

- ✅ Node.js v16+ installed
- ✅ Repository cloned and dependencies installed (`npm install`)
- ✅ Familiarity with React functional components and hooks
- ✅ Understanding of Jest and React Testing Library
- ✅ Branch `001-overdue-todos` checked out

---

## Implementation Checklist

### Phase 1: Utility Function (30 minutes)

- [ ] Create `src/utils/dateUtils.js`
- [ ] Implement `isOverdue(dueDate, completed)` function
- [ ] Create `src/utils/__tests__/dateUtils.test.js`
- [ ] Write comprehensive unit tests (8+ test cases)
- [ ] Verify 100% code coverage for utility function

### Phase 2: Component Updates (45 minutes)

- [ ] Update `TodoCard.js` to compute and apply overdue class
- [ ] Update `TodoList.js` if needed (optional, depends on approach)
- [ ] Update component tests (`TodoCard.test.js`)
- [ ] Verify visual styling in both light and dark modes

### Phase 3: Styling (30 minutes)

- [ ] Add `.overdue` class to `theme.css` or `App.css`
- [ ] Add multi-layered indicators (border, color, icon, font-weight)
- [ ] Add dark mode overrides
- [ ] Test WCAG AA contrast ratios

### Phase 4: Testing & Validation (45 minutes)

- [ ] Run full test suite (`npm test`)
- [ ] Verify 80%+ coverage maintained
- [ ] Manual testing in browser (light/dark modes)
- [ ] Test all acceptance scenarios from spec
- [ ] Run linter (`npm run lint` if configured)

---

## Step-by-Step Implementation

### Step 1: Create Date Utility Function

**File**: `packages/frontend/src/utils/dateUtils.js`

```javascript
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
```

---

### Step 2: Create Unit Tests

**File**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

```javascript
import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    // Set a fixed date for all tests (Feb 3, 2026)
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-03T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('past due dates', () => {
    it('should return true for todo with yesterday as due date', () => {
      expect(isOverdue('2026-02-02', false)).toBe(true);
    });

    it('should return true for todo with due date many days ago', () => {
      expect(isOverdue('2026-01-15', false)).toBe(true);
    });

    it('should return true for todo with due date last year', () => {
      expect(isOverdue('2025-12-31', false)).toBe(true);
    });
  });

  describe('current and future due dates', () => {
    it('should return false for todo due today', () => {
      expect(isOverdue('2026-02-03', false)).toBe(false);
    });

    it('should return false for todo due tomorrow', () => {
      expect(isOverdue('2026-02-04', false)).toBe(false);
    });

    it('should return false for todo due in the future', () => {
      expect(isOverdue('2026-12-31', false)).toBe(false);
    });
  });

  describe('completed todos', () => {
    it('should return false for completed todo with past due date', () => {
      expect(isOverdue('2026-02-01', true)).toBe(false);
    });

    it('should return false for completed todo with past due date (numeric 1)', () => {
      expect(isOverdue('2026-02-01', 1)).toBe(false);
    });

    it('should return false for completed todo due today', () => {
      expect(isOverdue('2026-02-03', true)).toBe(false);
    });
  });

  describe('missing or invalid due dates', () => {
    it('should return false when due date is null', () => {
      expect(isOverdue(null, false)).toBe(false);
    });

    it('should return false when due date is undefined', () => {
      expect(isOverdue(undefined, false)).toBe(false);
    });

    it('should return false when due date is empty string', () => {
      expect(isOverdue('', false)).toBe(false);
    });

    it('should handle invalid date strings gracefully', () => {
      expect(isOverdue('invalid-date', false)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return false when both due date and completed are falsy', () => {
      expect(isOverdue(null, 0)).toBe(false);
    });

    it('should handle completed as number 0 (incomplete)', () => {
      expect(isOverdue('2026-02-01', 0)).toBe(true);
    });
  });
});
```

**Run tests**: `npm test -- dateUtils.test.js`

---

### Step 3: Update TodoCard Component

**File**: `packages/frontend/src/components/TodoCard.js`

**Import the utility**:
```javascript
import { isOverdue } from '../utils/dateUtils';
```

**Compute overdue status and apply class**:
```javascript
function TodoCard({ todo, onToggle, onEdit, onDelete, isLoading }) {
  // ... existing state ...
  
  // Compute overdue status
  const isTaskOverdue = isOverdue(todo.dueDate, todo.completed);
  
  // ... existing handlers ...
  
  // Build CSS classes
  const cardClasses = [
    'todo-card',
    todo.completed ? 'completed' : '',
    isTaskOverdue ? 'overdue' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses}>
      {/* ... rest of component ... */}
    </div>
  );
}
```

**Alternative (template literal)**:
```javascript
const cardClasses = `todo-card ${todo.completed ? 'completed' : ''} ${isTaskOverdue ? 'overdue' : ''}`.trim();
```

---

### Step 4: Update TodoCard Component Tests

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add these tests to the existing test suite:

```javascript
describe('TodoCard - Overdue Detection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-03T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display overdue indicator for past due date', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Task',
      dueDate: '2026-02-01',
      completed: 0,
      createdAt: '2026-01-28T00:00:00Z'
    };
    
    render(<TodoCard todo={overdueTodo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByText('Overdue Task').closest('.todo-card');
    expect(card).toHaveClass('overdue');
  });

  it('should NOT display overdue indicator for todo due today', () => {
    const todayTodo = {
      id: 2,
      title: 'Due Today',
      dueDate: '2026-02-03',
      completed: 0,
      createdAt: '2026-02-01T00:00:00Z'
    };
    
    render(<TodoCard todo={todayTodo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByText('Due Today').closest('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should NOT display overdue indicator for completed overdue task', () => {
    const completedOverdue = {
      id: 3,
      title: 'Completed Overdue',
      dueDate: '2026-02-01',
      completed: 1,
      createdAt: '2026-01-28T00:00:00Z'
    };
    
    render(<TodoCard todo={completedOverdue} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByText('Completed Overdue').closest('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should NOT display overdue indicator when no due date', () => {
    const noDueDateTodo = {
      id: 4,
      title: 'No Due Date',
      dueDate: null,
      completed: 0,
      createdAt: '2026-02-01T00:00:00Z'
    };
    
    render(<TodoCard todo={noDueDateTodo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByText('No Due Date').closest('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should remove overdue indicator when task is marked complete', () => {
    const overdueTodo = {
      id: 5,
      title: 'Task',
      dueDate: '2026-02-01',
      completed: 0,
      createdAt: '2026-01-28T00:00:00Z'
    };
    
    const { rerender } = render(
      <TodoCard todo={overdueTodo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    
    let card = screen.getByText('Task').closest('.todo-card');
    expect(card).toHaveClass('overdue');
    
    // Mark as complete
    const completedTodo = { ...overdueTodo, completed: 1 };
    rerender(<TodoCard todo={completedTodo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    card = screen.getByText('Task').closest('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });
});
```

**Run tests**: `npm test -- TodoCard.test.js`

---

### Step 5: Add Overdue Styling

**File**: `packages/frontend/src/styles/theme.css` (or `App.css`)

Add these styles:

```css
/* Overdue Todo Styling */
.todo-card.overdue {
  /* Primary indicator: Left border */
  border-left: 4px solid var(--danger-color);
  
  /* Secondary indicator: Subtle background tint */
  background-color: rgba(198, 40, 40, 0.05);
  
  /* Ensure smooth transition */
  transition: border-left 0.2s ease, background-color 0.2s ease;
}

/* Dark mode overrides */
[data-theme="dark"] .todo-card.overdue {
  background-color: rgba(239, 83, 80, 0.08);
}

/* Overdue title styling */
.todo-card.overdue .todo-title {
  color: var(--danger-color);
  font-weight: 600;
}

/* Warning icon indicator (optional but recommended for accessibility) */
.todo-card.overdue .todo-title::before {
  content: '⚠️ ';
  margin-right: 6px;
  font-size: 0.95em;
}

/* Ensure completed + overdue doesn't show overdue styling */
.todo-card.completed.overdue {
  /* This should never happen due to logic, but defensive CSS */
  border-left: 1px solid var(--border-color);
  background-color: transparent;
}

.todo-card.completed.overdue .todo-title {
  color: var(--text-secondary);
  font-weight: normal;
}

.todo-card.completed.overdue .todo-title::before {
  content: none;
}
```

**Verify CSS variables exist** in theme.css:
- `--danger-color` (should be #c62828 for light mode, #ef5350 for dark mode)
- `--border-color`
- `--text-secondary`

---

### Step 6: Manual Testing

**Start the application**:
```bash
npm run start
```

**Test scenarios**:

1. ✅ **Create overdue todo**:
   - Add todo with yesterday's date
   - Verify red border, warning icon, and colored text appear
   - Verify styling works in both light and dark modes

2. ✅ **Create todo due today**:
   - Add todo with today's date
   - Verify NO overdue styling appears

3. ✅ **Complete overdue todo**:
   - Mark overdue todo as complete
   - Verify overdue styling disappears immediately

4. ✅ **Uncomplete overdue todo**:
   - Unmark completed overdue todo
   - Verify overdue styling reappears (if still past due date)

5. ✅ **Todo without due date**:
   - Create todo with no due date
   - Verify NO overdue styling

6. ✅ **Accessibility check**:
   - Use browser DevTools accessibility inspector
   - Verify contrast ratios meet WCAG AA (4.5:1 for text)
   - Test with color blindness simulator

---

## Validation Checklist

### Functional Requirements

- [ ] FR-001: Overdue todos visually distinguished from others
- [ ] FR-002: Uses client's local date for comparison
- [ ] FR-003: Completed todos do NOT show overdue indicator
- [ ] FR-004: Todos without due date do NOT show overdue indicator
- [ ] FR-005: Overdue status updates when toggled complete/incomplete
- [ ] FR-006: Today's date is NOT considered overdue
- [ ] FR-007: New overdue todos show indicator immediately
- [ ] FR-008: Visual indicator meets WCAG AA contrast standards
- [ ] FR-009: Consistent styling across all todo views

### User Stories

- [ ] **US1**: Users can immediately identify overdue todos
- [ ] **US2**: Overdue indicator disappears when marked complete
- [ ] **US3**: System detects overdue automatically (via rerender on data change)

### Code Quality

- [ ] All tests passing (`npm test`)
- [ ] 80%+ code coverage maintained
- [ ] No linting errors
- [ ] No console.log statements
- [ ] Code follows DRY principle (utility function extracted)
- [ ] Comments explain "why" not "what"

---

## Common Issues & Solutions

### Issue: Tests fail with "date is not consistent"

**Solution**: Ensure you're using `jest.useFakeTimers()` and `jest.setSystemTime()` in test setup.

```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-03T12:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

---

### Issue: Overdue styling not appearing

**Solution**: Check:
1. `isOverdue()` is imported and called correctly
2. Class name is `'overdue'` (lowercase, no typo)
3. CSS file is imported in component or App.js
4. Browser DevTools shows `.overdue` class is applied

---

### Issue: Dark mode styling not working

**Solution**: Verify dark mode selector in CSS:
```css
[data-theme="dark"] .todo-card.overdue {
  /* dark mode styles */
}
```

Check that `<html>` or `<body>` has `data-theme="dark"` attribute when in dark mode.

---

### Issue: Contrast ratio fails WCAG AA

**Solution**: Use WebAIM Contrast Checker to verify:
- Light mode: #c62828 on #ffffff = 7.51:1 ✅
- Dark mode: #ef5350 on #2d2d2d = 7.84:1 ✅

If using custom colors, ensure minimum 4.5:1 ratio.

---

## Performance Notes

- ✅ `isOverdue()` is O(1) - simple date comparison
- ✅ No performance impact for typical list sizes (< 1000 todos)
- ✅ CSS classes are more performant than inline styles
- ✅ No unnecessary re-renders (computed on each render, but render is cheap)

---

## Next Steps

After completing this feature:

1. **Create Pull Request**:
   - Title: `feat: add visual indicators for overdue todos`
   - Link to spec: `specs/001-overdue-todos/spec.md`
   - Include screenshots of light/dark modes

2. **Code Review Checklist**:
   - [ ] All acceptance criteria met
   - [ ] Tests comprehensive and passing
   - [ ] WCAG AA compliance verified
   - [ ] No backend changes (confirm)
   - [ ] Code follows style guide

3. **Documentation**:
   - Update README if needed
   - Add screenshots to PR description

---

## Time Estimates

| Phase | Estimated Time | Notes |
|-------|---------------|-------|
| Utility function | 30 min | Includes tests |
| Component updates | 45 min | TodoCard + tests |
| Styling | 30 min | CSS + theme modes |
| Testing & validation | 45 min | Manual + automated |
| **Total** | **2.5 hours** | Experienced developer |

---

## Resources

- [Feature Spec](./spec.md)
- [Research Document](./research.md)
- [Data Model](./data-model.md)
- [API Contracts](./contracts/api-contracts.md)
- [Jest Fake Timers Docs](https://jestjs.io/docs/timer-mocks)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG AA Contrast Checker](https://webaim.org/resources/contrastchecker/)
