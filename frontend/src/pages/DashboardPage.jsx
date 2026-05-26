import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Box, Grid, Paper, Typography, Button, Dialog, TextField,
  Alert, Chip, LinearProgress, Select, MenuItem, FormControl, InputLabel,
  DialogTitle, DialogContent, DialogActions, Divider, Skeleton, Fade,
  Avatar, AvatarGroup, Tooltip,
} from '@mui/material';
import {
  Add as AddIcon, Assignment as TaskIcon, CheckCircle as CheckIcon,
  Schedule as ClockIcon, Warning as WarningIcon, FolderOpen as ProjectIcon,
  TrendingUp as TrendingIcon, Bolt as BoltIcon, ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import ProjectCard from '../components/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { isPast, format } from 'date-fns';
import toast from 'react-hot-toast';

// Animated counter hook
function useCounter(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

function StatCard({ label, value, color, bg, icon: Icon, delay = 0 }) {
  const count = useCounter(value, 800);
  return (
    <Fade in timeout={400 + delay}>
      <Paper elevation={0} sx={{
        p: 2.5, borderRadius: 4,
        background: `linear-gradient(135deg, ${bg} 0%, rgba(255,255,255,0.95) 100%)`,
        border: `1px solid ${color}20`,
        boxShadow: `0 4px 20px ${color}12`,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: `0 12px 32px ${color}25`,
          border: `1px solid ${color}40`,
        },
      }}>
        <Box sx={{
          width: 46, height: 46, borderRadius: 3,
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5,
        }}>
          <Icon sx={{ color, fontSize: 24 }} />
        </Box>
        <Typography variant="h4" fontWeight={900} sx={{ color, lineHeight: 1, mb: 0.5, letterSpacing: '-1px' }}>{count}</Typography>
        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>{label}</Typography>
      </Paper>
    </Fade>
  );
}

const STAT_CARDS = [
  { key: 'totalTasks', label: 'Total Tasks', icon: TaskIcon, color: '#6366f1', bg: '#eff6ff' },
  { key: 'completedTasks', label: 'Completed', icon: CheckIcon, color: '#10b981', bg: '#ecfdf5' },
  { key: 'inProgressTasks', label: 'In Progress', icon: ClockIcon, color: '#f59e0b', bg: '#fffbeb' },
  { key: 'overdueTasks', label: 'Overdue', icon: WarningIcon, color: '#ef4444', bg: '#fef2f2' },
  { key: 'totalProjects', label: 'Projects', icon: ProjectIcon, color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'activeProjects', label: 'Active', icon: TrendingIcon, color: '#06b6d4', bg: '#ecfeff' },
];

export default function DashboardPage() {
  const { projects, stats, loading, createProject, updateProject, getUserProjects, getDashboardStats } = useProjectStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', priority: 'Medium', dueDate: '' });
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getUserProjects();
    getDashboardStats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createProject(form);
      setForm({ name: '', description: '', priority: 'Medium', dueDate: '' });
      setOpenCreate(false);
      toast.success('Project created successfully! 🎉');
      getDashboardStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  const handleEditOpen = (project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
    });
    setOpenEdit(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateProject(editingProject._id, editForm);
      setOpenEdit(false);
      toast.success('Project updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = filter === 'All' ? projects : projects.filter((p) => p.status === filter);
  const completionRate = stats?.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Recent overdue tasks across all projects
  const overdueProjects = projects.filter(p => p.dueDate && isPast(new Date(p.dueDate)) && p.status !== 'Completed');

  return (
    <Box sx={{ backgroundColor: '#f8f7ff', minHeight: '100vh', pb: 6 }}>
      {/* Hero Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f0a2e 0%, #1e1254 40%, #2d1b69 70%, #3b1f8c 100%)',
        pt: 5, pb: 10, px: 3, position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        {[
          { size: 500, top: -200, right: -100, color: 'rgba(99,102,241,0.15)' },
          { size: 300, bottom: -100, left: -50,  color: 'rgba(168,85,247,0.1)' },
          { size: 200, top: '30%', left: '40%',  color: 'rgba(236,72,153,0.08)' },
        ].map((o, i) => (
          <Box key={i} sx={{
            position: 'absolute', width: o.size, height: o.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            top: o.top, right: o.right, bottom: o.bottom, left: o.left,
            pointerEvents: 'none',
          }} />
        ))}
        {/* Grid pattern overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, mb: 0.5, letterSpacing: '-1px' }}>
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </Typography>
              <Typography sx={{ color: 'rgba(167,139,250,0.9)', fontSize: '1rem' }}>
                Here's what's happening with your projects today.
              </Typography>
              {stats && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    px: 2, py: 0.75, borderRadius: 3,
                    backgroundColor: 'rgba(99,102,241,0.2)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse-ring 2s infinite' }} />
                    <Typography sx={{ color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 700 }}>
                      {completionRate}% overall completion
                    </Typography>
                  </Box>
                  {stats.overdueTasks > 0 && (
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 1,
                      px: 2, py: 0.75, borderRadius: 3,
                      backgroundColor: 'rgba(239,68,68,0.2)',
                      border: '1px solid rgba(239,68,68,0.3)',
                    }}>
                      <Typography sx={{ color: '#fca5a5', fontSize: '0.8rem', fontWeight: 700 }}>
                        ⚠️ {stats.overdueTasks} overdue
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreate(true)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3, px: 3, py: 1.25,
                fontWeight: 700,
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2) !important',
                },
              }}
            >
              New Project
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5 }}>
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {STAT_CARDS.map((card, i) => (
            <Grid item xs={6} sm={4} md={2} key={card.key}>
              <StatCard label={card.label} value={stats?.[card.key] ?? 0} color={card.color} bg={card.bg} icon={card.icon} delay={i * 60} />
            </Grid>
          ))}

          {/* Progress Card */}
          <Grid item xs={12} md={12}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(168,85,247,0.04) 100%)',
              border: '1px solid rgba(99,102,241,0.12)',
              boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="body1" fontWeight={800} sx={{ letterSpacing: '-0.3px' }}>Overall Task Completion</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats?.completedTasks ?? 0} of {stats?.totalTasks ?? 0} tasks completed
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight={900} sx={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7, #10b981)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  letterSpacing: '-2px',
                }}>
                  {completionRate}%
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', mb: 1.5 }}>
                <LinearProgress variant="determinate" value={completionRate} sx={{
                  height: 14, borderRadius: 8, backgroundColor: '#ede9fe',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #10b981 100%)',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                  },
                }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[
                    { label: 'To Do', color: '#9ca3af' },
                    { label: 'In Progress', color: '#f59e0b' },
                    { label: 'Review', color: '#3b82f6' },
                    { label: 'Done', color: '#10b981' },
                  ].map((s) => (
                    <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
                {stats?.overdueTasks > 0 && (
                  <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700 }}>
                    ⚠️ {stats.overdueTasks} overdue
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Overdue alert banner */}
        {overdueProjects.length > 0 && (
          <Paper elevation={0} sx={{
            p: 2, mb: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #fef2f2, #fff7ed)',
            border: '1.5px solid #fca5a5',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <WarningIcon sx={{ color: '#ef4444' }} />
              <Typography variant="body2" fontWeight={700} color="error.main">
                {overdueProjects.length} project{overdueProjects.length > 1 ? 's are' : ' is'} past due date:
              </Typography>
              {overdueProjects.map(p => (
                <Chip key={p._id} label={p.name} size="small"
                  onClick={() => navigate(`/project/${p._id}`)}
                  sx={{ cursor: 'pointer', backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 600, border: '1px solid #fca5a5' }}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Projects Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Your Projects</Typography>
            <Typography variant="body2" color="text.secondary">
              {projects.length} project{projects.length !== 1 ? 's' : ''} · {filteredProjects.length} shown
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {['All', 'Active', 'On Hold', 'Completed'].map((f) => (
              <Chip key={f} label={f} size="small"
                onClick={() => setFilter(f)}
                variant={filter === f ? 'filled' : 'outlined'}
                color={filter === f ? 'primary' : 'default'}
                sx={{ cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s ease' }}
              />
            ))}
          </Box>
        </Box>

        {loading && projects.length === 0 ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={240} sx={{ borderRadius: 3 }} /></Grid>)}
          </Grid>
        ) : filteredProjects.length === 0 ? (
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: '2px dashed #e5e7eb', borderRadius: 4, backgroundColor: '#fafafa' }}>
            <ProjectIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={700}>
              {filter === 'All' ? 'No projects yet' : `No ${filter} projects`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filter === 'All' ? 'Create your first project to get started' : 'Try a different filter'}
            </Typography>
            {filter === 'All' && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)} sx={{ borderRadius: 2 }}>
                Create Your First Project
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((project, i) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <Fade in timeout={200 + i * 80}>
                  <div><ProjectCard project={project} onEdit={handleEditOpen} /></div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Quick Actions */}
        {projects.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2}>
              {[
                { label: 'View My Tasks', desc: 'See all tasks assigned to you', path: '/my-tasks', color: '#6366f1', bg: '#eff6ff', icon: <TaskIcon /> },
                { label: 'Profile Settings', desc: 'Update your account info', path: '/profile', color: '#10b981', bg: '#ecfdf5', icon: <CheckIcon /> },
              ].map((action) => (
                <Grid item xs={12} sm={6} key={action.label}>
                  <Paper
                    elevation={0}
                    onClick={() => navigate(action.path)}
                    sx={{
                      p: 2.5, borderRadius: 3, border: '1px solid #f3f4f6', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', borderColor: action.color },
                    }}
                  >
                    <Box sx={{ width: 44, height: 44, borderRadius: 2.5, backgroundColor: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box sx={{ color: action.color }}>{action.icon}</Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={700}>{action.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
                    </Box>
                    <ArrowIcon sx={{ color: '#d1d5db', fontSize: 18 }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Create Project Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AddIcon sx={{ color: '#6366f1', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>Create New Project</Typography>
              <Typography variant="caption" color="text.secondary">Set up a new project for your team</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleCreate}>
          <DialogContent sx={{ pt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Project Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              margin="normal" required placeholder="e.g. Website Redesign" />
            <TextField fullWidth label="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              margin="normal" multiline rows={3} placeholder="What is this project about?" />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select value={form.priority} label="Priority" onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <MenuItem value="Low">🟢 Low</MenuItem>
                  <MenuItem value="Medium">🟡 Medium</MenuItem>
                  <MenuItem value="High">🔴 High</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth type="date" label="Due Date" value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                margin="normal" InputLabelProps={{ shrink: true }} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenCreate(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving} sx={{ borderRadius: 2, px: 3 }}>
              {saving ? 'Creating...' : 'Create Project 🚀'}
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
        <form onSubmit={handleEditSave}>
          <DialogContent sx={{ pt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Project Name" value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} margin="normal" required />
            <TextField fullWidth label="Description" value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} margin="normal" multiline rows={3} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={editForm.status || 'Active'} label="Status" onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select value={editForm.priority || 'Medium'} label="Priority" onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth type="date" label="Due Date" value={editForm.dueDate || ''}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenEdit(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving} sx={{ borderRadius: 2 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
