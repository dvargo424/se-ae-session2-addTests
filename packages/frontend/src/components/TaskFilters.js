import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../constants';

function TaskFilters({ filter, sort, onFilterChange, onSortChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <Box>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(event, newFilter) => {
            if (newFilter !== null) {
              onFilterChange(newFilter);
            }
          }}
          aria-label="task filter"
          size="small"
        >
          <ToggleButton value={FILTER_OPTIONS.ALL} aria-label="all tasks">
            All
          </ToggleButton>
          <ToggleButton value={FILTER_OPTIONS.ACTIVE} aria-label="active tasks">
            Active
          </ToggleButton>
          <ToggleButton value={FILTER_OPTIONS.COMPLETED} aria-label="completed tasks">
            Completed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sort}
          label="Sort By"
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

TaskFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default TaskFilters;
