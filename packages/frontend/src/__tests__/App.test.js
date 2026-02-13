import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock tasks data
const mockTasks = [
  { 
    id: 1, 
    title: 'Test Task 1', 
    description: 'Description 1',
    completed: 0,
    priority: 'high',
    due_date: '2026-12-31',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  { 
    id: 2, 
    title: 'Test Task 2', 
    description: 'Description 2',
    completed: 1,
    priority: 'medium',
    due_date: null,
    created_at: '2026-01-02T00:00:00.000Z',
    updated_at: '2026-01-02T00:00:00.000Z'
  },
];

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/tasks handler
  rest.get('/api/tasks', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    let filteredTasks = mockTasks;
    
    if (status === 'active') {
      filteredTasks = mockTasks.filter(t => t.completed === 0);
    } else if (status === 'completed') {
      filteredTasks = mockTasks.filter(t => t.completed === 1);
    }
    
    return res(ctx.status(200), ctx.json(filteredTasks));
  }),
  
  // POST /api/tasks handler
  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Task title is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        description: req.body.description || null,
        completed: 0,
        priority: req.body.priority || 'medium',
        due_date: req.body.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  }),

  // PATCH /api/tasks/:id/complete handler
  rest.patch('/api/tasks/:id/complete', (req, res, ctx) => {
    const id = parseInt(req.params.id);
    const task = mockTasks.find(t => t.id === id);
    
    if (!task) {
      return res(ctx.status(404), ctx.json({ error: 'Task not found' }));
    }
    
    return res(
      ctx.status(200),
      ctx.json({ ...task, completed: task.completed === 1 ? 0 : 1 })
    );
  }),

  // DELETE /api/tasks/:id handler
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id);
    const task = mockTasks.find(t => t.id === id);
    
    if (!task) {
      return res(ctx.status(404), ctx.json({ error: 'Task not found' }));
    }
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Task deleted successfully', id })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText(/Keep track of your tasks/i)).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('displays task counter', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for tasks to load and check counter
    await waitFor(() => {
      expect(screen.getByText(/1 active task/i)).toBeInTheDocument();
    });
  });

  test('shows add task button', async () => {
    await act(async () => {
      render(<App />);
    });
    
    const addButton = screen.getByTestId('add-task-button');
    expect(addButton).toBeInTheDocument();
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message in snackbar
    await waitFor(() => {
      expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });
});