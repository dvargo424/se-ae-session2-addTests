import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  DeleteOutlined,
  EditOutlined,
  EventOutlined,
} from '@mui/icons-material';
import { isOverdue, isDueSoon, getPriorityColor, formatDate } from '../utils/taskUtils';

function TaskItem({ task, onComplete, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const dueSoon = isDueSoon(task);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <ListItem
      sx={{
        borderLeft: `4px solid ${priorityColor}`,
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
        opacity: task.completed ? 0.6 : 1,
      }}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={task.completed === 1}
          onChange={() => onComplete(task.id)}
          tabIndex={-1}
          data-testid="task-checkbox"
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              fontWeight: task.completed ? 400 : 500,
            }}
          >
            {task.title}
          </Typography>
        }
        secondary={
          <Box>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
            {task.due_date && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <EventOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: overdue ? 'error.main' : dueSoon ? 'warning.main' : 'text.secondary',
                  }}
                >
                  {formatDate(task.due_date)}
                  {overdue && ' (Overdue)'}
                  {dueSoon && ' (Due Soon)'}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={task.priority}
                size="small"
                sx={{
                  bgcolor: `${priorityColor}20`,
                  color: priorityColor,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              />
            </Box>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(task)}
          sx={{ mr: 1 }}
          data-testid="edit-button"
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(task.id)}
          data-testid="delete-button"
        >
          <DeleteOutlined />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.number.isRequired,
    priority: PropTypes.string.isRequired,
    due_date: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskItem;
