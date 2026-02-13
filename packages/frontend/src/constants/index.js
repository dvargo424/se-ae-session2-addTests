// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030/api';

// Priority levels
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'low', label: 'Low', color: '#2196f3' },
];

// Filter options
export const FILTER_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Creation Date' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title (A-Z)' },
];

// Validation
export const MAX_TITLE_LENGTH = 200;
export const MIN_TITLE_LENGTH = 1;
