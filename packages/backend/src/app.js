const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs for the TODO app', priority: 'high', due_date: '2026-02-15' },
  { title: 'Review pull requests', description: 'Review and merge pending PRs', priority: 'medium', due_date: '2026-02-14' },
  { title: 'Update dependencies', description: 'Check and update npm packages', priority: 'low', due_date: null },
];

const insertStmt = db.prepare(
  'INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)'
);

initialTasks.forEach(task => {
  insertStmt.run(task.title, task.description, task.priority, task.due_date);
});

console.log('In-memory database initialized with sample tasks');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes

// Get all tasks with optional filtering and sorting
app.get('/api/tasks', (req, res) => {
  try {
    const { status, priority, sort } = req.query;
    
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    // Filter by completion status
    if (status === 'active') {
      query += ' AND completed = 0';
    } else if (status === 'completed') {
      query += ' AND completed = 1';
    }

    // Filter by priority
    if (priority && ['high', 'medium', 'low'].includes(priority)) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    // Apply sorting
    if (sort === 'due_date') {
      query += ' ORDER BY due_date IS NULL, due_date ASC';
    } else if (sort === 'priority') {
      query += ' ORDER BY CASE priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 END';
    } else if (sort === 'title') {
      query += ' ORDER BY title ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Task title must be 200 characters or less' });
    }

    const validPriorities = ['high', 'medium', 'low'];
    const taskPriority = priority && validPriorities.includes(priority) ? priority : 'medium';

    const stmt = db.prepare(
      'INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(
      title.trim(),
      description || null,
      taskPriority,
      due_date || null
    );

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, completed } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validation
    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required' });
      }
      if (title.length > 200) {
        return res.status(400).json({ error: 'Task title must be 200 characters or less' });
      }
    }

    const validPriorities = ['high', 'medium', 'low'];
    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title.trim());
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const updateQuery = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...params);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Toggle task completion
app.patch('/api/tasks/:id/complete', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newCompletedStatus = existingTask.completed === 1 ? 0 : 1;
    db.prepare('UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newCompletedStatus, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };