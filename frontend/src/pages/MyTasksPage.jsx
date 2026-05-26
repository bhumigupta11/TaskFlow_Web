import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Paper, Chip, Avatar, Tooltip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Skeleton, Button, Fade,
} from '@mui/material';
import {
  CheckCircle as CheckIcon, Schedule as ClockIcon, Warning as WarningIcon,
  Assignment as TaskIcon, FilterList as FilterIcon, ViewKanban as KanbanIcon,
  TableRows as TableIcon, RadioButtonUnchecked as TodoIcon,
  RateReview as ReviewIcon,
} from '@mui/icons-material';
import { useProjectStore } from '../store/projectStore';
import { format, isPast } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'To Do': { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
  'In Progress': { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  'Review': { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  'Completed': { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
};

const PRIORITY_CONFIG = {
  Urgent: { dot: '#ef4444', text: '#dc2626', bg: '#fef2f2' },
  High: { dot: '#f97316', text: '#c2410c', bg: '#fff7ed' },
  Medium: { dot: '#f59e0b', text: '#b45309', bg: '#fffbeb' },
  Low: { dot: '#22c55e', text: '#166534', bg: '#f0fdf4' },
};

const KANBAN_COLUMNS = [
  { status: 'To Do', color: '#6b7280', bg: '#f9fafb', icon: <TodoIcon fontSize="small" /> },
  { status: 'In Progress', color: '#f59e0b', bg: '#fffbeb', icon: <ClockIcon fontSize="small" /> },
  { status: 'Review', color: '#3b82f6', bg: '#eff6ff', icon: <ReviewIcon fontSize="small" /> },
  { status: 'Completed', color: '#10b981', bg: '#ecfdf5', icon: <CheckIcon fontSize="small" /> },
];

function KanbanCard({ task, onComplete, navigate }) {
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Completed';

  return (
    <Paper elevation={0} sx={{
      p: 2, mb: 1.5, borderRadius: 2.5,
      border: '1px solid #f3f4f6',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', borderColor: '#e5e7eb' },
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{
          flex: 1, pr: 1,
          textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
          color: task.status === 'Completed' ? 'text.secondary' : 'text.primary',
        }}>
          {task.title}
        </Typography>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: priorityCfg.dot, flexShrink: 0, mt: 0.5 }} />
      </Box>

      {task.description && (
        <Typography variant="caption" color="text.secondary" sx={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1,
        }}>
          {task.description}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Chip label={task.project?.name || 'Unknown'} size="small"
          onClick={() => task.project?._id && navigate(`/project/${task.project._id}`)}
          sx={{ fontSize: '0.65rem', height: 20, cursor: 'pointer', backgroundColor: '#f3f4f6', fontWeight: 600 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {task.dueDate && (
            <Typography variant="caption" sx={{ color: isOverdue ? 'error.main' : 'text.secondary', fontWeight: isOverdue ? 700 : 400, fontSize: '0.65rem' }}>
              {isOverdue ? '⚠️ ' : ''}{format(new Date(task.dueDate), 'MMM d')}
            </Typography>
          )}
          {task.status !== 'Completed' && (
            <Tooltip title="Mark Complete">
              <IconButton size="small" color="success" onClick={(e) => { e.stopPropagation(); onComplete(task); }} sx={{ p: 0.25 }}>
                <CheckIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default function MyTasksPage() {
  const { userTasks, getUserTasks, updateTask, loading } = useProjectStore();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  useEffect(() => { getUserTasks(); }, []);

  const handleQuickComplete = async (task) => {
    try {
      await updateTask(task._id, { status: 'Completed' });
      toast.success(`"${task.title}" marked complete! ✅`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const filtered = userTasks.filter((t) => {
    const statusMatch = statusFilter === 'All' || t.status === statusFilter;
    const priorityMatch = priorityFilter === 'All' || t.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const stats = {
    total: userTasks.length,
    completed: userTasks.filter((t) => t.status === 'Completed').length,
    inProgress: userTasks.filter((t) => t.status === 'In Progress').length,
    overdue: userTasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'Completed').length,
  };

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', pt: 5, pb: 9, px: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>My Tasks</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>All tasks assigned to you or created by you</Typography>
            </Box>
            {/* View Toggle */}
            <Box sx={{ display: 'flex', gap: 0.5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 0.5 }}>
              {[
                { mode: 'table', icon: <TableIcon fontSize="small" />, label: 'Table' },
                { mode: 'kanban', icon: <KanbanIcon fontSize="small" />, label: 'Kanban' },
              ].map((v) => (
                <Button key={v.mode} size="small" startIcon={v.icon}
                  onClick={() => setViewMode(v.mode)}
                  sx={{
                    color: viewMode === v.mode ? '#1e293b' : 'rgba(255,255,255,0.7)',
                    backgroundColor: viewMode === v.mode ? '#fff' : 'transparent',
                    borderRadius: 1.5, px: 1.5, minWidth: 90,
                    '&:hover': { backgroundColor: viewMode === v.mode ? '#fff' : 'rgba(255,255,255,0.1)' },
                  }}
                >
                  {v.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5 }}>
        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Tasks', value: stats.total, color: '#6366f1', bg: '#eff6ff', icon: <TaskIcon /> },
            { label: 'Completed', value: stats.completed, color: '#10b981', bg: '#ecfdf5', icon: <CheckIcon /> },
            { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', bg: '#fffbeb', icon: <ClockIcon /> },
            { label: 'Overdue', value: stats.overdue, color: '#ef4444', bg: '#fef2f2', icon: <WarningIcon /> },
          ].map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                  <Box sx={{ color: s.color }}>{s.icon}</Box>
                </Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #f3f4f6', mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FilterIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mr: 0.5 }}>STATUS</Typography>
              {['All', 'To Do', 'In Progress', 'Review', 'Completed'].map((s) => (
                <Chip key={s} label={s} size="small" onClick={() => setStatusFilter(s)}
                  variant={statusFilter === s ? 'filled' : 'outlined'} color={statusFilter === s ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer', fontWeight: 600 }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mr: 0.5 }}>PRIORITY</Typography>
              {['All', 'Urgent', 'High', 'Medium', 'Low'].map((p) => (
                <Chip key={p} label={p} size="small" onClick={() => setPriorityFilter(p)}
                  variant={priorityFilter === p ? 'filled' : 'outlined'} color={priorityFilter === p ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer', fontWeight: 600 }} />
              ))}
            </Box>
          </Box>
        </Paper>

        {loading && userTasks.length === 0 ? (
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
        ) : filtered.length === 0 ? (
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: '2px dashed #e5e7eb', borderRadius: 4, backgroundColor: '#fafafa' }}>
            <CheckIcon sx={{ fontSize: 56, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={700}>
              {userTasks.length === 0 ? 'No tasks assigned to you yet' : 'No tasks match your filters'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userTasks.length === 0 ? 'Tasks assigned to you will appear here' : 'Try adjusting your filters'}
            </Typography>
          </Paper>
        ) : viewMode === 'kanban' ? (
          /* ── Kanban View ── */
          <Grid container spacing={2}>
            {KANBAN_COLUMNS.map((col) => {
              const colTasks = filtered.filter((t) => t.status === col.status);
              return (
                <Grid item xs={12} sm={6} md={3} key={col.status}>
                  <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <Box sx={{ px: 2, py: 1.5, backgroundColor: col.bg, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: col.color }}>{col.icon}</Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: col.color }}>{col.status}</Typography>
                      </Box>
                      <Chip label={colTasks.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: 'rgba(0,0,0,0.06)', fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ p: 1.5, minHeight: 200, maxHeight: 500, overflowY: 'auto' }}>
                      {colTasks.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="caption" color="text.secondary">No tasks</Typography>
                        </Box>
                      ) : (
                        colTasks.map((task) => (
                          <Fade in key={task._id} timeout={300}>
                            <div>
                              <KanbanCard task={task} onComplete={handleQuickComplete} navigate={navigate} />
                            </div>
                          </Fade>
                        ))
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          /* ── Table View ── */
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f3f4f6', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((task) => {
                  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['To Do'];
                  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
                  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Completed';
                  return (
                    <TableRow key={task._id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" fontWeight={600}
                          sx={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? 'text.secondary' : 'text.primary' }}>
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="caption" color="text.secondary"
                            sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={task.project?.name || 'Unknown'} size="small"
                          onClick={() => task.project?._id && navigate(`/project/${task.project._id}`)}
                          sx={{ cursor: 'pointer', fontWeight: 600, backgroundColor: '#f3f4f6' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={task.status} size="small"
                          sx={{ backgroundColor: statusCfg.bg, color: statusCfg.text, fontWeight: 600, border: `1px solid ${statusCfg.border}` }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: priorityCfg.dot }} />
                          <Typography variant="caption" fontWeight={600}
                            sx={{ color: priorityCfg.text, backgroundColor: priorityCfg.bg, px: 1, py: 0.25, borderRadius: 1 }}>
                            {task.priority}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <Typography variant="caption"
                            sx={{ color: isOverdue ? 'error.main' : 'text.secondary', fontWeight: isOverdue ? 700 : 400 }}>
                            {isOverdue ? '⚠️ ' : ''}{format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </Typography>
                        ) : <Typography variant="caption" color="text.secondary">—</Typography>}
                      </TableCell>
                      <TableCell align="right">
                        {task.status !== 'Completed' && (
                          <Tooltip title="Mark as Complete">
                            <IconButton size="small" color="success" onClick={() => handleQuickComplete(task)}>
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
