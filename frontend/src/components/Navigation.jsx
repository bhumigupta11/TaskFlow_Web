import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem,
  Avatar, Chip, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Assignment as TaskIcon,
  Logout as LogoutIcon, Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon, Bolt as BoltIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
  { label: 'My Tasks',  path: '/my-tasks',  icon: <TaskIcon sx={{ fontSize: 18 }} /> },
];

export default function Navigation() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
    setAnchorEl(null);
  };

  if (!user) return null;

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #0f0a2e 0%, #1e1254 50%, #2d1b69 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: '64px !important' }}>

        {/* ── Logo ── */}
        <Box
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            cursor: 'pointer', mr: 4,
            '&:hover .logo-bolt': { transform: 'rotate(15deg) scale(1.1)' },
          }}
        >
          <Box sx={{
            width: 36, height: 36, borderRadius: 2.5,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.5)',
          }}>
            <BoltIcon className="logo-bolt" sx={{ color: '#fbbf24', fontSize: 22, transition: 'all 0.3s ease' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.15rem', letterSpacing: '-0.5px', lineHeight: 1 }}>
              TaskFlow
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'rgba(167,139,250,0.8)', fontWeight: 600, letterSpacing: '0.1em', lineHeight: 1 }}>
              TEAM MANAGER
            </Typography>
          </Box>
        </Box>

        {/* ── Nav Links ── */}
        <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Button
                key={link.path}
                startIcon={link.icon}
                onClick={() => navigate(link.path)}
                sx={{
                  color: active ? '#fff' : 'rgba(167,139,250,0.8)',
                  backgroundColor: active
                    ? 'rgba(99,102,241,0.25)'
                    : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                  borderRadius: 3,
                  px: 2.5,
                  py: 1,
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.875rem',
                  backdropFilter: active ? 'blur(10px)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(99,102,241,0.15)',
                    color: '#fff',
                    border: '1px solid rgba(99,102,241,0.3)',
                  },
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>

        {/* ── Role Badge ── */}
        <Chip
          label={user.role}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            backgroundColor: user.role === 'Admin' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)',
            color: user.role === 'Admin' ? '#fca5a5' : '#a5b4fc',
            border: `1px solid ${user.role === 'Admin' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`,
            fontWeight: 700,
            fontSize: '0.7rem',
            mr: 1,
          }}
        />

        {/* ── User Menu ── */}
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={<ArrowDownIcon sx={{ fontSize: '16px !important', color: 'rgba(167,139,250,0.7)' }} />}
          sx={{
            color: '#fff',
            borderRadius: 3,
            px: 1.5,
            py: 0.75,
            border: '1px solid rgba(99,102,241,0.25)',
            backgroundColor: 'rgba(99,102,241,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.4)',
            },
          }}
        >
          <Avatar sx={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            fontSize: '0.75rem', fontWeight: 800, mr: 1,
            boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
          }}>
            {initials}
          </Avatar>
          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.2, color: '#fff' }}>
              {user.name?.split(' ')[0]}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1.5, minWidth: 240,
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(40px)',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(99,102,241,0.25)',
              border: '1px solid #ede9fe',
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -6, right: 20,
                width: 12, height: 12,
                background: '#fff',
                border: '1px solid #ede9fe',
                borderBottom: 'none',
                borderRight: 'none',
                transform: 'rotate(45deg)',
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User info header */}
          <Box sx={{ px: 2.5, py: 2, background: 'linear-gradient(135deg, #f5f3ff, #fdf4ff)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{
                width: 42, height: 42,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                fontWeight: 800, fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}>
                {initials}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={800}>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>{user.email}</Typography>
                <Box sx={{ mt: 0.25 }}>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === 'Admin' ? 'error' : 'primary'}
                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 0.75 }}>
            <MenuItem
              onClick={() => { navigate('/profile'); setAnchorEl(null); }}
              sx={{ borderRadius: 2, gap: 1.5, py: 1.25, px: 1.5 }}
            >
              <Box sx={{ width: 32, height: 32, borderRadius: 2, backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonIcon sx={{ fontSize: 16, color: '#6366f1' }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600}>Profile Settings</Typography>
                <Typography variant="caption" color="text.secondary">Update your info</Typography>
              </Box>
            </MenuItem>
          </Box>

          <Divider />

          <Box sx={{ p: 0.75 }}>
            <MenuItem
              onClick={handleLogout}
              sx={{ borderRadius: 2, gap: 1.5, py: 1.25, px: 1.5, color: 'error.main', '&:hover': { backgroundColor: '#fef2f2' } }}
            >
              <Box sx={{ width: 32, height: 32, borderRadius: 2, backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogoutIcon sx={{ fontSize: 16, color: '#ef4444' }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} color="error.main">Sign Out</Typography>
                <Typography variant="caption" color="text.secondary">See you next time</Typography>
              </Box>
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
