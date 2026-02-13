const { BasePage } = require('./BasePage');

/**
 * TodoPage - Page Object for the main TODO application page
 * Implements Page Object Model pattern as per testing guidelines
 */
class TodoPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors using data-testid for stable element identification
    this.selectors = {
      // Header and main elements
      pageTitle: 'h1:has-text("My Tasks")',
      addTaskButton: '[data-testid="add-task-button"]',
      
      // Task dialog
      taskDialog: '[data-testid="task-dialog"]',
      taskTitleInput: '[data-testid="task-title-input"]',
      taskDescriptionInput: '[data-testid="task-description-input"]',
      taskPrioritySelect: '[data-testid="task-priority-select"]',
      taskDueDateInput: '[data-testid="task-due-date-input"]',
      saveTaskButton: '[data-testid="save-task-button"]',
      cancelButton: 'button:has-text("Cancel")',
      
      // Task list
      taskList: '[role="list"]',
      taskItem: '[role="listitem"]',
      taskCheckbox: '[data-testid="task-checkbox"]',
      editButton: '[data-testid="edit-button"]',
      deleteButton: '[data-testid="delete-button"]',
      
      // Filters and sorting
      filterAll: 'button:has-text("All")',
      filterActive: 'button:has-text("Active")',
      filterCompleted: 'button:has-text("Completed")',
      sortSelect: 'label:has-text("Sort By") + div select',
      
      // Task counter
      taskCounter: 'text=/\\d+ active/i',
      
      // Snackbar notifications
      snackbar: '[role="alert"]',
    };
  }

  // Navigation
  async goto() {
    await super.goto('/');
    await this.page.waitForSelector(this.selectors.pageTitle);
  }

  // Task creation
  async openAddTaskDialog() {
    await this.page.click(this.selectors.addTaskButton);
    await this.page.waitForSelector(this.selectors.taskDialog);
  }

  async fillTaskForm({ title, description, priority, dueDate }) {
    if (title) {
      await this.page.fill(this.selectors.taskTitleInput, title);
    }
    if (description) {
      await this.page.fill(this.selectors.taskDescriptionInput, description);
    }
    if (priority) {
      await this.page.click(this.selectors.taskPrioritySelect);
      await this.page.click(`li[data-value="${priority}"]`);
    }
    if (dueDate) {
      await this.page.fill(this.selectors.taskDueDateInput, dueDate);
    }
  }

  async saveTask() {
    await this.page.click(this.selectors.saveTaskButton);
    await this.page.waitForSelector(this.selectors.taskDialog, { state: 'hidden' });
  }

  async addTask({ title, description, priority, dueDate }) {
    await this.openAddTaskDialog();
    await this.fillTaskForm({ title, description, priority, dueDate });
    await this.saveTask();
  }

  // Task reading and querying
  async getTaskByTitle(title) {
    return this.page.locator(this.selectors.taskItem).filter({ hasText: title });
  }

  async getAllTasks() {
    return this.page.locator(this.selectors.taskItem);
  }

  async getTaskCount() {
    return this.page.locator(this.selectors.taskItem).count();
  }

  async isTaskVisible(title) {
    const task = await this.getTaskByTitle(title);
    return task.isVisible();
  }

  async getTaskText(title) {
    const task = await this.getTaskByTitle(title);
    return task.textContent();
  }

  // Task completion
  async toggleTaskCompletion(title) {
    const task = await this.getTaskByTitle(title);
    await task.locator(this.selectors.taskCheckbox).click();
  }

  async isTaskCompleted(title) {
    const task = await this.getTaskByTitle(title);
    const checkbox = task.locator(this.selectors.taskCheckbox);
    return checkbox.isChecked();
  }

  // Task editing
  async openEditDialog(title) {
    const task = await this.getTaskByTitle(title);
    await task.locator(this.selectors.editButton).click();
    await this.page.waitForSelector(this.selectors.taskDialog);
  }

  async editTask(currentTitle, updates) {
    await this.openEditDialog(currentTitle);
    await this.fillTaskForm(updates);
    await this.saveTask();
  }

  // Task deletion
  async deleteTask(title) {
    const task = await this.getTaskByTitle(title);
    await task.locator(this.selectors.deleteButton).click();
  }

  // Filtering
  async filterAll() {
    await this.page.click(this.selectors.filterAll);
  }

  async filterActive() {
    await this.page.click(this.selectors.filterActive);
  }

  async filterCompleted() {
    await this.page.click(this.selectors.filterCompleted);
  }

  // Sorting
  async sortBy(option) {
    await this.page.selectOption(this.selectors.sortSelect, option);
  }

  // Task counter
  async getActiveTaskCount() {
    const counterText = await this.page.textContent(this.selectors.taskCounter);
    const match = counterText.match(/(\d+) active/i);
    return match ? parseInt(match[1]) : 0;
  }

  // Snackbar notifications
  async getSnackbarMessage() {
    const snackbar = this.page.locator(this.selectors.snackbar);
    await snackbar.waitFor({ state: 'visible', timeout: 5000 });
    return snackbar.textContent();
  }

  async waitForSnackbarToDisappear() {
    const snackbar = this.page.locator(this.selectors.snackbar);
    await snackbar.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // Verification helpers
  async verifyTaskExists(title) {
    const task = await this.getTaskByTitle(title);
    await task.waitFor({ state: 'visible' });
  }

  async verifyTaskNotExists(title) {
    const task = await this.getTaskByTitle(title);
    await task.waitFor({ state: 'hidden' });
  }

  async verifyPageTitle() {
    const title = await this.page.textContent(this.selectors.pageTitle);
    return title.includes('My Tasks');
  }
}

module.exports = { TodoPage };
