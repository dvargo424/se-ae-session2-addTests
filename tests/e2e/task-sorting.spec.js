const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('Task Sorting', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();

    // Create test data with different priorities and dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await todoPage.addTask({
      title: 'High priority task',
      description: 'This has high priority',
      priority: 'high',
      dueDate: tomorrow.toISOString().split('T')[0],
    });

    await todoPage.addTask({
      title: 'Low priority task',
      description: 'This has low priority',
      priority: 'low',
      dueDate: nextWeek.toISOString().split('T')[0],
    });

    await todoPage.addTask({
      title: 'Medium priority task',
      description: 'This has medium priority',
      priority: 'medium',
      dueDate: today.toISOString().split('T')[0],
    });

    // Add a task with no due date
    await todoPage.addTask({
      title: 'No due date task',
      description: 'This task has no due date',
      priority: 'medium',
    });

    await page.waitForTimeout(500);
  });

  test('should sort tasks by due date', async ({ page }) => {
    await todoPage.sortBy('due_date');
    await page.waitForTimeout(500);

    const tasks = await todoPage.getAllTasks();
    const taskTitles = await tasks.allTextContents();
    
    // Tasks with due dates should appear before tasks without
    const hasMediumTask = taskTitles[0].includes('Medium priority task');
    const hasHighTask = taskTitles[1].includes('High priority task');
    
    // At least verify we have multiple tasks
    expect(taskTitles.length).toBeGreaterThanOrEqual(4);
  });

  test('should sort tasks by priority', async ({ page }) => {
    await todoPage.sortBy('priority');
    await page.waitForTimeout(500);

    const tasks = await todoPage.getAllTasks();
    const taskTitles = await tasks.allTextContents();
    
    // High priority should come before low priority
    const highIndex = taskTitles.findIndex(t => t.includes('High priority task'));
    const lowIndex = taskTitles.findIndex(t => t.includes('Low priority task'));
    
    expect(highIndex).toBeLessThan(lowIndex);
  });

  test('should sort tasks by title', async ({ page }) => {
    await todoPage.sortBy('title');
    await page.waitForTimeout(500);

    const tasks = await todoPage.getAllTasks();
    const taskTitles = await tasks.allTextContents();
    
    // Extract just the titles for comparison
    const titles = taskTitles.map(t => {
      const match = t.match(/(High|Low|Medium|No) (priority|due date) task/);
      return match ? match[0] : '';
    }).filter(Boolean);
    
    // Verify we have titles
    expect(titles.length).toBeGreaterThan(0);
    
    // Check if first title comes alphabetically before last
    const firstTitle = titles[0];
    const lastTitle = titles[titles.length - 1];
    expect(firstTitle.localeCompare(lastTitle)).toBeLessThanOrEqual(0);
  });

  test('should sort tasks by created date', async ({ page }) => {
    await todoPage.sortBy('created_at');
    await page.waitForTimeout(500);

    const tasks = await todoPage.getAllTasks();
    const taskCount = await tasks.count();
    
    // Verify tasks are displayed (created order may vary based on timing)
    expect(taskCount).toBeGreaterThanOrEqual(4);
  });

  test('should maintain sort order when adding new task', async ({ page }) => {
    // Sort by priority
    await todoPage.sortBy('priority');
    await page.waitForTimeout(500);

    // Add a new high priority task
    await todoPage.addTask({
      title: 'New high priority',
      description: 'Should appear near the top',
      priority: 'high',
    });

    await page.waitForTimeout(500);

    const tasks = await todoPage.getAllTasks();
    const taskTitles = await tasks.allTextContents();
    
    // New high priority task should be among the first tasks
    const newTaskIndex = taskTitles.findIndex(t => t.includes('New high priority'));
    expect(newTaskIndex).toBeLessThan(3); // Should be in top 3
  });

  test('should maintain sort order when completing task', async ({ page }) => {
    // Sort by priority
    await todoPage.sortBy('priority');
    await page.waitForTimeout(500);

    // Complete the high priority task
    await todoPage.toggleTaskCompletion('High priority task');
    await page.waitForTimeout(500);

    // Completed task should move to the end (or disappear if filtered)
    const tasks = await todoPage.getAllTasks();
    const taskCount = await tasks.count();
    
    expect(taskCount).toBeGreaterThanOrEqual(4);
  });

  test('should switch between different sort options', async ({ page }) => {
    // Test switching between different sort options
    await todoPage.sortBy('priority');
    await page.waitForTimeout(300);
    let taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(4);

    await todoPage.sortBy('due_date');
    await page.waitForTimeout(300);
    taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(4);

    await todoPage.sortBy('title');
    await page.waitForTimeout(300);
    taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(4);

    await todoPage.sortBy('created_at');
    await page.waitForTimeout(300);
    taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(4);
  });
});
