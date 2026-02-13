import React from 'react';
import PropTypes from 'prop-types';
import { List, Box, Typography } from '@mui/material';
import TaskItem from './TaskItem';

function TaskList({ tasks, onComplete, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No tasks found. Click "Add Task" to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskList;
