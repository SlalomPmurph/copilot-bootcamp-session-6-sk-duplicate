# Implementation Plan: Overdue Todo Items Identification

**Branch**: `001-overdue-todos` | **Date**: 2026-02-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature adds visual identification of overdue todo items in the todo application. Todos with due dates earlier than the current date will display distinctive visual indicators (e.g., red text or highlighted background) to help users quickly identify and prioritize tasks. The implementation is frontend-focused with no backend changes required, using client-side date comparison to compute overdue status dynamically.

## Technical Context

**Language/Version**: JavaScript (ES6+) with Node.js v16+  
**Primary Dependencies**: React 18.2.0, Express.js 4.18.2, Jest 29.7.0  
**Storage**: SQLite (better-sqlite3) for persistent todo storage  
**Testing**: Jest with React Testing Library for frontend, Jest with Supertest for backend  
**Target Platform**: Web application (Chrome, Firefox, Safari latest versions)  
**Project Type**: Monorepo - React frontend (`packages/frontend`) + Express backend (`packages/backend`)  
**Performance Goals**: <100ms for overdue status calculation, <16ms render time for visual updates  
**Constraints**: WCAG AA contrast standards for both light/dark modes, no backend API changes  
**Scale/Scope**: Single-user application with estimated <1000 todos, pure client-side computation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality & Maintainability
- ✅ **DRY**: Date comparison logic will be extracted into a utility function (`isOverdue()`)
- ✅ **Single Responsibility**: Overdue visual logic isolated to TodoCard component styling
- ✅ **SOLID**: No new dependencies, extends existing component behavior via props/composition
- ✅ **Naming**: `isOverdue`, `overdueClass`, `isTaskOverdue` follow camelCase conventions
- ✅ **Code Organization**: Utilities in `src/utils/`, styles in component CSS/theme.css
- ✅ **KISS**: Simple date comparison, no complex algorithms or state management

### Testing Discipline (NON-NEGOTIABLE)
- ✅ **80%+ Coverage**: New utility function and component changes will have 100% test coverage
- ✅ **Test Types**: Unit tests for `isOverdue()` utility, integration tests for TodoCard visual rendering
- ✅ **Test Quality**: Tests verify behavior (visual indicator appears for overdue todos), not implementation
- ✅ **Test Isolation**: Mock Date object for consistent test execution, no shared state
- ✅ **AAA Pattern**: All tests follow Arrange-Act-Assert structure

### Component Architecture
- ✅ **React Components**: TodoCard modified to accept computed `isOverdue` prop from parent
- ✅ **Monorepo Structure**: Changes isolated to `packages/frontend/src/` - no backend changes
- ✅ **File Organization**: Tests in `__tests__/` directories alongside source files
- ✅ **Performance**: Minimal performance impact - date comparison is O(1), no unnecessary re-renders

### Error Handling & User Feedback
- ✅ **Graceful Degradation**: Todos without due dates or with invalid dates gracefully skip overdue check
- ✅ **No User Errors**: Pure visual feature, no user input or async operations
- ✅ **Validation**: Date comparison validates that dueDate exists and is valid before comparison

### Code Review & Version Control
- ✅ **Atomic Commits**: Separate commits for utility function, component changes, styling, tests
- ✅ **Feature Branch**: Work on `001-overdue-todos` branch
- ✅ **Linting**: All code passes ESLint checks
- ✅ **No Debug Code**: No console.log statements in production code

### Technology Stack Constraints
- ✅ **No New Dependencies**: Feature uses standard JavaScript Date API, no new packages
- ✅ **React Functional Components**: Existing TodoCard is functional component with hooks
- ✅ **Jest + RTL**: Tests use existing test infrastructure

**GATE STATUS**: ✅ **PASSED** - All constitutional principles satisfied, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js          # MODIFIED: Add overdue visual styling
│   │   ├── TodoList.js          # MODIFIED: Pass isOverdue prop to TodoCard
│   │   └── __tests__/
│   │       ├── TodoCard.test.js # MODIFIED: Add overdue visual tests
│   │       └── TodoList.test.js # MODIFIED: Add overdue propagation tests
│   ├── utils/
│   │   ├── dateUtils.js         # NEW: isOverdue() utility function
│   │   └── __tests__/
│   │       └── dateUtils.test.js # NEW: isOverdue() unit tests
│   └── styles/
│       └── theme.css            # MODIFIED: Add overdue color variables
└── package.json                 # NO CHANGE

packages/backend/
└── [NO CHANGES - overdue is client-side only]
```

**Structure Decision**: Web application structure (Option 2) with changes isolated to frontend package. Backend remains unchanged as overdue status is computed client-side using JavaScript Date API. All new code follows existing monorepo conventions with colocated tests.

## Complexity Tracking

> **No violations - this section intentionally left empty**

This feature introduces no constitutional violations. All changes follow established patterns:
- Pure frontend feature using existing React architecture
- Simple utility function with comprehensive tests
- No new dependencies or architectural patterns
- Meets all code quality, testing, and maintainability requirements

---

## Post-Phase 1 Constitution Re-Check

*Status*: ✅ **PASSED** (Re-evaluated after completing research, data model, contracts, and quickstart)

After completing Phase 0 (research) and Phase 1 (design), all constitutional principles remain satisfied:

### Verified Against Completed Artifacts

1. **research.md** confirms:
   - ✅ No new dependencies (uses JavaScript Date API)
   - ✅ Simple, KISS-compliant date comparison approach
   - ✅ Multi-layered accessibility approach (border + color + icon)
   - ✅ Jest-based testing strategy with fake timers

2. **data-model.md** confirms:
   - ✅ No database schema changes
   - ✅ No backend modifications
   - ✅ Pure computed property using existing fields

3. **contracts/api-contracts.md** confirms:
   - ✅ Zero API changes
   - ✅ Backward compatible
   - ✅ Client-side computation only

4. **quickstart.md** confirms:
   - ✅ Clear implementation path with test-first approach
   - ✅ Comprehensive test coverage (15+ test cases)
   - ✅ WCAG AA compliance validation steps
   - ✅ Follows existing code organization patterns

### Final Validation

- **Code Quality**: Utility function extracted (DRY), single responsibility maintained
- **Testing**: 100% coverage target for new code, deterministic tests with mocked dates
- **Architecture**: No architectural changes, extends existing patterns
- **Performance**: O(1) computation per todo, <16ms render constraint met
- **Accessibility**: WCAG AA verified (7.51:1 contrast light, 7.84:1 dark)
- **Dependencies**: Zero new dependencies added

**CONCLUSION**: Feature design fully aligns with project constitution. Ready to proceed with implementation (Phase 2).

---

## Phase Summary

### Phase 0: Research ✅ Complete
- [research.md](./research.md) created with 4 key technical decisions
- All "NEEDS CLARIFICATION" items from Technical Context resolved
- No unknowns remaining

### Phase 1: Design ✅ Complete
- [data-model.md](./data-model.md) - Documented computed property approach, no schema changes
- [contracts/api-contracts.md](./contracts/api-contracts.md) - Confirmed zero API changes
- [quickstart.md](./quickstart.md) - Complete implementation guide with code samples
- Agent context updated: `.github/agents/copilot-instructions.md`

### Next Steps
Run `/speckit.tasks` command to generate `tasks.md` and begin implementation (Phase 2).
