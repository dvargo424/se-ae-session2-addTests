# UI Guidelines - TODO Application

## Overview
This document defines the user interface guidelines and design standards for the TODO application. These guidelines ensure consistency, usability, and accessibility across the application.

## Design Philosophy

### Core Principles
- **Simplicity**: Clean, uncluttered interface focused on task management
- **Efficiency**: Minimize clicks and steps to complete common actions
- **Accessibility**: Ensure all users can effectively use the application
- **Consistency**: Maintain uniform patterns across all components
- **Responsive**: Seamless experience across all device sizes

## Component Library

### Required Framework
- **Material Design**: Use Material-UI (MUI) components for React implementation
- **Version**: Material-UI v5 or later
- **Rationale**: Provides consistent, well-tested components with built-in accessibility

### Component Usage Standards

#### Buttons
- **Primary Actions**: Use `<Button variant="contained" color="primary">` for main actions (e.g., "Add Task")
- **Secondary Actions**: Use `<Button variant="outlined" color="primary">` for secondary actions (e.g., "Cancel")
- **Destructive Actions**: Use `<Button variant="contained" color="error">` for delete operations
- **Icon Buttons**: Use `<IconButton>` for compact actions (e.g., edit, delete icons)
- **Size**: Default size for desktop, small size for mobile or dense layouts

#### Input Fields
- **Text Input**: Use `<TextField variant="outlined">` for all text inputs
- **Labels**: Always include clear, descriptive labels
- **Placeholders**: Use helpful placeholder text (e.g., "What needs to be done?")
- **Validation**: Display error messages using MUI's `error` and `helperText` props
- **Required Fields**: Mark with asterisk (*) and `required` prop

#### Date Pickers
- **Component**: Use `<DatePicker>` from @mui/x-date-pickers
- **Format**: Display dates in locale-specific format
- **Validation**: Prevent invalid date selections
- **Clear Option**: Allow users to clear/remove due dates

#### Checkboxes
- **Task Completion**: Use `<Checkbox>` for marking tasks complete
- **Size**: Large enough for easy tapping on mobile (minimum 44x44px touch target)
- **State**: Clear visual distinction between checked and unchecked states

#### Lists
- **Task List**: Use `<List>` and `<ListItem>` components
- **Dividers**: Include `<Divider>` between tasks for visual separation
- **Hover State**: Subtle background color change on hover to indicate interactivity

#### Dialogs/Modals
- **Edit/Add Tasks**: Use `<Dialog>` for task creation and detailed editing
- **Confirmations**: Use `<Dialog>` with clear messaging for destructive actions
- **Mobile**: Dialogs should be full-screen on small devices

#### Menus
- **Dropdown Actions**: Use `<Menu>` for contextual actions (e.g., sort options, filters)
- **Icons**: Include icons alongside text for clarity

#### Chips
- **Priority Tags**: Use `<Chip>` components to display priority levels
- **Colors**: Color-coded priority indicators (see color palette below)

## Color Palette

### Primary Colors
- **Primary**: `#1976d2` (Material Blue 700) - Main brand color
- **Primary Light**: `#42a5f5` (Material Blue 400) - Hover states
- **Primary Dark**: `#1565c0` (Material Blue 800) - Active states

### Secondary Colors
- **Secondary**: `#9c27b0` (Material Purple 500) - Accent color
- **Secondary Light**: `#ba68c8` (Material Purple 300)
- **Secondary Dark**: `#7b1fa2` (Material Purple 700)

### Semantic Colors
- **Success/Complete**: `#4caf50` (Material Green 500) - Completed tasks
- **Warning/Due Soon**: `#ff9800` (Material Orange 500) - Tasks due within 24 hours
- **Error/Overdue**: `#f44336` (Material Red 500) - Overdue tasks, delete actions
- **Info**: `#2196f3` (Material Blue 500) - Informational messages

### Priority Colors
- **High Priority**: `#f44336` (Material Red 500) - Urgent tasks
- **Medium Priority**: `#ff9800` (Material Orange 500) - Normal priority
- **Low Priority**: `#2196f3` (Material Blue 500) - Can wait

### Neutral Colors
- **Background**: `#fafafa` (Material Grey 50) - Page background
- **Surface**: `#ffffff` - Card/component background
- **Border**: `#e0e0e0` (Material Grey 300) - Dividers and borders
- **Text Primary**: `rgba(0, 0, 0, 0.87)` - Main text
- **Text Secondary**: `rgba(0, 0, 0, 0.6)` - Supporting text
- **Text Disabled**: `rgba(0, 0, 0, 0.38)` - Disabled elements

### Dark Mode (Optional Enhancement)
- Support system preference detection
- Use MUI's dark theme palette when dark mode is active
- Ensure sufficient contrast in both light and dark modes

## Typography

### Font Family
- **Primary**: Roboto (Material Design standard)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif
- **Loading**: Use font-display: swap for performance

### Type Scale
- **H1**: 2.5rem (40px) - Not used in TODO app
- **H2**: 2rem (32px) - Page title ("My Tasks")
- **H3**: 1.5rem (24px) - Section headers
- **H4**: 1.25rem (20px) - Dialog titles
- **Body1**: 1rem (16px) - Task titles, primary content
- **Body2**: 0.875rem (14px) - Task descriptions, secondary content
- **Caption**: 0.75rem (12px) - Timestamps, metadata

### Font Weights
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Buttons, emphasis
- **Bold (700)**: Headers, important information

## Layout and Spacing

### Grid System
- Use Material-UI's Grid system for responsive layouts
- 12-column grid with 8px spacing unit

### Spacing Scale
- **xs**: 4px - Minimal spacing
- **sm**: 8px - Between related elements
- **md**: 16px - Standard component spacing
- **lg**: 24px - Section spacing
- **xl**: 32px - Major section spacing

### Container
- **Max Width**: 1200px for desktop
- **Padding**: 16px on mobile, 24px on tablet, 32px on desktop
- **Centering**: Content should be centered on large screens

### Task List Item Layout
```
[Checkbox] [Priority Indicator] [Task Title]          [Due Date] [Actions]
           [Task Description (if present)]
```

## Responsive Breakpoints

Follow Material-UI breakpoints:
- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 959px (Tablet)
- **md**: 960px - 1279px (Desktop)
- **lg**: 1280px - 1919px (Large Desktop)
- **xl**: 1920px+ (Extra Large)

### Mobile Optimizations
- Full-width dialogs on mobile
- Larger touch targets (minimum 44x44px)
- Simplified navigation
- Stackable form fields
- Bottom sheet for actions when appropriate

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

#### Color and Contrast
- **Text Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **UI Component Contrast**: Minimum 3:1 for interactive elements
- **Color Independence**: Never rely solely on color to convey information

#### Keyboard Navigation
- **Tab Order**: Logical, sequential tab order through all interactive elements
- **Focus Indicators**: Clear, visible focus states (2px outline, primary color)
- **Keyboard Shortcuts**: 
  - `Enter` to submit forms
  - `Escape` to close dialogs
  - `Space` to toggle checkboxes
  - Arrow keys for navigation in lists

#### Screen Reader Support
- **ARIA Labels**: Use `aria-label` for icon-only buttons
- **ARIA Live Regions**: Announce dynamic content updates (e.g., "Task added")
- **Semantic HTML**: Use proper heading hierarchy and landmarks
- **Alt Text**: Provide for any decorative or informational images
- **Form Labels**: Associate all inputs with visible labels using `htmlFor`

#### Focus Management
- Focus should move logically after actions (e.g., to new task after creation)
- Return focus to trigger element when closing dialogs
- Skip links for keyboard users to bypass repetitive navigation

#### Motion and Animation
- **Respect Preferences**: Honor `prefers-reduced-motion` system setting
- **Transitions**: Keep transitions subtle and quick (200-300ms)
- **No Auto-Play**: Avoid automatic animations that cannot be paused

## Icons

### Icon Library
- **Material Icons**: Use @mui/icons-material package
- **Style**: Use outlined variant for consistency
- **Size**: 24px default, 20px for compact UI

### Common Icons
- **Add Task**: `AddCircleOutline` or `Add`
- **Delete Task**: `DeleteOutline`
- **Edit Task**: `EditOutlined`
- **Complete Task**: `CheckCircleOutline` (unchecked), `CheckCircle` (checked)
- **Calendar/Due Date**: `EventOutlined`
- **Priority High**: `PriorityHigh`
- **Filter**: `FilterListOutlined`
- **Sort**: `SortOutlined`
- **Search**: `SearchOutlined`
- **Menu**: `MoreVertOutlined`

### Icon Usage Guidelines
- Always pair icons with text labels unless space is severely constrained
- Use tooltips for icon-only buttons
- Ensure icons have appropriate aria-labels for screen readers

## Animation and Transitions

### Performance
- Use CSS transforms and opacity for animations (GPU accelerated)
- Avoid animating width, height, or position properties
- Keep frame rates at 60fps

### Transition Durations
- **Fast**: 150ms - State changes (hover, focus)
- **Standard**: 250ms - Component transitions (dialogs, menus)
- **Slow**: 300ms - Page transitions

### Easing Functions
- **Standard**: cubic-bezier(0.4, 0.0, 0.2, 1) - Most transitions
- **Enter**: cubic-bezier(0.0, 0.0, 0.2, 1) - Elements entering
- **Exit**: cubic-bezier(0.4, 0.0, 1, 1) - Elements exiting

### Examples
- Task checkbox completion: Fade in checkmark (150ms)
- Task deletion: Fade out and collapse (250ms)
- Dialog open/close: Fade + scale (250ms)
- List item hover: Background color transition (150ms)

## Error and Empty States

### Error Messages
- **Color**: Use error color (#f44336)
- **Icon**: Include error icon for visibility
- **Message**: Clear, actionable error messages
- **Position**: Display inline near the relevant field

### Empty States
- **No Tasks**: Display helpful message and call-to-action
  - Example: "No tasks yet. Click 'Add Task' to get started!"
- **No Search Results**: Suggest clearing filters or adjusting search
- **Icon**: Include relevant illustration or icon
- **Tone**: Encouraging and helpful

### Loading States
- **Skeleton Screens**: Use for initial page load
- **Circular Progress**: Use for actions in progress
- **Position**: Center for page load, inline for local actions
- **Minimum Display Time**: 300ms to avoid flashing

## Feedback and Notifications

### Snackbar/Toast Notifications
- **Component**: Use MUI `<Snackbar>` with `<Alert>`
- **Position**: Bottom-left on desktop, bottom-center on mobile
- **Duration**: 4000ms (4 seconds) for info, 6000ms for errors
- **Actions**: Include action button if applicable (e.g., "Undo delete")

### Notification Types
- **Success**: Green alert, checkmark icon - "Task completed!"
- **Error**: Red alert, error icon - "Unable to save task"
- **Warning**: Orange alert, warning icon - "Task is overdue"
- **Info**: Blue alert, info icon - "Changes saved automatically"

## Performance Guidelines

### Loading Optimization
- Lazy load non-critical components
- Use React.memo() for expensive components
- Debounce search input (300ms)

### Image Optimization
- Use SVG icons when possible
- Compress any raster images
- Implement lazy loading for images

### Code Splitting
- Split routes if application grows beyond single page
- Dynamically import heavy components (e.g., date picker)

## Implementation Checklist

- [ ] Install Material-UI and required dependencies
- [ ] Configure theme with specified color palette
- [ ] Set up Roboto font loading
- [ ] Implement responsive breakpoints
- [ ] Add keyboard navigation support
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Verify color contrast ratios
- [ ] Test on mobile devices (iOS and Android)
- [ ] Implement prefers-reduced-motion support
- [ ] Add proper ARIA labels and roles
- [ ] Test keyboard-only navigation
- [ ] Verify focus management
- [ ] Add loading and error states
- [ ] Implement toast notifications
- [ ] Test across browsers (Chrome, Firefox, Safari, Edge)
