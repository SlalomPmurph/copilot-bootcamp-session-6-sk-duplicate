# Tasks: Overdue Todo Items Identification

**Feature Branch**: `001-overdue-todos`  
**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Tests are included following TDD best practices as outlined in the testing guidelines and quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: `- [ ]` (markdown task list format)
- **[ID]**: Task identifier (T001, T002, T003...)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This project uses a monorepo structure:
- **Frontend**: `packages/frontend/src/`
- **Backend**: `packages/backend/src/` (NO CHANGES for this feature)
- **Tests**: Colocated in `__tests__/` directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification - ensure development environment is ready

- [X] T001 Verify Node.js v16+ and npm v7+ installed
- [X] T002 Verify all dependencies installed with npm install at repository root
- [X] T003 [P] Verify existing test suite passes with npm test
- [X] T004 [P] Checkout feature branch 001-overdue-todos

**Checkpoint**: Development environment ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create packages/frontend/src/utils/dateUtils.js with isOverdue() function
- [X] T006 Create packages/frontend/src/utils/__tests__/dateUtils.test.js with comprehensive test cases
- [X] T007 Run unit tests for dateUtils.js and verify 100% code coverage
- [X] T008 Add overdue color variables to packages/frontend/src/styles/theme.css for light mode
- [X] T009 Add overdue color variables to packages/frontend/src/styles/theme.css for dark mode
- [X] T010 [P] Add .overdue CSS class with multi-layered indicators to packages/frontend/src/App.css
- [X] T011 Verify WCAG AA contrast ratios meet 4.5:1 requirement using WebAIM Contrast Checker

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can immediately identify which tasks are overdue through clear visual indicators (red text, border, icon)

**Independent Test**: Create todos with past due dates and verify they display with distinct visual treatment (different text color, border, and warning icon). Verify completed todos with past due dates do NOT show overdue indicators.

### Implementation for User Story 1

- [X] T012 [P] [US1] Import isOverdue utility into packages/frontend/src/components/TodoCard.js
- [X] T013 [US1] Add overdue computation logic in packages/frontend/src/components/TodoCard.js using isOverdue(todo.dueDate, todo.completed)
- [X] T014 [US1] Apply conditional .overdue className to todo card in packages/frontend/src/components/TodoCard.js
- [X] T015 [P] [US1] Update packages/frontend/src/components/__tests__/TodoCard.test.js with overdue visual indicator tests
- [X] T016 [US1] Verify overdue todos display red text color in browser in light mode
- [X] T017 [US1] Verify overdue todos display warning icon before due date in browser
- [X] T018 [US1] Verify overdue todos display left border in browser in light mode
- [X] T019 [US1] Verify completed todos with past due dates do NOT show overdue indicator in browser
- [X] T020 [US1] Verify todos without due dates do NOT show overdue indicator in browser
- [X] T021 [US1] Test dark mode overdue visual indicators in browser
- [X] T022 [US1] Run full test suite and verify no regressions with npm test

**Checkpoint**: At this point, User Story 1 should be fully functional - todos with past due dates display overdue indicators, completed todos do not

---

## Phase 4: User Story 2 - Overdue Status Persistence (Priority: P2)

**Goal**: When a user marks an overdue todo as complete, the overdue visual indicator immediately disappears, providing instant feedback

**Independent Test**: Create an overdue todo, mark it complete via checkbox/button, and verify the overdue indicator (red text, icon, border) is removed immediately. Then unmark it and verify indicator reappears.

### Implementation for User Story 2

- [X] T023 [US2] Verify TodoCard re-renders when completion status changes in packages/frontend/src/components/TodoCard.js
- [X] T024 [P] [US2] Add test case to packages/frontend/src/components/__tests__/TodoCard.test.js for completing overdue todo
- [X] T025 [P] [US2] Add test case to packages/frontend/src/components/__tests__/TodoCard.test.js for un-completing overdue todo
- [X] T026 [US2] Manual test - Create overdue todo in browser and mark complete and verify indicator disappears
- [X] T027 [US2] Manual test - Unmark completed overdue todo and verify indicator reappears
- [X] T028 [US2] Run full test suite and verify no regressions with npm test

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - overdue status updates dynamically when completion status changes

---

## Phase 5: User Story 3 - Dynamic Overdue Detection (Priority: P3)

**Goal**: System automatically detects when a todo becomes overdue as dates change or when new todos are created with past due dates

**Independent Test**: Create a todo with yesterday's date and verify it immediately shows as overdue without page refresh

**Note**: Per research.md CL-002, full midnight auto-detection (Option C) is deferred to future iteration. MVP delivers Option A (page load time comparison).

### Implementation for User Story 3

- [X] T029 [US3] Verify newly created todo with past due date shows overdue indicator immediately in packages/frontend/src/components/TodoList.js
- [X] T030 [P] [US3] Add test case to packages/frontend/src/components/__tests__/TodoList.test.js for new overdue todo creation
- [X] T031 [US3] Manual test - Create new todo with yesterday's date in browser and verify overdue indicator appears immediately
- [X] T032 [US3] Manual test - Edit existing todo's due date to yesterday and verify overdue indicator appears
- [X] T033 [US3] Run full test suite and verify no regressions with npm test
- [X] T034 [US3] Document future enhancement for midnight auto-detection in README or docs

**Checkpoint**: All user stories should now be independently functional - overdue detection works on page load and when todos are created/edited

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, validation, and documentation

- [X] T035 [P] Run linter and fix any code style issues
- [X] T036 Run full test suite and verify 80%+ code coverage maintained with npm test -- --coverage
- [X] T037 [P] Test all acceptance scenarios from spec.md in browser in light mode
- [X] T038 [P] Test all acceptance scenarios from spec.md in browser in dark mode
- [X] T039 Verify accessibility with screen reader (optional but recommended)
- [X] T040 Test with Chrome DevTools Lighthouse accessibility audit
- [X] T041 [P] Review code for console.log statements and remove any debug code
- [X] T042 Verify no ESLint errors or warnings
- [X] T043 Run quickstart.md validation scenarios
- [X] T044 [P] Update documentation if needed in README.md or docs
- [X] T045 Create atomic commits with clear commit messages per coding-guidelines.md
- [X] T046 Final smoke test - Create and complete and delete overdue todos in both themes

**Checkpoint**: Feature complete, tested, and ready for pull request

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on Foundational (Phase 2) and User Story 1 (leverages same visual indicators)
- **User Story 3 (P3)**: Depends on Foundational (Phase 2) and User Story 1 (leverages same overdue computation)

### Within Each User Story

- Import utility before using it
- Add computation logic before applying CSS classes
- Update component before updating tests
- Automated tests before manual browser testing
- Light mode verification before dark mode verification

### Parallel Opportunities

- **Phase 1**: Tasks T003 and T004 can run in parallel
- **Phase 2**: Task T010 can run in parallel with T008-T009 (different files)
- **Phase 3 (US1)**: Tasks T012 and T015 can run in parallel (different files - component vs test)
- **Phase 4 (US2)**: Tasks T024 and T025 can run in parallel (different test cases)
- **Phase 5 (US3)**: Task T030 can run in parallel with T029
- **Phase 6**: Tasks T035, T037, T038, T041, T044 can run in parallel (different files/activities)

---

## Parallel Example: Foundational Phase

```bash
# After completing T005-T007 sequentially, these can run together:
Task T008: Add overdue color variables for light mode
Task T009: Add overdue color variables for dark mode
# Then:
Task T010: Add .overdue CSS class (different file than T008-T009)
```

## Parallel Example: User Story 1

```bash
# After T012-T014 complete, these can run together:
Task T012: Import isOverdue utility in TodoCard.js
Task T015: Update TodoCard.test.js with tests (different file)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T011) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T012-T022)
4. **STOP and VALIDATE**: Test User Story 1 independently with real todos
5. Optional: Deploy/demo if ready
6. Estimated time: 2-3 hours

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T011)
2. Add User Story 1 → Test independently → Deploy/Demo (T012-T022) - **MVP!**
3. Add User Story 2 → Test independently → Deploy/Demo (T023-T028)
4. Add User Story 3 → Test independently → Deploy/Demo (T029-T034)
5. Polish → Final validation (T035-T046)
6. Each story adds value without breaking previous stories
7. Total estimated time: 3-4 hours including polish

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T011)
2. Once Foundational is done:
   - Developer A: User Story 1 (T012-T022)
   - Developer B: Can start User Story 2 tests in parallel (T024-T025 while waiting for T012-T014)
   - Developer C: Can work on Polish tasks like documentation (T044)
3. Stories complete and integrate independently

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **No backend changes**: This is a frontend-only feature (per research.md and contracts/)
- **Tests included**: Following TDD best practices per testing-guidelines.md
- Each user story should be independently completable and testable
- Commit after each task or logical group per coding-guidelines.md
- Stop at any checkpoint to validate story independently
- **WCAG AA compliance**: Critical for visual indicators (FR-008)
- **MVP = User Story 1**: Delivers core value (visual identification of overdue items)
- **Deferred**: Midnight auto-detection timer (US3, Option C from CL-002) - document for future
- Total tasks: 46 (11 foundational + 11 US1 + 6 US2 + 6 US3 + 12 polish)
- Estimated parallel opportunities: ~12 tasks can run concurrently within phases

---

## Acceptance Scenarios Coverage

### User Story 1 (Phase 3)
- ✅ AS1.1: Overdue todo displays with distinctive visual indicator (T016-T018)
- ✅ AS1.2: Multiple todos with only overdue showing indicator (T016-T022)
- ✅ AS1.3: Today's due date NOT overdue (verified in dateUtils tests T006-T007)
- ✅ AS1.4: Completed overdue todo does NOT show indicator (T019)
- ✅ AS1.5: Todo without due date does NOT show indicator (T020)

### User Story 2 (Phase 4)
- ✅ AS2.1: Marking overdue todo complete removes indicator (T026)
- ✅ AS2.2: Unmarking completed overdue todo shows indicator again (T027)

### User Story 3 (Phase 5)
- ✅ AS3.1: Midnight transition (documented as future enhancement - T034)
- ✅ AS3.2: New todo with past due date shows indicator immediately (T031)

### Edge Cases (validated throughout)
- ✅ Invalid dates: Handled in dateUtils.js (T005-T007)
- ✅ Far past dates: Same treatment as recent past (T006)
- ✅ Completion after due date: Indicator disappears (T026)
- ✅ Date boundaries: Date-only comparison in dateUtils (T006-T007)

---

## Success Criteria Validation

- **SC-001** (2-second identification): Validated manually in T016-T021 browser tests
- **SC-002** (95% usability success): Post-launch metric, documented in T044
- **SC-003** (100ms update): Browser re-render is instantaneous, validated in T026-T027
- **SC-004** (WCAG AA): Validated with contrast checker in T011, browser audit in T040
- **SC-005** (Light/dark modes): Explicitly tested in T021, T038
