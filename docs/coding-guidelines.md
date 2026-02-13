# Coding Guidelines - TODO Application

## Overview
This document outlines the coding style, conventions, and quality principles for the TODO application. Consistent code style improves readability, maintainability, and collaboration across the team. These guidelines apply to both frontend and backend code.

## Core Philosophy

### Guiding Principles
- **Clarity Over Cleverness**: Write code that is easy to understand, not code that shows off
- **Consistency**: Follow established patterns throughout the codebase
- **Simplicity**: Choose the simplest solution that solves the problem
- **Maintainability**: Write code that future developers (including yourself) can easily modify
- **Testability**: Design code that can be easily tested in isolation

## Code Quality Principles

### DRY (Don't Repeat Yourself)
**Principle**: Every piece of knowledge should have a single, unambiguous representation in the system.

**Application**:
- Extract repeated code into reusable functions or components
- Use configuration files for repeated values (URLs, constants, etc.)
- Create utility functions for common operations
- Share types and interfaces across modules

**Example - Before (Repetitive):**
```javascript
// ❌ Repetitive validation in multiple places
function createTask(data) {
  if (!data.title || data.title.trim() === '') {
    throw new Error('Title is required');
  }
  if (data.title.length > 200) {
    throw new Error('Title too long');
  }
  // ... create task
}

function updateTask(id, data) {
  if (!data.title || data.title.trim() === '') {
    throw new Error('Title is required');
  }
  if (data.title.length > 200) {
    throw new Error('Title too long');
  }
  // ... update task
}
```

**Example - After (DRY):**
```javascript
// ✅ Extracted validation function
function validateTaskTitle(title) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  if (title.length > 200) {
    throw new Error('Title too long');
  }
}

function createTask(data) {
  validateTaskTitle(data.title);
  // ... create task
}

function updateTask(id, data) {
  validateTaskTitle(data.title);
  // ... update task
}
```

### KISS (Keep It Simple, Stupid)
**Principle**: Simplicity should be a key goal, and unnecessary complexity should be avoided.

**Application**:
- Avoid premature optimization
- Don't add features "just in case"
- Use straightforward algorithms unless performance requires otherwise
- Prefer built-in language features over custom implementations
- Break complex functions into smaller, simpler ones

**Example:**
```javascript
// ❌ Overly complex
function getTaskStatus(task) {
  return task.completed === true ? 'completed' : 
         task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' :
         task.dueDate && new Date(task.dueDate) - new Date() < 86400000 ? 'due-soon' :
         'active';
}

// ✅ Simple and clear
function getTaskStatus(task) {
  if (task.completed) return 'completed';
  if (isOverdue(task)) return 'overdue';
  if (isDueSoon(task)) return 'due-soon';
  return 'active';
}

function isOverdue(task) {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date();
}

function isDueSoon(task) {
  if (!task.dueDate) return false;
  const hoursUntilDue = (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60);
  return hoursUntilDue < 24 && hoursUntilDue > 0;
}
```

### YAGNI (You Aren't Gonna Need It)
**Principle**: Don't implement something until it is necessary.

**Application**:
- Implement features only when they are actually needed
- Remove unused code and dependencies
- Don't build abstraction layers before you need them
- Focus on current requirements, not hypothetical future needs

### Single Responsibility Principle (SRP)
**Principle**: A function, class, or module should have one reason to change.

**Application**:
- Each function should do one thing and do it well
- Components should have a single, well-defined purpose
- Separate concerns (business logic, data access, presentation)
- Split large files into smaller, focused modules

**Example:**
```javascript
// ❌ Multiple responsibilities
function processTask(task) {
  // Validates task
  if (!task.title) throw new Error('Invalid task');
  
  // Saves to database
  const saved = database.save(task);
  
  // Sends notification
  emailService.notify(task.assignee);
  
  // Logs activity
  logger.log(`Task ${task.id} processed`);
  
  return saved;
}

// ✅ Single responsibilities
function validateTask(task) {
  if (!task.title) throw new Error('Invalid task');
}

function saveTask(task) {
  return database.save(task);
}

function notifyTaskCreated(task) {
  emailService.notify(task.assignee);
}

function processTask(task) {
  validateTask(task);
  const saved = saveTask(task);
  notifyTaskCreated(task);
  logger.log(`Task ${task.id} processed`);
  return saved;
}
```

### Separation of Concerns
**Principle**: Different concerns should be separated into distinct sections of code.

**Application**:
- Keep business logic separate from UI components
- Separate data access from business logic
- Use layered architecture (presentation, business, data)
- Frontend: Keep API calls separate from component logic

**Example Structure:**
```
// Frontend layered architecture
src/
  ├── components/      # Presentation (UI only)
  ├── services/        # Business logic and API calls
  ├── hooks/           # Reusable React hooks
  ├── utils/           # Pure utility functions
  └── constants/       # Application constants

// Backend layered architecture
src/
  ├── routes/          # HTTP routing
  ├── controllers/     # Request/response handling
  ├── services/        # Business logic
  ├── models/          # Data models
  └── utils/           # Helper functions
```

## Formatting and Style

### General Formatting

#### Indentation
- **Standard**: Use 2 spaces for indentation (no tabs)
- **Consistency**: Configure your editor to use spaces, not tabs
- **Rationale**: Ensures code looks the same across all editors and platforms

#### Line Length
- **Maximum**: 100 characters per line (soft limit)
- **When to Break**: Break long lines at logical points (parameters, operators)
- **Rationale**: Improves readability and reduces horizontal scrolling

#### Whitespace
- **Around Operators**: Add spaces around operators (`a + b`, not `a+b`)
- **After Commas**: Add space after commas in lists (`[1, 2, 3]`, not `[1,2,3]`)
- **Block Spacing**: Add blank line between logical blocks
- **No Trailing**: Remove trailing whitespace at end of lines

**Example:**
```javascript
// ✅ Good formatting
function calculateTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  return {
    subtotal,
    tax,
    total
  };
}

// ❌ Poor formatting
function calculateTotal(items){
  const subtotal=items.reduce((sum,item)=>sum+item.price,0);
  const tax=subtotal*0.08;
  const total=subtotal+tax;
  return {subtotal,tax,total};
}
```

#### Semicolons
- **JavaScript/TypeScript**: Use semicolons (required)
- **Rationale**: Prevents ASI (Automatic Semicolon Insertion) issues

#### Quotes
- **String Literals**: Use single quotes `'` for strings
- **Template Literals**: Use backticks `` for string interpolation
- **JSX Attributes**: Use double quotes `"` (React convention)
- **Consistency**: Be consistent within each file

```javascript
// ✅ Consistent quote usage
const message = 'Hello, world!';
const greeting = `Hello, ${name}!`;
const element = <div className="container">Content</div>;
```

### Naming Conventions

#### Variables and Functions
- **Style**: camelCase
- **Descriptive**: Use clear, meaningful names
- **Avoid Abbreviations**: Write `userData` not `usrDat`
- **Boolean Naming**: Prefix with `is`, `has`, `should` (e.g., `isComplete`, `hasErrors`)

```javascript
// ✅ Good naming
const taskList = [];
const isCompleted = false;
const hasErrors = false;

function getUserTasks() { ... }
function validateTaskTitle() { ... }

// ❌ Poor naming
const tl = [];
const comp = false;
const e = false;

function getTasks() { ... }  // Too generic
function validate() { ... }  // Too vague
```

#### Constants
- **Style**: UPPER_SNAKE_CASE for true constants
- **Location**: Group related constants together
- **Example**: `MAX_TITLE_LENGTH`, `API_BASE_URL`, `DEFAULT_PRIORITY`

```javascript
// constants.js
const MAX_TITLE_LENGTH = 200;
const MIN_TITLE_LENGTH = 1;
const DEFAULT_PRIORITY = 'medium';
const API_BASE_URL = 'http://localhost:3030/api';
```

#### Classes and Components
- **Style**: PascalCase
- **Descriptive**: Name should describe what it represents
- **Component Suffix**: Not required but can be used for clarity

```javascript
// ✅ Good naming
class TaskManager { ... }
class TaskService { ... }

// React components
function TaskList() { ... }
function TaskItem() { ... }
function AddTaskDialog() { ... }
```

#### Files and Directories
- **Components**: PascalCase (e.g., `TaskList.js`, `AddTaskDialog.js`)
- **Utilities**: camelCase (e.g., `dateUtils.js`, `validation.js`)
- **Tests**: Match source file with `.test.js` or `.spec.js` suffix
- **Directories**: lowercase with hyphens (e.g., `components/`, `shared-utils/`)

### Import Organization

#### Import Order
Organize imports in the following order with blank lines between groups:

1. **Third-party libraries** (React, external packages)
2. **Internal modules** (components, services, utils from your project)
3. **Styles** (CSS/SCSS files)
4. **Assets** (images, icons)

```javascript
// ✅ Well-organized imports
// Third-party
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField } from '@mui/material';

// Internal modules
import TaskList from './components/TaskList';
import { getTasks, createTask } from './services/taskService';
import { validateTaskTitle } from './utils/validation';
import { API_BASE_URL } from './constants';

// Styles
import './App.css';

// Assets
import logo from './assets/logo.svg';
```

#### Import Grouping
- **Group Related Imports**: Combine imports from same package
- **Named Imports**: Use destructuring for multiple exports
- **Default Imports**: Place before named imports from same package

```javascript
// ✅ Good grouping
import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, Box, Dialog } from '@mui/material';

// ❌ Poor grouping
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
```

#### Absolute vs Relative Imports
- **Relative Imports**: For files in same directory or nearby
- **Absolute Imports**: For shared utilities, constants, components
- **Configure Path Aliases**: Use jsconfig.json or tsconfig.json for cleaner imports

```javascript
// ✅ Good import paths
import TaskItem from './TaskItem';  // Same directory
import { API_BASE_URL } from '../../constants';  // Relative for project files
import { validateTask } from '@/utils/validation';  // Absolute with alias

// ❌ Avoid deep nesting
import { helper } from '../../../../../utils/helper';
```

#### Unused Imports
- **Remove Unused**: Delete imports that are not used in the file
- **ESLint Rule**: Enable `no-unused-vars` to catch unused imports

## Code Structure

### Function Design

#### Function Length
- **Target**: Keep functions under 30 lines when possible
- **Break Down**: Split large functions into smaller helpers
- **Single Purpose**: Each function should do one thing

#### Function Parameters
- **Limit**: Ideally 3 or fewer parameters
- **Object Parameters**: Use object destructuring for many parameters
- **Default Values**: Provide sensible defaults

```javascript
// ✅ Good parameter design
function createTask({ title, dueDate = null, priority = 'medium', description = '' }) {
  // Implementation
}

// Usage
createTask({ title: 'Buy milk', priority: 'high' });

// ❌ Too many parameters
function createTask(title, dueDate, priority, description, assignee, category, tags) {
  // Hard to remember order and meaning
}
```

#### Return Early
- **Guard Clauses**: Use early returns to handle edge cases
- **Reduce Nesting**: Avoid deep nested if statements

```javascript
// ✅ Early returns reduce nesting
function processTask(task) {
  if (!task) return null;
  if (!task.title) throw new Error('Title required');
  if (task.completed) return task;
  
  // Main logic here
  return updatedTask;
}

// ❌ Deep nesting
function processTask(task) {
  if (task) {
    if (task.title) {
      if (!task.completed) {
        // Main logic buried deep
      }
    }
  }
}
```

### Comments and Documentation

#### When to Comment
- **Why, Not What**: Explain why code exists, not what it does
- **Complex Logic**: Document algorithms or tricky implementations
- **TODOs**: Mark future improvements with `// TODO:` comments
- **Public APIs**: Document function parameters and return values

```javascript
// ✅ Good comments
// Calculate priority score based on due date and user-assigned priority.
// Overdue tasks get highest score to appear at top of list.
function calculatePriorityScore(task) {
  const priorityValues = { high: 3, medium: 2, low: 1 };
  const baseScore = priorityValues[task.priority] || 0;
  
  if (isOverdue(task)) {
    return baseScore + 10;  // Boost overdue tasks to top
  }
  
  return baseScore;
}

// ❌ Unnecessary comments
// Get the task list
const tasks = getTasks();

// Loop through tasks
for (const task of tasks) {
  // Check if complete
  if (task.completed) {
    // Do something
  }
}
```

#### JSDoc Comments
Use JSDoc for public functions and complex logic:

```javascript
/**
 * Creates a new task with the provided data.
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} [taskData.dueDate] - ISO date string (optional)
 * @param {string} [taskData.priority='medium'] - Task priority
 * @returns {Promise<Object>} The created task
 * @throws {Error} If title is invalid
 */
async function createTask(taskData) {
  // Implementation
}
```

### Error Handling

#### Use Proper Error Types
- **Custom Errors**: Create custom error classes for different scenarios
- **Error Messages**: Provide clear, actionable error messages
- **Error Context**: Include relevant information in errors

```javascript
// ✅ Good error handling
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new ValidationError('Task title is required', 'title');
  }
  if (task.title.length > 200) {
    throw new ValidationError('Task title must be 200 characters or less', 'title');
  }
}

// Usage with proper error handling
try {
  validateTask(taskData);
} catch (error) {
  if (error instanceof ValidationError) {
    showFieldError(error.field, error.message);
  } else {
    showGeneralError('An unexpected error occurred');
  }
}
```

#### Async/Await
- **Prefer async/await**: Use over promise chains for readability
- **Try/Catch**: Always wrap await calls in try/catch
- **Error Propagation**: Re-throw errors if you can't handle them

```javascript
// ✅ Good async/await usage
async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to load tasks: ${response.statusText}`);
    }
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error loading tasks:', error);
    throw error;  // Re-throw for caller to handle
  }
}

// ❌ Unhandled promise
async function loadTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);  // No error handling
  return response.json();
}
```

## React-Specific Guidelines

### Component Structure
Follow consistent component organization:

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';

// 2. Component
function TaskList({ tasks, onTaskComplete }) {
  // 3. State declarations
  const [filter, setFilter] = useState('all');
  
  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [tasks]);
  
  // 5. Event handlers
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  // 6. Helper functions
  const getFilteredTasks = () => {
    return tasks.filter(task => /* filter logic */);
  };
  
  // 7. Render
  return (
    <Box>
      {/* JSX */}
    </Box>
  );
}

// 8. PropTypes
TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTaskComplete: PropTypes.func.isRequired,
};

// 9. Export
export default TaskList;
```

### Hooks Rules
- **Top Level Only**: Call hooks at the top level, not in conditions or loops
- **Custom Hooks**: Name custom hooks with `use` prefix (e.g., `useTasks`)
- **Dependencies**: Always specify correct dependency arrays for useEffect

### Props
- **Destructure**: Destructure props in function parameter
- **PropTypes**: Always define PropTypes or use TypeScript
- **Default Props**: Provide sensible defaults

```javascript
// ✅ Good prop handling
function TaskItem({ task, onComplete, showDetails = true }) {
  return (
    <div>
      <h3>{task.title}</h3>
      {showDetails && <p>{task.description}</p>}
      <button onClick={() => onComplete(task.id)}>Complete</button>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  showDetails: PropTypes.bool,
};
```

## Linting and Code Quality Tools

### ESLint
**Required**: Use ESLint to enforce code quality and consistency.

#### Installation
```bash
npm install --save-dev eslint eslint-config-react-app
```

#### Configuration
Create `.eslintrc.json` in project root:

```json
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "arrow-body-style": ["error", "as-needed"],
    "no-duplicate-imports": "error"
  }
}
```

#### Usage
```bash
# Check for linting errors
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

#### Pre-commit Hook
Use husky and lint-staged to run linter before commits:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"]
  }
}
```

### Prettier
**Recommended**: Use Prettier for automatic code formatting.

#### Configuration
Create `.prettierrc` in project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

#### Integration with ESLint
```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

Update `.eslintrc.json`:
```json
{
  "extends": ["react-app", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

### Editor Configuration
Use EditorConfig to ensure consistent formatting across editors.

Create `.editorconfig` in project root:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## Version Control Practices

### Commit Messages
Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(tasks): add due date filtering
fix(api): resolve task deletion bug
docs(readme): update installation instructions
refactor(components): extract TaskForm component
test(tasks): add unit tests for task validation
```

### Branch Naming
- **Feature**: `feature/add-task-filtering`
- **Bug Fix**: `fix/task-deletion-error`
- **Documentation**: `docs/update-readme`

### Code Review
- Keep pull requests focused and small
- Write clear PR descriptions
- Run tests before submitting PR
- Address review comments promptly

## Performance Considerations

### General Performance
- **Avoid Premature Optimization**: Optimize when you identify actual bottlenecks
- **Measure First**: Use profiling tools before optimizing
- **Cache When Appropriate**: Cache expensive computations, but don't over-cache

### React Performance
- **Memoization**: Use `React.memo()`, `useMemo()`, `useCallback()` judiciously
- **Key Props**: Always use stable, unique keys in lists
- **Lazy Loading**: Use `React.lazy()` for code splitting
- **Avoid Inline Functions**: In props when it causes re-renders

```javascript
// ✅ Memoized callback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ Memoized computation
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## Security Best Practices

### Input Validation
- **Always Validate**: Validate all user input on both frontend and backend
- **Sanitize**: Remove or escape dangerous characters
- **Use Libraries**: Leverage validation libraries (Joi, Yup, etc.)

### API Security
- **HTTPS**: Use HTTPS in production
- **CORS**: Configure CORS properly
- **Rate Limiting**: Implement rate limiting for APIs
- **Input Sanitization**: Sanitize inputs to prevent injection attacks

### Dependencies
- **Audit Regularly**: Run `npm audit` regularly
- **Update Dependencies**: Keep dependencies up to date
- **Minimize Dependencies**: Only use necessary packages

## Testing Best Practices

### Test Organization
- **Co-locate Tests**: Keep tests near the code they test
- **Clear Test Names**: Use descriptive test names
- **AAA Pattern**: Arrange, Act, Assert structure

### Test Coverage
- **Aim High**: Target 80%+ code coverage for unit tests
- **Focus on Logic**: Prioritize testing business logic
- **Test Edge Cases**: Include boundary conditions and error cases

### Refer to Testing Guidelines
For comprehensive testing standards, see [Testing Guidelines](./testing-guidelines.md).

## Summary Checklist

Before submitting code for review, ensure:
- [ ] Code follows formatting standards (2-space indent, 100-char lines)
- [ ] Imports are organized correctly (third-party, internal, styles)
- [ ] Variables and functions have clear, descriptive names
- [ ] Functions are small and focused (single responsibility)
- [ ] DRY principle applied (no repeated code)
- [ ] Error handling is implemented properly
- [ ] Comments explain "why", not "what"
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] Tests are written and passing
- [ ] PropTypes or TypeScript types defined
- [ ] No console.log statements left in code
- [ ] Commit message follows convention
- [ ] Code is reviewed by at least one other developer

## Continuous Improvement

These guidelines are living documents. As the project evolves and the team learns new best practices, these guidelines should be updated accordingly. Suggestions for improvements are always welcome.

### Resources
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React Best Practices](https://react.dev/learn)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
