import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Dialog, TextField, Select, MenuItem,
  Alert, Tabs, Tab, Grid, Paper, Chip, Avatar, Tooltip, IconButton,
  FormControl, InputLabel, Divider, DialogTitle, DialogContent, DialogActions,
  Skeleton, LinearProgress, AvatarGroup, Badge,
} from '@mui/material';
import {
  ArrowBack as BackIcon, Add as AddIcon, Edit as EditIcon,
  PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckIcon, Schedule as ClockIcon, Warning as WarningIcon,
  Assignment as TaskIcon, Group as GroupIcon, AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import TaskList from '../components/TaskList';
import { format, isPast } from 'date-fns';
import { alpha } from '@mui/material/styles';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

const STATUS_COLOR = {
  Active: { bg: '#ecfdf5', text: '#065f46', chip: 'success' },
  'On Hold': { bg: '#fffbeb', text: '#92400e', chip: 'warning' },
  Completed: { bg: '#f3f4f6', text: '#374151', chip: 'default' },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProject, tasks, getProject, getProjectTasks, updateProject, createTask, addMember, removeMember } = useProjectStore();
  const { user, allUsers, getAllUsers } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [openTask, setOpenTask] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
  const [editForm, setEditForm] = useState({});
  const [memberForm, setMemberForm] = useState({ userId: '', role: 'Member' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProject(id);
    getProjectTasks(id);
    getAllUsers();
  }, [id]);

  useEffect(() => {
    if (selectedProject) {
      setEditForm({
        name: selectedProject.name,
        description: selectedProject.description || '',
        status: selectedProject.status,
        priority: selectedProject.priority,
        dueDate: selectedProject.dueDate ? selectedProject.dueDate.split('T')[0] : '',
      });
    }
  }, [selectedProject]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createTask({
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        assignedTo: taskForm.assignedTo || undefined,
        projectId: id,
      });
      setTaskForm({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
      setOpenTask(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateProject(id, editForm);
      setOpenEdit(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await addMember(id, memberForm);
      setMemberForm({ userId: '', role: 'Member' });
      setOpenAddMember(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Remove this member from the project?')) {
      try {
        await removeMember(id, userId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isOwner = selectedProject?.owner?._id === user?.id || selectedProject?.owner === user?.id;
  const isAdmin = user?.role === 'Admin';
  const canManage = isOwner || isAdmin;

  // Users not already in project
  const memberIds = selectedProject?.members?.map((m) => m.userId?._id || m.userId) || [];
  const availableUsers = allUsers.filter((u) => !memberIds.includes(u._id) && u._id !== selectedProject?.owner?._id);

  // Task stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    overdue: tasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'Completed').length,
  };
  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  if (!selectedProject) {
    return (
      <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', p: 4 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 3 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Container>
      </Box>
    );
  }

  const statusCfg = STATUS_COLOR[selectedProject.status] || STATUS_COLOR.Active;
  const isOverdue = selectedProject.dueDate && isPast(new Date(selectedProject.dueDate)) && selectedProject.status !== 'Completed';

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', pb: 6 }}>
      {/* Project Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          pt: 4, pb: 6, px: 3,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>
                  {selectedProject.name}
                </Typography>
                <Chip
                  label={selectedProject.status}
                  size="small"
                  sx={{ backgroundColor: statusCfg.bg, color: statusCfg.text, fontWeight: 700 }}
                />
                <Chip
                  label={selectedProject.priority}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }}
                />
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                {selectedProject.description || 'No description'}
              </Typography>
              {selectedProject.dueDate && (
                <Typography variant="caption" sx={{ color: isOverdue ? '#fca5a5' : 'rgba(255,255,255,0.6)' }}>
                  {isOverdue ? '⚠️ Overdue · ' : '📅 Due '}
                  {format(new Date(selectedProject.dueDate), 'MMMM d, yyyy')}
                </Typography>
              )}
            </Box>
            {canManage && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenEdit(true)}
                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                Edit Project
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -3 }}>
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Tasks', value: taskStats.total, color: '#6366f1', icon: <TaskIcon /> },
            { label: 'Completed', value: taskStats.completed, color: '#10b981', icon: <CheckIcon /> },
            { label: 'In Progress', value: taskStats.inProgress, color: '#f59e0b', icon: <ClockIcon /> },
            { label: 'Overdue', value: taskStats.overdue, color: '#ef4444', icon: <WarningIcon /> },
            { label: 'Members', value: selectedProject.members.length, color: '#8b5cf6', icon: <GroupIcon /> },
          ].map((s) => (
            <Grid item xs={6} sm={4} md key={s.label}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Progress Bar */}
        {taskStats.total > 0 && (
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #f3f4f6', mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>Project Progress</Typography>
              <Typography variant="body2" fontWeight={700} color="primary">{completionRate}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{
                height: 10, borderRadius: 5, backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: 5 },
              }}
            />
          </Paper>
        )}

        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              borderBottom: '1px solid #f3f4f6',
              px: 2,
              '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
            }}
          >
            <Tab label={`Tasks (${taskStats.total})`} />
            <Tab label={`Members (${selectedProject.members.length})`} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Tasks Tab */}
            <TabPanel value={tab} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Project Tasks</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenTask(true)} sx={{ borderRadius: 2 }}>
                  New Task
                </Button>
              </Box>
              <TaskList tasks={tasks} projectId={id} projectMembers={selectedProject.members} />
            </TabPanel>

            {/* Members Tab */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Team Members</Typography>
                {canManage && (
                  <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpenAddMember(true)} sx={{ borderRadius: 2 }}>
                    Add Member
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* Owner */}
                <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5, borderRadius: 3,
                      border: '2px solid #6366f1',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#6366f1', width: 44, height: 44, fontWeight: 700 }}>
                        {selectedProject.owner?.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{selectedProject.owner?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{selectedProject.owner?.email}</Typography>
                      </Box>
                      <Chip label="Owner" size="small" color="primary" sx={{ fontWeight: 700 }} />
                    </Box>
                  </Paper>
                </Grid>

                {/* Members */}
                {selectedProject.members
                  .filter((m) => (m.userId?._id || m.userId) !== (selectedProject.owner?._id || selectedProject.owner))
                  .map((member) => (
                    <Grid item xs={12} sm={6} md={4} key={member.userId?._id || member.userId}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #f3f4f6' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: member.role === 'Admin' ? '#ef4444' : '#10b981', width: 44, height: 44, fontWeight: 700 }}>
                            {member.userId?.name?.[0]?.toUpperCase() || 'M'}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{member.userId?.name || 'Member'}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>{member.userId?.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Chip
                              label={member.role}
                              size="small"
                              color={member.role === 'Admin' ? 'error' : 'default'}
                              sx={{ fontWeight: 600 }}
                            />
                            {canManage && (
                              <Tooltip title="Remove member">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveMember(member.userId?._id || member.userId)}
                                >
                                  <PersonRemoveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      {/* Create Task Dialog */}
      <Dialog open={openTask} onClose={() => setOpenTask(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Create New Task</Typography>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleCreateTask}>
          <DialogContent sx={{ pt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth label="Task Title" value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              margin="normal" required placeholder="What needs to be done?"
            />
            <TextField
              fullWidth label="Description" value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              margin="normal" multiline rows={2} placeholder="Add more details..."
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select value={taskForm.priority} label="Priority"
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth type="date" label="Due Date" value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                margin="normal" InputLabelProps={{ shrink: true }}
              />
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign To</InputLabel>
              <Select value={taskForm.assignedTo} label="Assign To"
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                <MenuItem value="">Unassigned</MenuItem>
                {selectedProject.members.map((m) => (
                  <MenuItem key={m.userId?._id || m.userId} value={m.userId?._id || m.userId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                        {m.userId?.name?.[0]?.toUpperCase() || 'M'}
                      </Avatar>
                      {m.userId?.name || 'Member'}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenTask(false)}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Edit Project</Typography>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleUpdateProject}>
          <DialogContent sx={{ pt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth label="Project Name" value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              margin="normal" required
            />
            <TextField
              fullWidth label="Description" value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              margin="normal" multiline rows={3}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={editForm.status || 'Active'} label="Status"
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select value={editForm.priority || 'Medium'} label="Priority"
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth type="date" label="Due Date" value={editForm.dueDate || ''}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                margin="normal" InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={openAddMember} onClose={() => setOpenAddMember(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Add Team Member</Typography>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleAddMember}>
          <DialogContent sx={{ pt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select User</InputLabel>
              <Select value={memberForm.userId} label="Select User"
                onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })}>
                {availableUsers.length === 0 ? (
                  <MenuItem disabled>No users available</MenuItem>
                ) : (
                  availableUsers.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                          {u.name[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select value={memberForm.role} label="Role"
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}>
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenAddMember(false)}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving || !memberForm.userId}>
              {saving ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
