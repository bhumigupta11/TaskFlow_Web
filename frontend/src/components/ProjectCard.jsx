import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardActions, Typography, Button, Box,
  Chip, Avatar, AvatarGroup, Tooltip, IconButton, Menu, MenuItem, LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreIcon, Delete as DeleteIcon, Edit as EditIcon,
  ArrowForward as ArrowIcon, CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useProjectStore } from '../store/projectStore';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

const PRIORITY_GRADIENTS = {
  High:   { bar: 'linear-gradient(90deg, #ef4444, #f97316)', glow: 'rgba(239,68,68,0.3)',   badge: { bg: '#fef2f2', text: '#dc2626' } },
  Medium: { bar: 'linear-gradient(90deg, #f59e0b, #fbbf24)', glow: 'rgba(245,158,11,0.3)',  badge: { bg: '#fffbeb', text: '#b45309' } },
  Low:    { bar: 'linear-gradient(90deg, #10b981, #34d399)', glow: 'rgba(16,185,129,0.3)',  badge: { bg: '#ecfdf5', text: '#065f46' } },
};

const STATUS_STYLES = {
  Active:    { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
  'On Hold': { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
  Completed: { bg: '#f5f3ff', text: '#4c1d95', dot: '#8b5cf6' },
};

const AVATAR_COLORS = ['#6366f1','#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6'];

export default function ProjectCard({ project, onEdit }) {
  const navigate = useNavigate();
  const { deleteProject } = useProjectStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDelete = async () => {
    setAnchorEl(null);
    if (window.confirm(`Delete "${project.name}"? All tasks will be removed.`)) {
      try {
        await deleteProject(project._id);
        toast.success('Project deleted');
      } catch { toast.error('Failed to delete'); }
    }
  };

  const priorityCfg = PRIORITY_GRADIENTS[project.priority] || PRIORITY_GRADIENTS.Medium;
  const statusCfg   = STATUS_STYLES[project.status]        || STATUS_STYLES.Active;
  const isOverdue   = project.dueDate && isPast(new Date(project.dueDate)) && project.status !== 'Completed';

  return (
    <Card sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(237,233,254,0.8)',
      borderRadius: '20px',
      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 20px 48px ${priorityCfg.glow}, 0 8px 24px rgba(0,0,0,0.08)`,
        border: '1px solid rgba(99,102,241,0.2)',
      },
      '&:hover .open-btn': { opacity: 1, transform: 'translateY(0)' },
      '&:hover .card-glow': { opacity: 1 },
    }}>

      {/* Glow overlay on hover */}
      <Box className="card-glow" sx={{
        position: 'absolute', inset: 0, opacity: 0,
        background: `radial-gradient(circle at 50% 0%, ${priorityCfg.glow} 0%, transparent 60%)`,
        transition: 'opacity 0.3s ease', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Priority gradient top bar */}
      <Box sx={{ height: 5, background: priorityCfg.bar, position: 'relative', zIndex: 1 }} />

      <CardContent sx={{ flex: 1, pt: 2.5, pb: 1, position: 'relative', zIndex: 1 }}>

        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800, fontSize: '1rem', lineHeight: 1.3, cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#6366f1' },
              }}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              {project.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: '#9ca3af', '&:hover': { color: '#6366f1', backgroundColor: '#f5f3ff' } }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: 3, minWidth: 170, boxShadow: '0 8px 32px rgba(99,102,241,0.2)' } }}
          >
            <MenuItem onClick={() => { setAnchorEl(null); onEdit?.(project); }} sx={{ gap: 1.5, borderRadius: 2, mx: 0.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EditIcon sx={{ fontSize: 14, color: '#6366f1' }} />
              </Box>
              <Typography variant="body2" fontWeight={600}>Edit Project</Typography>
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ gap: 1.5, borderRadius: 2, mx: 0.5, color: 'error.main', '&:hover': { backgroundColor: '#fef2f2' } }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DeleteIcon sx={{ fontSize: 14, color: '#ef4444' }} />
              </Box>
              <Typography variant="body2" fontWeight={600}>Delete</Typography>
            </MenuItem>
          </Menu>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{
          mb: 2, minHeight: 38, lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description || 'No description provided.'}
        </Typography>

        {/* Status + Priority badges */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.5,
            px: 1.25, py: 0.4, borderRadius: 2,
            backgroundColor: statusCfg.bg,
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusCfg.dot }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: statusCfg.text }}>{project.status}</Typography>
          </Box>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            px: 1.25, py: 0.4, borderRadius: 2,
            backgroundColor: priorityCfg.badge.bg,
          }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: priorityCfg.badge.text }}>{project.priority} Priority</Typography>
          </Box>
        </Box>

        {/* Due date */}
        {project.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
            <CalendarIcon sx={{ fontSize: 13, color: isOverdue ? '#ef4444' : '#9ca3af' }} />
            <Typography variant="caption" sx={{
              color: isOverdue ? '#ef4444' : '#9ca3af',
              fontWeight: isOverdue ? 700 : 500,
              fontSize: '0.75rem',
            }}>
              {isOverdue ? '⚠️ Overdue · ' : ''}{format(new Date(project.dueDate), 'MMM d, yyyy')}
            </Typography>
          </Box>
        )}

        {/* Members */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup max={4} sx={{
            '& .MuiAvatar-root': {
              width: 28, height: 28, fontSize: '0.72rem', fontWeight: 800,
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          }}>
            {project.members.map((m, i) => (
              <Tooltip key={m.userId?._id || m.userId} title={m.userId?.name || 'Member'} arrow>
                <Avatar sx={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[i % AVATAR_COLORS.length]}, ${AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length]})` }}>
                  {(m.userId?.name || 'M')[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.72rem' }}>
            {project.members.length} member{project.members.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 1, position: 'relative', zIndex: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          endIcon={<ArrowIcon sx={{ fontSize: '16px !important', transition: 'transform 0.2s ease' }} />}
          onClick={() => navigate(`/project/${project._id}`)}
          sx={{
            borderRadius: 3, py: 1.25,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            fontSize: '0.82rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
              boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
              '& .MuiButton-endIcon svg': { transform: 'translateX(4px)' },
            },
          }}
        >
          Open Project
        </Button>
      </CardActions>
    </Card>
  );
}
