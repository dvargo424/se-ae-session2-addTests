import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

function TaskCounter({ tasks }) {
  const activeCount = tasks.filter(task => task.completed === 0).length;
  const completedCount = tasks.filter(task => task.completed === 1).length;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {activeCount} active {activeCount === 1 ? 'task' : 'tasks'}, {completedCount} completed
      </Typography>
    </Box>
  );
}

TaskCounter.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TaskCounter;
