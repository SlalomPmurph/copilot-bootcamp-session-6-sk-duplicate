# API Contracts: Overdue Todo Items Identification

**Feature**: 001-overdue-todos  
**Date**: 2026-02-03  
**Status**: Complete

## Overview

This feature requires **NO API CHANGES**. All existing todo API endpoints remain unchanged. The overdue status is computed entirely on the client side using the existing `dueDate` and `completed` fields.

---

## No Changes Required

### Existing API Endpoints (Unchanged)

All existing todo endpoints continue to function exactly as before:

#### GET /api/todos
**Purpose**: Fetch all todos  
**Response**: Array of todo objects  
**Status**: ✅ No changes

```json
// Response format (unchanged)
[
  {
    "id": 1,
    "title": "Review pull request",
    "dueDate": "2026-02-01",
    "completed": 0,
    "createdAt": "2026-01-28T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Write documentation",
    "dueDate": null,
    "completed": 0,
    "createdAt": "2026-02-02T14:00:00Z"
  }
]
```

**Note**: Client computes overdue status from `dueDate` and `completed` fields.

---

#### GET /api/todos/:id
**Purpose**: Fetch a single todo by ID  
**Response**: Todo object  
**Status**: ✅ No changes

```json
// Response format (unchanged)
{
  "id": 1,
  "title": "Review pull request",
  "dueDate": "2026-02-01",
  "completed": 0,
  "createdAt": "2026-01-28T10:30:00Z"
}
```

---

#### POST /api/todos
**Purpose**: Create a new todo  
**Request Body**: Title and optional due date  
**Response**: Created todo object  
**Status**: ✅ No changes

```json
// Request (unchanged)
{
  "title": "New task",
  "dueDate": "2026-02-10"  // Optional
}

// Response (unchanged)
{
  "id": 3,
  "title": "New task",
  "dueDate": "2026-02-10",
  "completed": 0,
  "createdAt": "2026-02-03T09:15:00Z"
}
```

---

#### PUT /api/todos/:id
**Purpose**: Update todo title and/or due date  
**Request Body**: Updated fields  
**Response**: Updated todo object  
**Status**: ✅ No changes

```json
// Request (unchanged)
{
  "title": "Updated title",
  "dueDate": "2026-02-15"
}

// Response (unchanged)
{
  "id": 1,
  "title": "Updated title",
  "dueDate": "2026-02-15",
  "completed": 0,
  "createdAt": "2026-01-28T10:30:00Z"
}
```

---

#### PATCH /api/todos/:id/toggle
**Purpose**: Toggle todo completion status  
**Request Body**: None  
**Response**: Updated todo object  
**Status**: ✅ No changes

```json
// Response (unchanged)
{
  "id": 1,
  "title": "Review pull request",
  "dueDate": "2026-02-01",
  "completed": 1,  // Toggled
  "createdAt": "2026-01-28T10:30:00Z"
}
```

**Note**: When `completed` changes from 0 to 1, frontend will remove overdue indicator (if present).

---

#### DELETE /api/todos/:id
**Purpose**: Delete a todo  
**Response**: Success message  
**Status**: ✅ No changes

```json
// Response (unchanged)
{
  "message": "Todo deleted successfully"
}
```

---

## Why No API Changes?

### Rationale

1. **Data Sufficiency**: The existing `dueDate` and `completed` fields contain all information needed to compute overdue status.

2. **Client-Side Computation**: Overdue status is inherently client-dependent:
   - Uses client's local date/time
   - Changes based on when the user views the list (a todo becomes overdue at midnight)
   - No need to persist computed values

3. **Performance**: Computing overdue status client-side is trivial (O(1) per todo) and avoids unnecessary server load.

4. **Separation of Concerns**: Overdue status is a **presentation concern** (how to display todos), not a **data concern** (what todos exist).

5. **API Stability**: Maintaining existing contracts avoids:
   - Backend code changes
   - Database migrations
   - API versioning
   - Breaking changes for other clients (if any)

### Alternative Approaches Considered (and Rejected)

#### Option 1: Add `isOverdue` field to API response
```json
{
  "id": 1,
  "title": "Task",
  "dueDate": "2026-02-01",
  "completed": 0,
  "isOverdue": true  // Computed by backend
}
```

**Rejected because**:
- Adds unnecessary backend computation
- Timezone ambiguity (server time vs client time)
- Stale data (a todo becomes overdue at midnight, but API response is cached)
- Violates FR-002 (must use client's local date)

#### Option 2: Add query parameter `?includeOverdue=true`
```
GET /api/todos?includeOverdue=true
```

**Rejected because**:
- Same timezone issues as Option 1
- Adds complexity for no functional benefit
- Frontend must still compute overdue status for dynamic updates (e.g., when toggling completion)

---

## Frontend Contract

While the API remains unchanged, the frontend introduces a **computed contract**:

### Utility Function Contract

```typescript
/**
 * Determines if a todo is overdue based on its due date and completion status
 * @param {string|null} dueDate - Due date in YYYY-MM-DD format
 * @param {number|boolean} completed - Completion status (0/false = incomplete, 1/true = complete)
 * @returns {boolean} - True if overdue, false otherwise
 */
function isOverdue(dueDate, completed): boolean
```

**Behavior Contract**:
- Returns `false` if `dueDate` is null or undefined
- Returns `false` if `completed` is truthy (1, true)
- Returns `true` if `dueDate` is strictly before today's date (at midnight)
- Returns `false` if `dueDate` is today or in the future
- Uses client's local timezone for date comparison
- Handles invalid dates gracefully (returns `false`)

### Component Props Contract

#### TodoCard Component

```typescript
// Existing props (unchanged)
interface TodoCardProps {
  todo: {
    id: number;
    title: string;
    dueDate: string | null;
    completed: number;
    createdAt: string;
  };
  onToggle: (id: number) => Promise<void>;
  onEdit: (id: number, title: string, dueDate: string | null) => Promise<void>;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}
```

**Note**: No new props needed. Component computes `isOverdue(todo.dueDate, todo.completed)` internally.

---

## Testing Contract

### API Tests (No Changes)

All existing API tests remain valid:
- ✅ `GET /api/todos` returns array of todos
- ✅ `POST /api/todos` creates todo with title and optional dueDate
- ✅ `PATCH /api/todos/:id/toggle` toggles completion status
- ✅ All validation rules remain unchanged

### Frontend Integration Tests

New tests verify client-side overdue computation:

```javascript
// Test that frontend correctly computes overdue status from API response
test('should display overdue indicator for todo with past due date', async () => {
  // Mock API response with past due date
  server.use(
    rest.get('/api/todos', (req, res, ctx) => {
      return res(ctx.json([
        { id: 1, title: 'Task', dueDate: '2026-02-01', completed: 0, createdAt: '2026-01-28T00:00:00Z' }
      ]));
    })
  );
  
  // Set mock date to Feb 3, 2026
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-03T12:00:00Z'));
  
  render(<App />);
  
  // Verify overdue indicator is displayed
  await waitFor(() => {
    const card = screen.getByText('Task').closest('.todo-card');
    expect(card).toHaveClass('overdue');
  });
  
  jest.useRealTimers();
});
```

---

## Summary

- ✅ **Zero API changes** - all existing endpoints remain unchanged
- ✅ **Backward compatible** - no breaking changes
- ✅ **Client-side computation** - overdue status derived from existing fields
- ✅ **No backend impact** - no new code, queries, or tests needed on backend
- ✅ **Timezone accurate** - uses client's local date per FR-002

This approach maximizes simplicity while meeting all functional requirements.
