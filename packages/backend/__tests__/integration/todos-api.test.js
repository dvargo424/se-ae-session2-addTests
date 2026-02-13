const request = require('supertest');
const { app, db } = require('../../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Clear database before each test to ensure isolation
beforeEach(() => {
  db.prepare('DELETE FROM tasks').run();
  // Reset auto-increment
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tasks'").run();
});

describe('TODO API Integration Tests', () => {
  describe('POST /api/tasks', () => {
    it('should create a task and return it with 201 status', async () => {
      const taskData = {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread',
        priority: 'high',
        due_date: '2026-02-20',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        due_date: taskData.due_date,
        completed: 0,
      });
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
    });

    it('should create a task with minimal data', async () => {
      const taskData = { title: 'Simple task' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe('Simple task');
      expect(response.body.priority).toBe('medium');
      expect(response.body.completed).toBe(0);
      expect(response.body.description).toBeNull();
      expect(response.body.due_date).toBeNull();
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body.error).toBe('Task title is required');
    });

    it('should return 400 when title exceeds max length', async () => {
      const longTitle = 'a'.repeat(201);
      
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle })
        .expect(400);

      expect(response.body.error).toBe('Task title must be 200 characters or less');
    });

    it('should set default priority when invalid priority provided', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'invalid' })
        .expect(201);

      expect(response.body.priority).toBe('medium');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      await request(app).post('/api/tasks').send({
        title: 'Task 1',
        priority: 'high',
      });
      const task2 = await request(app).post('/api/tasks').send({
        title: 'Task 2',
        priority: 'medium',
      });
      // Complete task 2
      await request(app).patch(`/api/tasks/${task2.body.id}/complete`);
      
      await request(app).post('/api/tasks').send({
        title: 'Task 3',
        priority: 'low',
      });
    });

    it('should return all tasks by default', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should filter active tasks', async () => {
      const response = await request(app)
        .get('/api/tasks?status=active')
        .expect(200);

      expect(response.body.length).toBe(2);
      response.body.forEach(task => {
        expect(task.completed).toBe(0);
      });
    });

    it('should filter completed tasks', async () => {
      const response = await request(app)
        .get('/api/tasks?status=completed')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].completed).toBe(1);
    });

    it('should filter by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].priority).toBe('high');
    });

    it('should sort by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?sort=priority')
        .expect(200);

      expect(response.body[0].priority).toBe('high');
      expect(response.body[1].priority).toBe('medium');
      expect(response.body[2].priority).toBe('low');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Task', priority: 'low' });
      taskId = response.body.id;
    });

    it('should update task title', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Task' })
        .expect(200);

      expect(response.body.title).toBe('Updated Task');
      expect(response.body.priority).toBe('low');
    });

    it('should update multiple fields', async () => {
      const updates = {
        title: 'New Title',
        description: 'New description',
        priority: 'high',
        due_date: '2026-03-01',
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updates)
        .expect(200);

      expect(response.body).toMatchObject(updates);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ priority: 'invalid' })
        .expect(400);

      expect(response.body.error).toBe('Invalid priority level');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Complete' });
      taskId = response.body.id;
    });

    it('should toggle task from incomplete to complete', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body.completed).toBe(1);
    });

    it('should toggle task from complete to incomplete', async () => {
      // First complete it
      await request(app).patch(`/api/tasks/${taskId}/complete`);

      // Then toggle back
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body.completed).toBe(0);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/99999/complete')
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Delete' });
      taskId = response.body.id;
    });

    it('should delete an existing task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Task deleted successfully',
        id: taskId,
      });

      // Verify task is deleted
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/99999')
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid')
        .expect(400);

      expect(response.body.error).toBe('Valid task ID is required');
    });
  });

  describe('Complete CRUD Workflow', () => {
    it('should create, read, update, toggle, and delete a task', async () => {
      // Create
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Workflow Test Task',
          description: 'Testing complete workflow',
          priority: 'medium',
        })
        .expect(201);

      const taskId = createResponse.body.id;
      expect(createResponse.body.title).toBe('Workflow Test Task');

      // Read (by getting all tasks)
      const getResponse = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(getResponse.body.find(t => t.id === taskId)).toBeDefined();

      // Update
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Workflow Task', priority: 'high' })
        .expect(200);

      expect(updateResponse.body.title).toBe('Updated Workflow Task');
      expect(updateResponse.body.priority).toBe('high');

      // Toggle completion
      const completeResponse = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(completeResponse.body.completed).toBe(1);

      // Delete
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      // Verify deletion
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(404);
    });
  });
});
