# Tasks: Overdue Todo Items Identification

**Input**: Design documents from `/specs/001-overdue-todos/`
**Prerequisites**: plan.md ✅, spec.md ✅

**Tests**: Tests are included as this is a complete feature implementation requiring test coverage per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

**Web app**: `packages/backend/src/`, `packages/frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project verification - ensure environment is ready for feature implementation

- [ ] T001 Verify current branch is `001-overdue-todos`
- [ ] T002 Verify existing todo data model includes `dueDate`, `completed`, `title`, `id` fields
- [ ] T003 [P] Review UI guidelines for overdue styling (light/dark theme colors)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create reusable date utility that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create `packages/frontend/src/utils/` directory
- [ ] T005 Create date utility file in `packages/frontend/src/utils/dateUtils.js` with `isOverdue()` function
- [ ] T006 [P] Create test file in `packages/frontend/src/utils/__tests__/dateUtils.test.js`
- [ ] T007 Write unit test: `isOverdue` returns false when dueDate is null
- [ ] T008 Write unit test: `isOverdue` returns false when completed is true (regardless of date)
- [ ] T009 Write unit test: `isOverdue` returns false when dueDate is today
- [ ] T010 Write unit test: `isOverdue` returns false when dueDate is in the future
- [ ] T011 Write unit test: `isOverdue` returns true when dueDate is yesterday and not completed
- [ ] T012 Write unit test: `isOverdue` handles invalid date strings gracefully
- [ ] T013 Implement `isOverdue(dueDate, completed)` function to pass all tests
- [ ] T014 Run tests and verify 100% coverage for dateUtils.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can immediately identify overdue todos through clear visual indicators (red text/border) when viewing their todo list

**Independent Test**: Create todos with past due dates and verify they display with distinctive visual styling. Create todos with future dates or no dates and verify they do NOT show overdue styling.

### Styling for User Story 1

- [ ] T015 [P] [US1] Add overdue color variables to `packages/frontend/src/styles/theme.css` for light mode
- [ ] T016 [P] [US1] Add overdue color variables to `packages/frontend/src/styles/theme.css` for dark mode
- [ ] T017 [US1] Define `.todo-card.overdue` CSS class with border, text color, and icon styling
- [ ] T018 [US1] Verify WCAG AA contrast standards for overdue colors in both themes

### Implementation for User Story 1

- [ ] T019 [US1] Import `isOverdue` utility into `packages/frontend/src/components/TodoCard.js`
- [ ] T020 [US1] Compute overdue status in TodoCard component using `isOverdue(todo.dueDate, todo.completed)`
- [ ] T021 [US1] Apply conditional CSS class `overdue` to todo card when status is true
- [ ] T022 [US1] Add visual overdue indicator icon (🔴 or ⏰) next to due date when overdue

### Tests for User Story 1

- [ ] T023 [P] [US1] Write test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: renders overdue styling for past due date
- [ ] T024 [P] [US1] Write test: does NOT render overdue styling for today's due date
- [ ] T025 [P] [US1] Write test: does NOT render overdue styling for future due date
- [ ] T026 [P] [US1] Write test: does NOT render overdue styling when completed (past due date)
- [ ] T027 [P] [US1] Write test: does NOT render overdue styling when no due date
- [ ] T028 [US1] Run TodoCard tests and verify all pass
- [ ] T029 [P] [US1] Write integration test in `packages/frontend/src/components/__tests__/TodoList.test.js`: multiple todos with mixed due dates show correct overdue states
- [ ] T030 [US1] Run TodoList tests and verify all pass

**Checkpoint**: At this point, User Story 1 should be fully functional - overdue todos display with visual indicators

---

## Phase 4: User Story 2 - Overdue Status Persistence (Priority: P2)

**Goal**: When users mark an overdue todo as complete, the overdue indicator immediately disappears, providing instant feedback

**Independent Test**: Create an overdue todo, mark it complete, verify overdue indicator disappears. Unmark it and verify indicator reappears.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T031 [P] [US2] Write test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: overdue indicator disappears when marking todo complete
- [ ] T032 [P] [US2] Write test: overdue indicator reappears when unmarking completed overdue todo
- [ ] T033 [US2] Verify tests fail (not yet implemented)

### Implementation for User Story 2

- [ ] T034 [US2] Verify TodoCard re-renders when `todo.completed` prop changes
- [ ] T035 [US2] Verify `isOverdue` is re-computed on prop changes (React functional component should handle this automatically)
- [ ] T036 [US2] Test completion toggle interaction manually in browser
- [ ] T037 [US2] Run User Story 2 tests and verify all pass

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - overdue status updates instantly with completion changes

---

## Phase 5: User Story 3 - Dynamic Overdue Detection (Priority: P3)

**Goal**: System automatically detects when a todo becomes overdue as dates change (e.g., at midnight), without requiring page refresh

**Independent Test**: Create a todo due today, verify it shows as overdue after date changes (test by manipulating date in tests)

### Tests for User Story 3

> **NOTE: This story requires mocking time/date for testing**

- [ ] T038 [P] [US3] Write test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: todo due today shows overdue when date advances to tomorrow (using mocked date)
- [ ] T039 [P] [US3] Write test: newly created todo with past due date shows overdue immediately
- [ ] T040 [US3] Verify tests fail (not yet implemented)

### Implementation for User Story 3

- [ ] T041 [US3] Research React patterns for time-based re-rendering (useEffect with interval or date context)
- [ ] T042 [US3] Implement date change detection mechanism (optional: interval checking or accept page refresh as acceptable)
- [ ] T043 [US3] Verify newly created todos compute overdue status immediately
- [ ] T044 [US3] Run User Story 3 tests and verify all pass
- [ ] T045 [US3] Document behavior: automatic detection requires page refresh or periodic checking

**Note**: Full automatic detection (midnight boundary) may be deferred if complexity is high. Immediate detection on creation and completion changes (US1 + US2) delivers 90% of value.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [ ] T046 [P] Run full test suite (`npm test`) and verify all tests pass
- [ ] T047 [P] Check test coverage meets 80%+ requirement (`npm test -- --coverage`)
- [ ] T048 Manually test overdue indicators in browser (light theme)
- [ ] T049 Manually test overdue indicators in browser (dark theme)
- [ ] T050 Verify accessibility: test with color-blind simulation tools
- [ ] T051 Verify keyboard navigation works with overdue todos
- [ ] T052 Run ESLint and fix any warnings (`npm run lint` if available)
- [ ] T053 Remove any console.log statements from implementation
- [ ] T054 [P] Update documentation if needed (optional for this feature)
- [ ] T055 Final code review: verify DRY principle, single responsibility, SOLID principles
- [ ] T056 Commit all changes with clear commit message: "feat: add overdue visual indicators for todo items"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable

### Within Each User Story

- Styling tasks before implementation tasks
- Tests should be written alongside or before implementation
- Implementation before manual testing
- All tasks complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational test tasks (T007-T012) can be written in parallel
- All styling tasks for US1 (T015-T016) can run in parallel
- All test tasks within each user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members after Phase 2
- Polish tasks (T046-T047, T054-T055) can run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational phase is complete, all of these can run in parallel:

# Developer 1: Styling
Task T015: Add overdue colors (light mode)
Task T016: Add overdue colors (dark mode)

# Developer 2: Tests
Task T023: Test renders overdue styling for past due date
Task T024: Test does NOT render overdue for today
Task T025: Test does NOT render overdue for future
Task T026: Test does NOT render overdue when completed
Task T027: Test does NOT render overdue when no due date

# Then sequentially:
Task T017: Define CSS class
Task T018: Verify WCAG standards
Task T019-T022: Implementation
Task T028-T030: Run tests
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can now identify overdue todos visually

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (date utilities working)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! - visual identification working)
3. Add User Story 2 → Test independently → Deploy/Demo (completion handling working)
4. Add User Story 3 (OPTIONAL) → Test independently → Deploy/Demo (automatic detection working)
5. Each story adds value without breaking previous stories

### Recommended Approach

**Minimum Viable**: Complete P1 (User Story 1) only
- Delivers core value: users can see overdue todos
- Simplest implementation
- Lowest risk

**Full Feature**: Complete P1 + P2
- P1 gives visual identification
- P2 ensures state synchronization on user actions
- P3 (automatic detection) can be deferred as it requires page refresh workaround

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Tasks T001-T014)
2. Once Foundational is done:
   - Developer A: User Story 1 (Tasks T015-T030)
   - Developer B: User Story 2 (Tasks T031-T037) - may need to wait for US1 completion
   - Developer C: User Story 3 (Tasks T038-T045) - may need to wait for US1 completion
3. All converge on Polish phase (Tasks T046-T056)

**Note**: Due to dependencies on US1 implementation, sequential execution P1→P2→P3 is recommended for this feature.

---

## Notes

- [P] tasks = different files, no dependencies within that phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each phase or logical group of tasks
- Stop at any checkpoint to validate story independently
- Total tasks: 56 (14 foundational + 16 US1 + 7 US2 + 8 US3 + 11 polish)
- Estimated parallel opportunities: ~15 tasks can run concurrently within phases
