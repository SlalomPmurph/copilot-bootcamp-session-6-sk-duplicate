<!--
SYNC IMPACT REPORT
==================
Version Change: INITIAL → 1.0.0
Creation Rationale: Initial constitution based on existing project documentation
Modified Principles: N/A (initial creation)
Added Sections:
  - I. Code Quality & Maintainability
  - II. Testing Discipline
  - III. Component Architecture
  - IV. Error Handling & User Feedback
  - V. Code Review & Version Control
Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - Requirements structure supports testable user stories
  ✅ tasks-template.md - Task organization supports test-first and independent testing
Follow-up TODOs: None
==================
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Maintainability

All code MUST adhere to established quality standards to ensure long-term maintainability and team consistency:

- **DRY (Don't Repeat Yourself)**: Extract common code into reusable functions, components, and utilities. No duplicate logic across multiple locations.
- **Single Responsibility**: Each module, component, or function MUST have one well-defined purpose and one reason to change.
- **SOLID Principles**: Follow all five SOLID principles, particularly Single Responsibility and Dependency Inversion.
- **Naming Conventions**: Use `camelCase` for variables/functions, `PascalCase` for components/classes, `UPPER_SNAKE_CASE` for constants.
- **Code Organization**: Logical grouping with clear import hierarchy (external libs → internal modules → styles).
- **Simplicity (KISS)**: Prefer simple, straightforward implementations. Code MUST be easy to understand at first glance.

**Rationale**: Consistent code quality reduces technical debt, improves onboarding, and enables faster feature development. These principles are non-negotiable to maintain a healthy codebase.

### II. Testing Discipline (NON-NEGOTIABLE)

Testing is mandatory and MUST be comprehensive:

- **80%+ Code Coverage**: Target minimum 80% code coverage across all packages (frontend and backend).
- **Test Types Required**:
  - Unit tests for components, functions, and business logic
  - Integration tests for component interactions and API communication
  - All tests MUST be independent and not rely on other tests
- **Test Quality**: Focus on testing behavior, not implementation. Tests MUST have clear, descriptive names explaining what is being tested.
- **Test Isolation**: Each test sets up its own data, mocks external dependencies (API calls, timers), and cleans up after itself.
- **Arrange-Act-Assert Pattern**: All tests MUST follow AAA structure for clarity.

**Rationale**: Comprehensive testing ensures reliability, catches regressions early, and serves as living documentation. Test-first thinking prevents bugs before they enter production.

### III. Component Architecture

UI and backend components MUST follow consistent architectural patterns:

- **React Components**: 
  - Single responsibility - display logic only, no data fetching/deletion
  - Props for configuration, composition for extension
  - No prop drilling beyond 2 levels without context
- **Monorepo Structure**: 
  - `packages/frontend/` for React application
  - `packages/backend/` for Express.js API
  - Shared code in appropriate workspace packages
- **File Organization**: Colocated tests in `__tests__/` directories alongside source files
- **Performance**: Avoid unnecessary renders using `useMemo` and `useCallback` appropriately

**Rationale**: Clear architectural boundaries reduce coupling, improve testability, and enable parallel development across frontend and backend teams.

### IV. Error Handling & User Feedback

All operations that can fail MUST handle errors gracefully:

- **Try-Catch Blocks**: Wrap all async operations and operations that can throw errors
- **Meaningful Error Messages**: Provide clear, actionable error messages for users and developers
- **User Feedback**: Inform users when operations succeed or fail with appropriate UI feedback
- **Logging**: Use `console.error` for error logging during development (remove for production)
- **Validation**: Validate input data at API boundaries and form submissions

**Rationale**: Graceful error handling improves user experience, aids debugging, and prevents cascading failures.

### V. Code Review & Version Control

All code changes MUST go through review and follow git best practices:

- **Atomic Commits**: Each commit represents one logical change with a clear commit message
- **Commit Messages**: Descriptive messages explaining the "why" (format: `type: description`)
- **Feature Branches**: Use feature branches for new work (e.g., `feature/todo-editing`)
- **Pull Requests**: All changes MUST go through PR review before merging
- **Linting**: All code MUST pass ESLint checks. Address all errors and warnings before PR submission
- **No Debug Code**: Remove all `console.log`, commented code, and debug artifacts before commit

**Rationale**: Code review catches issues early, shares knowledge, and maintains quality standards. Clean git history aids debugging and auditing.

## Technology Stack Constraints

**Language**: JavaScript (ES6+)  
**Frontend Framework**: React with functional components and hooks  
**Backend Framework**: Express.js (Node.js)  
**Testing Framework**: Jest with React Testing Library for frontend  
**Build System**: npm workspaces for monorepo management  
**Code Quality**: ESLint for linting  
**Styling**: CSS with design system (Material Design-inspired, Halloween theme)  

**Package Management**: npm (v7+) with workspace support  
**Node Version**: v16 or higher  

All new dependencies MUST be justified and approved. Prefer standard libraries over adding new dependencies.

## Development Workflow

### Pre-Development Checklist
- [ ] Review functional requirements and acceptance criteria
- [ ] Review UI/UX guidelines for frontend work
- [ ] Identify reusable components/utilities before creating new ones

### Development Process
1. Create feature branch from `main`
2. Write failing tests first (unit and integration as applicable)
3. Implement feature to make tests pass
4. Refactor while keeping tests green
5. Run full test suite locally
6. Verify linting passes
7. Update documentation if needed
8. Create pull request with descriptive title and body

### Code Review Requirements
- At least one approval required before merge
- All CI checks MUST pass (tests, linting)
- Reviewer MUST verify adherence to constitution principles
- Test coverage MUST not decrease

### Quality Gates
- All tests passing (unit + integration)
- 80%+ code coverage maintained or improved
- Zero linting errors or warnings
- No console statements in production code
- All edge cases handled with tests

## Governance

This constitution supersedes all other development practices and guidelines. All team members MUST adhere to these principles.

### Amendment Process
- Amendments require team discussion and consensus
- Constitution version MUST be updated following semantic versioning:
  - **MAJOR**: Backward-incompatible changes (removing/redefining principles)
  - **MINOR**: New principles added or material expansions
  - **PATCH**: Clarifications, wording fixes, non-semantic refinements
- All amendments MUST include rationale and migration plan if applicable
- Amendment date MUST be recorded in Last Amended field

### Compliance
- All pull requests MUST be reviewed for constitutional compliance
- Violations MUST be addressed before merge
- Repeated violations require team discussion and process improvement
- Use `docs/coding-guidelines.md`, `docs/testing-guidelines.md`, `docs/ui-guidelines.md`, and `docs/functional-requirements.md` for detailed runtime guidance

### Documentation Hierarchy
1. **Constitution** (this file) - Non-negotiable principles and constraints
2. **Guidelines** (`docs/` directory) - Detailed implementation guidance
3. **Code Comments** - Contextual explanations for complex logic

**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02
