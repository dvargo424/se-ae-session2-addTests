import dayjs from 'dayjs';
import { PRIORITY_OPTIONS } from '../constants';

/**
 * Check if a task is overdue
 * @param {Object} task - The task object
 * @returns {boolean} True if task is overdue
 */
export const isOverdue = (task) => {
  if (!task.due_date || task.completed) return false;
  return dayjs(task.due_date).isBefore(dayjs(), 'day');
};

/**
 * Check if a task is due soon (within 24 hours)
 * @param {Object} task - The task object
 * @returns {boolean} True if task is due soon
 */
export const isDueSoon = (task) => {
  if (!task.due_date || task.completed) return false;
  const dueDate = dayjs(task.due_date);
  const now = dayjs();
  return dueDate.isAfter(now) && dueDate.diff(now, 'hour') <= 24;
};

/**
 * Get color for priority level
 * @param {string} priority - Priority level
 * @returns {string} Color hex code
 */
export const getPriorityColor = (priority) => {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority);
  return priorityOption ? priorityOption.color : '#2196f3';
};

/**
 * Format date for display
 * @param {string} date - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return dayjs(date).format('MMM D, YYYY');
};

/**
 * Format date for input field
 * @param {string} date - ISO date string
 * @returns {string} Formatted date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Validate task title
 * @param {string} title - Task title
 * @returns {string|null} Error message or null if valid
 */
export const validateTaskTitle = (title) => {
  if (!title || title.trim() === '') {
    return 'Task title is required';
  }
  if (title.length > 200) {
    return 'Task title must be 200 characters or less';
  }
  return null;
};
