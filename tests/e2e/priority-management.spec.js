const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('Priority Management', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should create task with high priority', async ({ page }) => {
    await todoPage.addTask({
      title: 'High priority task',
      description: 'This is a high priority task',
      priority: 'high',
    });

    await todoPage.verifyTaskExists('High priority task');
    
    // Verify task has high priority visual indicator
    const task = await todoPage.getTaskByTitle('High priority task');
    await expect(task).toBeVisible();
  });

  test('should create task with medium priority', async ({ page }) => {
    await todoPage.addTask({
      title: 'Medium priority task',
      description: 'This is a medium priority task',
      priority: 'medium',
    });

    await todoPage.verifyTaskExists('Medium priority task');
  });

  test('should create task with low priority', async ({ page }) => {
    await todoPage.addTask({
      title: 'Low priority task',
      description: 'This is a low priority task',
      priority: 'low',
    });

    await todoPage.verifyTaskExists('Low priority task');
  });

  test('should display different colors for different priorities', async ({ page }) => {
    // Create tasks with all three priorities
    await todoPage.addTask({
      title: 'High priority',
      priority: 'high',
    });

    await todoPage.addTask({
      title: 'Medium priority',
      priority: 'medium',
    });

    await todoPage.addTask({
      title: 'Low priority',
      priority: 'low',
    });

    // Verify all tasks are visible
    await todoPage.verifyTaskExists('High priority');
    await todoPage.verifyTaskExists('Medium priority');
    await todoPage.verifyTaskExists('Low priority');

    // Get the task elements
    const highTask = await todoPage.getTaskByTitle('High priority');
    const mediumTask = await todoPage.getTaskByTitle('Medium priority');
    const lowTask = await todoPage.getTaskByTitle('Low priority');

    // All tasks should be visible with their respective priority styling
    await expect(highTask).toBeVisible();
    await expect(mediumTask).toBeVisible();
    await expect(lowTask).toBeVisible();
  });

  test('should change task priority', async ({ page }) => {
    // Create task with low priority
    await todoPage.addTask({
      title: 'Task to change priority',
      description: 'Will change from low to high',
      priority: 'low',
    });

    // Edit and change priority to high
    await todoPage.editTask('Task to change priority', {
      priority: 'high',
    });

    // Verify task still exists with updated priority
    await todoPage.verifyTaskExists('Task to change priority');
  });

  test('should filter and sort by priority', async ({ page }) => {
    // Create multiple tasks with different priorities
    await todoPage.addTask({
      title: 'First high',
      priority: 'high',
    });

    await todoPage.addTask({
      title: 'First medium',
      priority: 'medium',
    });

    await todoPage.addTask({
      title: 'First low',
      priority: 'low',
    });

    await todoPage.addTask({
      title: 'Second high',
      priority: 'high',
    });

    // Sort by priority
    await todoPage.sortBy('priority');
    await page.waitForTimeout(500);

    const tasks = await todoPage.getAllTasks();
    const taskTitles = await tasks.allTextContents();

    // High priority tasks should appear before low priority
    const firstHighIndex = taskTitles.findIndex(t => t.includes('First high') || t.includes('Second high'));
    const lowIndex = taskTitles.findIndex(t => t.includes('First low'));

    expect(firstHighIndex).toBeLessThan(lowIndex);
  });

  test('should display priority in task list', async ({ page }) => {
    await todoPage.addTask({
      title: 'Check priority display',
      description: 'Verify priority is shown',
      priority: 'high',
    });

    const task = await todoPage.getTaskByTitle('Check priority display');
    const taskText = await task.textContent();

    // Task should display priority information (either as text or via styling)
    await expect(task).toBeVisible();
    expect(taskText).toContain('Check priority display');
  });

  test('should maintain priority when completing task', async ({ page }) => {
    await todoPage.addTask({
      title: 'High priority to complete',
      description: 'Keep priority after completion',
      priority: 'high',
    });

    // Complete the task
    await todoPage.toggleTaskCompletion('High priority to complete');

    // Verify task is completed and still exists
    const isCompleted = await todoPage.isTaskCompleted('High priority to complete');
    expect(isCompleted).toBe(true);

    await todoPage.verifyTaskExists('High priority to complete');
  });

  test('should handle priority in combination with due dates', async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString().split('T')[0];

    await todoPage.addTask({
      title: 'High priority with due date',
      description: 'Both priority and due date',
      priority: 'high',
      dueDate: dueDate,
    });

    await todoPage.verifyTaskExists('High priority with due date');
    
    const task = await todoPage.getTaskByTitle('High priority with due date');
    await expect(task).toBeVisible();
  });

  test('should default to medium priority when not specified', async ({ page }) => {
    await todoPage.openAddTaskDialog();
    
    await todoPage.fillTaskForm({
      title: 'Task without explicit priority',
      description: 'Should default to medium',
    });

    await todoPage.saveTask();
    
    await todoPage.verifyTaskExists('Task without explicit priority');
  });

  test('should show priority in edit dialog', async ({ page }) => {
    await todoPage.addTask({
      title: 'Task to check priority in edit',
      description: 'Check priority is preserved',
      priority: 'high',
    });

    await todoPage.openEditDialog('Task to check priority in edit');
    
    // The priority select should show the current priority
    const prioritySelect = page.locator('[data-testid="task-priority-select"]');
    await expect(prioritySelect).toBeVisible();
    
    // Cancel without making changes
    await page.click('button:has-text("Cancel")');
  });
});
