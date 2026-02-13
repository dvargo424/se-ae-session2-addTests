const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('TODO Workflow - CRUD Operations', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should load the application and display the main page', async () => {
    const hasTitle = await todoPage.verifyPageTitle();
    expect(hasTitle).toBe(true);
  });

  test('should create a new task', async ({ page }) => {
    await todoPage.addTask({
      title: 'Complete E2E tests',
      description: 'Write comprehensive E2E tests for TODO app',
      priority: 'high',
    });

    await todoPage.verifyTaskExists('Complete E2E tests');
    const taskText = await todoPage.getTaskText('Complete E2E tests');
    expect(taskText).toContain('Complete E2E tests');
    expect(taskText).toContain('Write comprehensive E2E tests');
  });

  test('should create a task with due date', async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString().split('T')[0];

    await todoPage.addTask({
      title: 'Task with due date',
      description: 'This task has a due date',
      priority: 'medium',
      dueDate: dueDate,
    });

    await todoPage.verifyTaskExists('Task with due date');
  });

  test('should complete a task', async ({ page }) => {
    // Create a task first
    await todoPage.addTask({
      title: 'Task to complete',
      description: 'This task will be marked as complete',
      priority: 'low',
    });

    // Complete the task
    await todoPage.toggleTaskCompletion('Task to complete');
    
    // Verify task is completed
    const isCompleted = await todoPage.isTaskCompleted('Task to complete');
    expect(isCompleted).toBe(true);
  });

  test('should edit an existing task', async ({ page }) => {
    // Create a task first
    await todoPage.addTask({
      title: 'Original task title',
      description: 'Original description',
      priority: 'low',
    });

    // Edit the task
    await todoPage.editTask('Original task title', {
      title: 'Updated task title',
      description: 'Updated description',
      priority: 'high',
    });

    // Verify updated task exists
    await todoPage.verifyTaskExists('Updated task title');
    await todoPage.verifyTaskNotExists('Original task title');
  });

  test('should delete a task', async ({ page }) => {
    // Create a task first
    await todoPage.addTask({
      title: 'Task to delete',
      description: 'This task will be deleted',
      priority: 'medium',
    });

    await todoPage.verifyTaskExists('Task to delete');

    // Delete the task
    await todoPage.deleteTask('Task to delete');

    // Verify task is deleted
    await todoPage.verifyTaskNotExists('Task to delete');
  });

  test('should handle complete CRUD workflow', async ({ page }) => {
    // Create
    await todoPage.addTask({
      title: 'Workflow test task',
      description: 'Testing complete workflow',
      priority: 'medium',
    });
    await todoPage.verifyTaskExists('Workflow test task');

    // Read
    const taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThan(0);

    // Update (complete)
    await todoPage.toggleTaskCompletion('Workflow test task');
    const isCompleted = await todoPage.isTaskCompleted('Workflow test task');
    expect(isCompleted).toBe(true);

    // Update (uncomplete)
    await todoPage.toggleTaskCompletion('Workflow test task');
    const isNotCompleted = await todoPage.isTaskCompleted('Workflow test task');
    expect(isNotCompleted).toBe(false);

    // Delete
    await todoPage.deleteTask('Workflow test task');
    await todoPage.verifyTaskNotExists('Workflow test task');
  });

  test('should validate task title is required', async ({ page }) => {
    await todoPage.openAddTaskDialog();
    
    // Try to save without entering title
    await todoPage.fillTaskForm({
      description: 'Task with no title',
      priority: 'low',
    });
    
    // Save button should be disabled or validation error shown
    const saveButton = page.locator('[data-testid="save-task-button"]');
    const isDisabled = await saveButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should display active task counter', async ({ page }) => {
    // Create two active tasks
    await todoPage.addTask({
      title: 'Active task 1',
      description: 'First active task',
      priority: 'low',
    });

    await todoPage.addTask({
      title: 'Active task 2',
      description: 'Second active task',
      priority: 'low',
    });

    const activeCount = await todoPage.getActiveTaskCount();
    expect(activeCount).toBeGreaterThanOrEqual(2);
  });
});
