const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createTask = async (taskData = { title: 'Test Task' }) => {
  const response = await request(app)
    .post('/api/tasks')
    .send(taskData)
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if tasks have the expected structure
      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('created_at');
    });

    it('should filter tasks by status', async () => {
      const response = await request(app).get('/api/tasks?status=active');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(task => {
        expect(task.completed).toBe(0);
      });
    });

    it('should sort tasks by priority', async () => {
      const response = await request(app).get('/api/tasks?sort=priority');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { 
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        due_date: '2026-12-31'
      };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.completed).toBe(0);
      expect(response.body).toHaveProperty('created_at');
    });

    it('should create task with default priority', async () => {
      const newTask = { title: 'Task with default priority' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.priority).toBe('medium');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Task title is required');
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Task title is required');
    });

    it('should return 400 if title exceeds max length', async () => {
      const longTitle = 'a'.repeat(201);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Task title must be 200 characters or less');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await createTask({ title: 'Original Title' });

      const updates = {
        title: 'Updated Title',
        description: 'Updated description',
        priority: 'low'
      };

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send(updates)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.description).toBe(updates.description);
      expect(response.body.priority).toBe(updates.priority);
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app)
        .put('/api/tasks/999999')
        .send({ title: 'Updated' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid priority', async () => {
      const task = await createTask();

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ priority: 'invalid' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid priority level');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion status', async () => {
      const task = await createTask();
      expect(task.completed).toBe(0);

      // Toggle to completed
      const response1 = await request(app)
        .patch(`/api/tasks/${task.id}/complete`);

      expect(response1.status).toBe(200);
      expect(response1.body.completed).toBe(1);

      // Toggle back to incomplete
      const response2 = await request(app)
        .patch(`/api/tasks/${task.id}/complete`);

      expect(response2.status).toBe(200);
      expect(response2.body.completed).toBe(0);
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app)
        .patch('/api/tasks/999999/complete');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask({ title: 'Task To Be Deleted' });

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Task deleted successfully', id: task.id });

      const deleteAgain = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });
});