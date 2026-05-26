import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, Box, TextField, Select, MenuItem, Button,
  Typography, Alert, Avatar, Tooltip, FormControl, InputLabel, Autocomplete,
  DialogTitle, DialogContent, DialogActions, Divider,
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon,
  RadioButtonUnchecked as TodoIcon, Schedule as InProgressIcon,
  RateReview as ReviewIcon, Warning as OverdueIcon,
} from '@mui/icons-material';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Review', 'Completed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'];

const STATUS_CONFIG = {
  'To Do': { color: 'default', icon: <TodoIcon sx={{ fontSize: 14 }} />, bg: '#f3f4f6', text: '#374151' },
  'In Progress': { color: 'warning', icon: <InProgressIcon sx={{ fontSize: 14 }} />, bg: '#fffbeb', text: '#92400e' },
  'Review': { color: 'info', icon: <ReviewIcon sx={{ fontSize: 14 }} />, bg: '#eff6ff', text: '#1e40af' },
  'Completed': { color: 'success', icon: <CheckIcon sx={{ fontSize: 14 }} />, bg: '#ecfdf5', text: '#065f46' },
};

const PRIORITY_CONFIG = {
  Urgent: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  High: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  Medium: { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b' },
  Low: { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
};

export default function TaskList({ tasks, projectId, projectMembers = [] }) {
  const { updateTask, deleteTask } = useProjectStore();
  const { user } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
    });
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    setError('');
    setSaving(true);
    try {
      const payload = { ...editForm };
      if (!payload.assignedTo) payload.assignedTo = null;
      await updateTask(selectedTask._id, payload);
      setOpenDialog(false);
      toast.success('Task updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleQuickStatus = async (task, newStatus) => {
    try {
      await updateTask(task._id, { status: newStatus });
      toast.success(`Marked as ${newStatus}! ✅`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (tasks.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          border: '2px dashed #e5e7eb',
          borderRadius: 3,
          backgroundColor: '#fafafa',
        }}
      >
        <CheckIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first task to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f3f4f6', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['To Do'];
              const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
              const isOverdue =
                task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Completed';

              return (
                <TableRow key={task._id}>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                        color: task.status === 'Completed' ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={statusCfg.icon}
                      label={task.status}
                      size="small"
                      sx={{
                        backgroundColor: statusCfg.bg,
                        color: statusCfg.text,
                        fontWeight: 600,
                        border: 'none',
                        '& .MuiChip-icon': { color: statusCfg.text },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: priorityCfg.dot,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: priorityCfg.text,
                          backgroundColor: priorityCfg.bg,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                        }}
                      >
                        {task.priority}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {task.assignedTo ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                          {task.assignedTo.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" fontWeight={500}>
                          {task.assignedTo.name}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {task.dueDate ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isOverdue && <OverdueIcon sx={{ fontSize: 14, color: 'error.main' }} />}
                        <Typography
                          variant="caption"
                          sx={{ color: isOverdue ? 'error.main' : 'text.secondary', fontWeight: isOverdue ? 600 : 400 }}
                        >
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">—</Typography>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      {task.status !== 'Completed' && (
                        <Tooltip title="Mark Complete">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleQuickStatus(task, 'Completed')}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(task)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(task._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Edit Task</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Task Title"
            value={editForm.title || ''}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={editForm.description || ''}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status || 'To Do'}
                label="Status"
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={editForm.priority || 'Medium'}
                label="Priority"
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              >
                {PRIORITY_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign To</InputLabel>
              <Select
                value={editForm.assignedTo || ''}
                label="Assign To"
                onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {projectMembers.map((m) => (
                  <MenuItem key={m.userId?._id || m.userId} value={m.userId?._id || m.userId}>
                    {m.userId?.name || 'Member'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={editForm.dueDate || ''}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
