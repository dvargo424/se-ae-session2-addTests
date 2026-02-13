# Testing Guidelines - TODO Application

## Overview
This document outlines the testing strategy, standards, and best practices for the TODO application. A comprehensive testing approach ensures code quality, reliability, and maintainability across all layers of the application.

## Testing Philosophy

### Core Principles
- **Test Pyramid**: Focus on unit tests (base), integration tests (middle), and E2E tests (top)
- **Isolation**: Each test must be independent and not rely on other tests
- **Repeatability**: Tests must succeed on multiple consecutive runs
- **Maintainability**: Tests should be clear, well-organized, and easy to update
- **Coverage**: All new features must include appropriate tests
- **Focused E2E**: Limit end-to-end tests to critical user journeys only

## Test Types and Organization

### Unit Tests

#### Purpose
Test individual functions, methods, and React components in isolation without external dependencies.

#### Framework
- **Test Runner**: Jest
- **Component Testing**: React Testing Library (@testing-library/react)
- **Assertions**: Jest's built-in matchers

#### Naming Convention
- **Required Pattern**: `*.test.js` or `*.test.ts`
- **File Naming**: Match the file being tested (e.g., `app.test.js` tests `app.js`)
- **Descriptive Names**: Use clear, descriptive test names that explain what is being tested

#### Directory Structure

**Backend Unit Tests:**
```
packages/backend/__tests__/
  ├── app.test.js          # Tests for app.js
  ├── middleware.test.js   # Tests for middleware
  ├── utils.test.js        # Tests for utility functions
  └── models/
      └── task.test.js     # Tests for task model
```

**Frontend Unit Tests:**
```
packages/frontend/src/__tests__/
  ├── App.test.js          # Tests for App.js component
  ├── TaskList.test.js     # Tests for TaskList component
  ├── TaskItem.test.js     # Tests for TaskItem component
  └── utils/
      └── helpers.test.js  # Tests for helper functions
```

#### Best Practices for Unit Tests
- **Arrange-Act-Assert (AAA)**: Structure tests with clear setup, execution, and verification
- **Mock External Dependencies**: Use Jest mocks for APIs, databases, and external services
- **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
- **One Assertion Focus**: Each test should verify one specific behavior
- **Edge Cases**: Test boundary conditions, empty inputs, null values, etc.

#### Example Unit Test Structure
```javascript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid title', () => {
      // Arrange
      const taskData = { title: 'Buy groceries' };
      
      // Act
      const result = createTask(taskData);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Buy groceries');
    });

    it('should throw error when title is empty', () => {
      // Arrange
      const taskData = { title: '' };
      
      // Act & Assert
      expect(() => createTask(taskData)).toThrow('Title is required');
    });
  });
});
```

### Integration Tests

#### Purpose
Test the interaction between multiple components, particularly backend API endpoints with real HTTP requests and database interactions.

#### Framework
- **Test Runner**: Jest
- **HTTP Testing**: Supertest
- **Database**: Use test database or in-memory database

#### Naming Convention
- **Required Pattern**: `*.test.js` or `*.test.ts`
- **File Naming**: Intelligent naming based on what is tested (e.g., `todos-api.test.js` for TODO API endpoints)

#### Directory Structure
```
packages/backend/__tests__/integration/
  ├── todos-api.test.js    # Tests for TODO CRUD endpoints
  ├── auth-api.test.js     # Tests for authentication endpoints
  └── filters-api.test.js  # Tests for filtering/sorting endpoints
```

#### Best Practices for Integration Tests
- **Test Real Flows**: Use actual HTTP requests, not mocked endpoints
- **Database Isolation**: Each test should use a clean database state
- **Status Codes**: Verify correct HTTP status codes (200, 201, 400, 404, etc.)
- **Response Structure**: Validate response body structure and data types
- **Error Handling**: Test error scenarios and invalid inputs
- **Setup/Teardown**: Clear database before/after each test

#### Example Integration Test Structure
```javascript
const request = require('supertest');
const app = require('../../src/app');

describe('TODO API Endpoints', () => {
  beforeEach(async () => {
    // Clear database before each test
    await clearDatabase();
  });

  describe('POST /api/todos', () => {
    it('should create a new todo and return 201', async () => {
      const todoData = {
        title: 'Write tests',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Write tests');
      expect(response.body.priority).toBe('high');
    });

    it('should return 400 when title is missing', async () => {
      const todoData = { priority: 'low' };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
```

### End-to-End (E2E) Tests

#### Purpose
Test complete user workflows through browser automation to ensure the entire application works correctly from a user's perspective.

#### Framework
- **Required**: Playwright (mandatory framework)
- **Browser**: Use ONE browser only (Chromium recommended for CI/CD speed)
- **Pattern**: Page Object Model (POM) required for maintainability

#### Naming Convention
- **Required Pattern**: `*.spec.js` or `*.spec.ts`
- **File Naming**: Based on user journey (e.g., `todo-workflow.spec.js`, `task-filtering.spec.js`)

#### Directory Structure
```
tests/e2e/
  ├── specs/
  │   ├── todo-workflow.spec.js      # Create, edit, complete, delete tasks
  │   ├── task-filtering.spec.js     # Filter and sort functionality
  │   ├── due-dates.spec.js          # Due date management
  │   └── priority-management.spec.js
  ├── pages/
  │   ├── BasePage.js                # Base page object
  │   ├── TodoPage.js                # Main TODO page object
  │   └── components/
  │       ├── TaskListComponent.js
  │       └── TaskFormComponent.js
  └── fixtures/
      └── testData.js                # Test data fixtures
```

#### Page Object Model (POM) Pattern

**Required Structure**: All E2E tests must use POM to separate page structure from test logic.

**Example Page Object:**
```javascript
// pages/TodoPage.js
class TodoPage {
  constructor(page) {
    this.page = page;
    this.addTaskButton = page.locator('[data-testid="add-task-button"]');
    this.taskTitleInput = page.locator('[data-testid="task-title-input"]');
    this.saveButton = page.locator('[data-testid="save-task-button"]');
    this.taskList = page.locator('[data-testid="task-list"]');
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
  }

  async addTask(title, options = {}) {
    await this.addTaskButton.click();
    await this.taskTitleInput.fill(title);
    
    if (options.dueDate) {
      await this.dueDatePicker.fill(options.dueDate);
    }
    
    await this.saveButton.click();
  }

  async getTaskByTitle(title) {
    return this.taskList.locator(`text="${title}"`);
  }
}

module.exports = { TodoPage };
```

**Example Test Using POM:**
```javascript
// specs/todo-workflow.spec.js
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('TODO Workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should create and complete a task', async () => {
    // Create task
    await todoPage.addTask('Buy milk');
    
    // Verify task appears
    const task = await todoPage.getTaskByTitle('Buy milk');
    await expect(task).toBeVisible();
    
    // Complete task
    await todoPage.completeTask('Buy milk');
    
    // Verify completion
    await expect(task).toHaveClass(/completed/);
  });
});
```

#### E2E Test Scope
**CRITICAL**: Limit E2E tests to 5-8 critical user journeys. Focus on quality over quantity.

**Recommended E2E Test Coverage:**
1. **Core CRUD Operations**: Create, read, update, delete tasks
2. **Task Completion**: Mark tasks as complete/incomplete
3. **Due Date Management**: Add and edit due dates, verify overdue indicators
4. **Priority Management**: Set and change task priorities
5. **Filtering**: Filter tasks by status (all, active, completed)
6. **Sorting**: Sort tasks by different criteria
7. **Data Persistence**: Verify tasks persist after page reload
8. **Edge Cases**: Handle empty states, validation errors

**What NOT to test in E2E:**
- Every possible input validation (unit test coverage)
- Complex business logic (integration test coverage)
- Visual styling details (visual regression tools if needed)
- Performance benchmarks (separate performance testing)

#### Best Practices for E2E Tests
- **Single Browser**: Configure Playwright to use Chromium only
- **Stable Selectors**: Use `data-testid` attributes for reliable element selection
- **Wait Strategies**: Use Playwright's auto-waiting; avoid arbitrary timeouts
- **Test Isolation**: Each test should set up its own data
- **Independent Tests**: Tests must not depend on execution order
- **Realistic Scenarios**: Test actual user behavior patterns
- **Screenshot on Failure**: Capture screenshots for debugging failures

## Port Configuration

### Critical Requirement
**ALWAYS use environment variables with sensible defaults for port configuration.** This enables CI/CD workflows to dynamically detect and assign ports.

### Backend Port Configuration
```javascript
// packages/backend/src/index.js
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Frontend Port Configuration
```javascript
// React default port is 3000
// Override with environment variable:
// PORT=3001 npm start
```

### Playwright Configuration
```javascript
// playwright.config.js
const PORT = process.env.PORT || 3000;

module.exports = {
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: 'npm start',
    port: PORT,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
};
```

### Why This Matters
- **CI/CD Compatibility**: Automated pipelines can assign available ports
- **Parallel Testing**: Multiple test suites can run simultaneously
- **Docker/Container**: Container orchestration can map ports dynamically
- **Local Development**: Developers can avoid port conflicts

## Test Isolation and Independence

### Critical Requirements

#### Each Test Must Be Independent
- **No Shared State**: Tests cannot rely on data from other tests
- **No Execution Order**: Tests must pass regardless of run order
- **Setup Own Data**: Each test creates the data it needs

#### Setup and Teardown Hooks
**REQUIRED**: All test suites must implement proper setup and teardown.

**Unit Tests:**
```javascript
describe('TaskService', () => {
  beforeEach(() => {
    // Reset mocks, clear state
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup if needed
  });
});
```

**Integration Tests:**
```javascript
describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await connectTestDatabase();
  });

  beforeEach(async () => {
    // Clear database before each test
    await clearAllTables();
  });

  afterAll(async () => {
    // Disconnect from test database
    await disconnectDatabase();
  });
});
```

**E2E Tests:**
```javascript
test.describe('TODO E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear application state
    await page.goto('http://localhost:3000');
    await clearAllTasks(page);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup if needed
  });
});
```

## Test Coverage Requirements

### Coverage Targets
- **Unit Tests**: Aim for 80%+ code coverage
- **Integration Tests**: Cover all API endpoints and critical paths
- **E2E Tests**: Cover 5-8 critical user journeys (not all possible paths)

### New Feature Requirements
**MANDATORY**: All new features must include appropriate tests BEFORE merging.

#### Definition of Done for New Features
A feature is not complete unless it has:
1. ✅ Unit tests for new functions/components
2. ✅ Integration tests for new API endpoints
3. ✅ E2E test if it's a user-facing workflow
4. ✅ All tests passing in CI/CD pipeline
5. ✅ Code coverage maintained or improved

### Test-Driven Development (TDD)
**Recommended**: Write tests before implementation when possible:
1. Write failing test that defines expected behavior
2. Implement minimum code to make test pass
3. Refactor while keeping tests green

## Running Tests

### Local Development

**Run All Unit Tests:**
```bash
# Backend
cd packages/backend
npm test

# Frontend
cd packages/frontend
npm test
```

**Run Specific Test File:**
```bash
npm test -- app.test.js
```

**Run Tests in Watch Mode:**
```bash
npm test -- --watch
```

**Run Integration Tests:**
```bash
cd packages/backend
npm test -- --testPathPattern=integration
```

**Run E2E Tests:**
```bash
cd tests/e2e
npx playwright test
```

**Run Specific E2E Test:**
```bash
npx playwright test todo-workflow.spec.js
```

**Run E2E Tests with UI:**
```bash
npx playwright test --ui
```

### CI/CD Pipeline
Tests should run automatically on:
- Pull request creation
- Commits to main/develop branches
- Before deployment

**Recommended Pipeline Order:**
1. Unit tests (fastest, fail fast)
2. Integration tests (medium speed)
3. E2E tests (slowest, run last)

## Test Maintainability Best Practices

### Clear Test Names
Use descriptive test names that explain what is being tested:
```javascript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('should return 404 when task does not exist', () => { ... });
```

### Avoid Test Duplication
Extract common setup logic into helper functions or fixtures:
```javascript
// testHelpers.js
function createTestTask(overrides = {}) {
  return {
    id: 1,
    title: 'Test Task',
    completed: false,
    ...overrides
  };
}
```

### Keep Tests Simple
- One logical assertion per test
- Avoid complex logic in tests
- Tests should be easier to read than the code they test

### Update Tests When Refactoring
When code changes, update tests immediately. Broken tests are worse than no tests.

### Use Test Data Builders
Create factories for complex test data:
```javascript
class TaskBuilder {
  constructor() {
    this.task = {
      title: 'Default Task',
      completed: false,
      priority: 'medium'
    };
  }

  withTitle(title) {
    this.task.title = title;
    return this;
  }

  withHighPriority() {
    this.task.priority = 'high';
    return this;
  }

  build() {
    return { ...this.task };
  }
}

// Usage
const task = new TaskBuilder()
  .withTitle('Important Task')
  .withHighPriority()
  .build();
```

## Debugging Tests

### Unit and Integration Tests
```bash
# Run with verbose output
npm test -- --verbose

# Run with coverage report
npm test -- --coverage

# Debug in Node
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests
```bash
# Run with headed browser
npx playwright test --headed

# Debug mode (pauses on failure)
npx playwright test --debug

# Generate trace for debugging
npx playwright test --trace on
```

## Common Pitfalls to Avoid

### ❌ Tests That Depend on Each Other
```javascript
// BAD: Second test depends on first
test('create task', () => { ... });
test('update the created task', () => { ... }); // Depends on previous test
```

### ❌ Hardcoded Wait Times
```javascript
// BAD
await page.waitForTimeout(5000); // Arbitrary wait

// GOOD
await expect(page.locator('[data-testid="task"]')).toBeVisible();
```

### ❌ Testing Implementation Details
```javascript
// BAD: Testing internal state
expect(component.state.isLoading).toBe(false);

// GOOD: Testing user-visible behavior
expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
```

### ❌ Massive E2E Test Suites
```javascript
// BAD: 50+ E2E tests covering every edge case
// GOOD: 5-8 E2E tests for critical paths, unit tests for edge cases
```

## Summary Checklist

Before merging code, ensure:
- [ ] All new functions have unit tests
- [ ] All new API endpoints have integration tests
- [ ] New user-facing features have E2E tests (if critical)
- [ ] Tests follow naming conventions (*.test.js, *.spec.js)
- [ ] Tests are in correct directories
- [ ] E2E tests use Page Object Model pattern
- [ ] Port configuration uses environment variables
- [ ] Tests are isolated with proper setup/teardown
- [ ] All tests pass locally
- [ ] Code coverage is maintained or improved
- [ ] Tests are maintainable and well-documented
