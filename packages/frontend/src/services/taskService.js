import { API_BASE_URL } from '../constants';

/**
 * Get all tasks with optional filtering and sorting
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status (all/active/completed)
 * @param {string} options.priority - Filter by priority
 * @param {string} options.sort - Sort option
 * @returns {Promise<Array>} Array of tasks
 */
export const getTasks = async ({ status, priority, sort } = {}) => {
  const params = new URLSearchParams();
  
  if (status && status !== 'all') {
    params.append('status', status);
  }
  if (priority) {
    params.append('priority', priority);
  }
  if (sort) {
    params.append('sort', sort);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} Created task
 */
export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create task');
  }

  return response.json();
};

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Updated task
 */
export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update task');
  }

  return response.json();
};

/**
 * Toggle task completion status
 * @param {number} id - Task ID
 * @returns {Promise<Object>} Updated task
 */
export const toggleTaskComplete = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle task completion');
  }

  return response.json();
};

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }

  return response.json();
};
