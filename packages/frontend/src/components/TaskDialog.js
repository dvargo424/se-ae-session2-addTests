import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { PRIORITY_OPTIONS, MAX_TITLE_LENGTH } from '../constants';
import { validateTaskTitle, formatDateForInput } from '../utils/taskUtils';

function TaskDialog({ open, task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? formatDateForInput(task.due_date) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
      });
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSubmit = () => {
    const titleError = validateTaskTitle(formData.title);
    if (titleError) {
      setErrors({ title: titleError });
      return;
    }

    onSave({
      ...formData,
      due_date: formData.due_date || null,
    });
  };

  const isEditing = !!task;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      data-testid="task-dialog"
    >
      <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Task Title"
            required
            fullWidth
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title || `${formData.title.length}/${MAX_TITLE_LENGTH}`}
            inputProps={{ maxLength: MAX_TITLE_LENGTH }}
            data-testid="task-title-input"
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Optional task description"
            data-testid="task-description-input"
          />

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={handleChange('priority')}
              data-testid="task-priority-select"
            >
              {PRIORITY_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            value={formData.due_date}
            onChange={handleChange('due_date')}
            InputLabelProps={{
              shrink: true,
            }}
            data-testid="task-due-date-input"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          data-testid="save-task-button"
        >
          {isEditing ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  task: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

TaskDialog.defaultProps = {
  task: null,
};

export default TaskDialog;
