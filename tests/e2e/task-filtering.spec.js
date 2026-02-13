const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('Task Filtering', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();

    // Create test data: 2 active tasks and 1 completed task
    await todoPage.addTask({
      title: 'Active task 1',
      description: 'First active task',
      priority: 'high',
    });

    await todoPage.addTask({
      title: 'Active task 2',
      description: 'Second active task',
      priority: 'medium',
    });

    await todoPage.addTask({
      title: 'Completed task',
      description: 'This task is completed',
      priority: 'low',
    });

    // Complete the third task
    await todoPage.toggleTaskCompletion('Completed task');
  });

  test('should show all tasks by default', async () => {
    const taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(3);
    
    await todoPage.verifyTaskExists('Active task 1');
    await todoPage.verifyTaskExists('Active task 2');
    await todoPage.verifyTaskExists('Completed task');
  });

  test('should filter active tasks only', async ({ page }) => {
    await todoPage.filterActive();
    
    // Give the UI time to update
    await page.waitForTimeout(500);
    
    // Verify active tasks are visible
    const isActive1Visible = await todoPage.isTaskVisible('Active task 1');
    const isActive2Visible = await todoPage.isTaskVisible('Active task 2');
    
    expect(isActive1Visible).toBe(true);
    expect(isActive2Visible).toBe(true);
    
    // Completed task should not be visible in active filter
    const tasks = await todoPage.getAllTasks();
    const allTaskText = await tasks.allTextContents();
    const hasCompletedTask = allTaskText.some(text => text.includes('Completed task'));
    
    // In active filter, completed task should not be present
    expect(hasCompletedTask).toBe(false);
  });

  test('should filter completed tasks only', async ({ page }) => {
    await todoPage.filterCompleted();
    
    // Give the UI time to update
    await page.waitForTimeout(500);
    
    // Verify completed task is visible
    const isCompletedVisible = await todoPage.isTaskVisible('Completed task');
    expect(isCompletedVisible).toBe(true);
    
    // Active tasks should not be visible in completed filter
    const tasks = await todoPage.getAllTasks();
    const allTaskText = await tasks.allTextContents();
    const hasActiveTask1 = allTaskText.some(text => text.includes('Active task 1'));
    const hasActiveTask2 = allTaskText.some(text => text.includes('Active task 2'));
    
    expect(hasActiveTask1).toBe(false);
    expect(hasActiveTask2).toBe(false);
  });

  test('should switch between filters', async ({ page }) => {
    // Start with all
    await todoPage.filterAll();
    await page.waitForTimeout(300);
    let taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(3);

    // Switch to active
    await todoPage.filterActive();
    await page.waitForTimeout(300);
    taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(2);

    // Switch to completed
    await todoPage.filterCompleted();
    await page.waitForTimeout(300);
    taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(1);

    // Switch back to all
    await todoPage.filterAll();
    await page.waitForTimeout(300);
    taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(3);
  });

  test('should update active task counter when filtering', async ({ page }) => {
    // View all tasks
    await todoPage.filterAll();
    const initialActiveCount = await todoPage.getActiveTaskCount();
    expect(initialActiveCount).toBeGreaterThanOrEqual(2);

    // Complete one more task
    await todoPage.toggleTaskCompletion('Active task 1');
    await page.waitForTimeout(300);

    const updatedActiveCount = await todoPage.getActiveTaskCount();
    expect(updatedActiveCount).toBe(initialActiveCount - 1);
  });

  test('should persist filter when completing a task', async ({ page }) => {
    // Filter to active tasks
    await todoPage.filterActive();
    await page.waitForTimeout(300);

    // Complete one of the active tasks
    await todoPage.toggleTaskCompletion('Active task 1');
    await page.waitForTimeout(300);

    // Task should disappear from active filter
    const isVisible = await todoPage.isTaskVisible('Active task 1');
    expect(isVisible).toBe(false);

    // Other active task should still be visible
    const isActive2Visible = await todoPage.isTaskVisible('Active task 2');
    expect(isActive2Visible).toBe(true);
  });
});
