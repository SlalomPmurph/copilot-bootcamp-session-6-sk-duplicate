# Implementation Plan: Overdue Todo Items Identification

**Branch**: `001-overdue-todos` | **Date**: February 2, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add visual indicators to distinguish overdue todo items in the todo list. Users will be able to instantly identify tasks past their due date through clear visual styling (color, borders, or typography). The feature computes overdue status dynamically by comparing the todo's due date with the current client date, requiring only frontend changes to the React components and CSS theme.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js v16+  
**Primary Dependencies**: React, React DOM, Express.js, Jest, React Testing Library  
**Storage**: In-memory (existing backend service)  
**Testing**: Jest with React Testing Library for frontend, Jest for backend  
**Target Platform**: Web browsers (desktop-focused)  
**Project Type**: Web application (monorepo with frontend and backend packages)  
**Performance Goals**: <100ms UI update latency for overdue status changes  
**Constraints**: WCAG AA accessibility standards, support light/dark theme modes  
**Scale/Scope**: Single-user todo application, frontend-only changes expected

## Constitution Check

*GATE: Must pass before implementation.*

**Code Quality & Maintainability**:
- ✅ Follow DRY principle: Create reusable date comparison utility
- ✅ Single Responsibility: Overdue logic separated from display logic
- ✅ Naming conventions: camelCase for functions, PascalCase for components
- ✅ Code organization: Logical grouping with clear import hierarchy

**Testing Discipline**:
- ✅ 80%+ code coverage required for new utility functions and component logic
- ✅ Unit tests for date comparison utility
- ✅ Integration tests for TodoCard and TodoList components with overdue todos
- ✅ Test all edge cases: completed overdue, no due date, today's date, etc.

**Component Architecture**:
- ✅ React components maintain single responsibility
- ✅ No prop drilling: overdue status computed in TodoCard
- ✅ Colocated tests in `__tests__/` directories

**Error Handling**:
- ✅ Graceful handling of invalid date values
- ✅ Handle edge cases (missing due dates, invalid date formats)

**Code Review**:
- ✅ Feature branch workflow
- ✅ ESLint must pass before merge
- ✅ Remove any console.log statements

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Requirements validation
└── tasks.md             # Will be created by /speckit.tasks
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TodoCard.js          # UPDATE: Add overdue visual indicator
│       │   ├── TodoList.js          # UPDATE: Pass through overdue status
│       │   └── __tests__/
│       │       ├── TodoCard.test.js # UPDATE: Add overdue scenarios
│       │       └── TodoList.test.js # UPDATE: Add overdue scenarios
│       ├── utils/                   # CREATE: New utility directory
│       │   ├── dateUtils.js         # CREATE: Date comparison utilities
│       │   └── __tests__/
│       │       └── dateUtils.test.js # CREATE: Date utility tests
│       └── styles/
│           └── theme.css            # UPDATE: Add overdue styling
└── backend/
    └── (no changes required)
```

**Structure Decision**: Web application monorepo structure. Changes are isolated to the frontend package as overdue status is computed dynamically on the client side. No backend changes needed since the existing todo data model already includes a `dueDate` field. The date comparison logic will be implemented as a reusable utility function, and overdue styling will be applied via CSS classes in the existing theme system.

## Implementation Strategy

### Phase 0: No Research Needed

This feature uses existing technologies and patterns already present in the codebase. No external research required.

### Phase 1: Design

**Data Model**: No changes needed. The existing todo entity already includes:
- `id`: string
- `title`: string
- `dueDate`: string (optional, YYYY-MM-DD format)
- `completed`: boolean
- `createdAt`: string

**Contracts/API**: No API changes needed. Overdue status is computed client-side.

**Utility Design**:
```javascript
// utils/dateUtils.js
/**
 * Determines if a todo is overdue based on its due date
 * @param {string|null} dueDate - ISO date string (YYYY-MM-DD) or null
 * @param {boolean} completed - Whether the todo is completed
 * @returns {boolean} - True if overdue (due date before today and not completed)
 */
export function isOverdue(dueDate, completed) {
  // Returns false if no due date or if completed
  // Returns true if dueDate < today's date
}
```

**Component Changes**:
- `TodoCard`: Apply conditional CSS class based on `isOverdue()` result
- `TodoList`: No logic changes, just pass through existing props
- `theme.css`: Define overdue styles for light and dark modes

**Testing Strategy**:
- Unit tests for `isOverdue()` function covering all edge cases
- Integration tests for TodoCard with overdue scenarios
- Visual verification in both light and dark themes

### Phase 2: Implementation (see tasks.md)

Tasks will be organized by user story priority (P1, P2, P3) as defined in the specification.

## Complexity Tracking

No violations of constitution principles. This feature follows established patterns:
- Reusable utility functions (DRY principle)
- Single responsibility components
- Comprehensive testing
- Accessible design (WCAG AA)
- No new dependencies or architectural changes
