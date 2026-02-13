import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import theme from './theme';
import TaskList from './components/TaskList';
import TaskDialog from './components/TaskDialog';
import TaskFilters from './components/TaskFilters';
import TaskCounter from './components/TaskCounter';
import {
  getTasks,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from './services/taskService';
import { FILTER_OPTIONS, SORT_OPTIONS } from './constants';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks({ status: filter, sort });
      setTasks(data);
    } catch (error) {
      showSnackbar('Failed to load tasks: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        showSnackbar('Task updated successfully');
      } else {
        await createTask(taskData);
        showSnackbar('Task created successfully');
      }
      handleDialogClose();
      loadTasks();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskComplete(taskId);
      loadTasks();
    } catch (error) {
      showSnackbar('Failed to update task: ' + error.message, 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      showSnackbar('Task deleted successfully');
      loadTasks();
    } catch (error) {
      showSnackbar('Failed to delete task: ' + error.message, 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
                My Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Keep track of your tasks and stay organized
              </Typography>
            </Box>

            {/* Add Task Button */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutline />}
                onClick={handleAddTask}
                fullWidth
                data-testid="add-task-button"
              >
                Add Task
              </Button>
            </Box>

            {/* Task Counter */}
            <TaskCounter tasks={tasks} />

            {/* Filters and Sorting */}
            <TaskFilters
              filter={filter}
              sort={sort}
              onFilterChange={setFilter}
              onSortChange={setSort}
            />

            {/* Task List */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TaskList
                tasks={tasks}
                onComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}
          </Paper>
        </Container>
      </Box>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        onClose={handleDialogClose}
        onSave={handleSaveTask}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;