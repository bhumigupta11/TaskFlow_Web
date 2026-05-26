import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert, Link as MuiLink,
  InputAdornment, IconButton, Divider, Chip,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff,
  Bolt as BoltIcon, AdminPanelSettings as AdminIcon, Group as MemberIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@taskflow.com', password: 'password123', color: '#ef4444', bg: '#fef2f2', icon: <AdminIcon fontSize="small" /> },
  { role: 'Member', email: 'member@taskflow.com', password: 'password123', color: '#6366f1', bg: '#eff6ff', icon: <MemberIcon fontSize="small" /> },
];

const FEATURES = [
  'Role-based access control (Admin & Member)',
  'Project & team management',
  'Task assignment & status tracking',
  'Real-time dashboard with overdue alerts',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const fillDemo = (cred) => {
    setForm({ email: cred.email, password: cred.password });
    toast(`Demo credentials filled for ${cred.role}`, { icon: '✏️' });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel — Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        {[
          { size: 400, top: -100, right: -100, opacity: 0.08 },
          { size: 300, bottom: -80, left: -80, opacity: 0.06 },
          { size: 200, top: '40%', left: '10%', opacity: 0.05 },
        ].map((c, i) => (
          <Box key={i} sx={{
            position: 'absolute', width: c.size, height: c.size, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
            top: c.top, right: c.right, bottom: c.bottom, left: c.left, opacity: c.opacity,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }} />
        ))}

        <Box sx={{ position: 'relative', textAlign: 'center', maxWidth: 400 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BoltIcon sx={{ color: '#fbbf24', fontSize: 32 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              TaskFlow
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
            Manage your team's work in one place
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 5, lineHeight: 1.7 }}>
            Assign tasks, track progress, and hit deadlines — all with a beautiful, intuitive interface.
          </Typography>

          <Box sx={{ textAlign: 'left' }}>
            {FEATURES.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>{f}</Typography>
              </Box>
            ))}
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 3, mt: 5, justifyContent: 'center' }}>
            {[{ n: '4', l: 'Projects' }, { n: '17', l: 'Tasks' }, { n: '4', l: 'Team Members' }].map((s) => (
              <Box key={s.l} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>{s.n}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{s.l}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Panel — Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 480px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
          backgroundColor: '#fff',
          overflowY: 'auto',
        }}
      >
        {/* Mobile logo */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4 }}>
          <BoltIcon sx={{ color: '#6366f1', fontSize: 28 }} />
          <Typography variant="h5" fontWeight={800} color="primary">TaskFlow</Typography>
        </Box>

        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.5px' }}>
          Welcome back 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to continue to your workspace.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email address" type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            margin="normal" required autoComplete="email"
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            margin="normal" required autoComplete="current-password"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth variant="contained" size="large" type="submit"
            disabled={loading}
            sx={{
              mt: 3, mb: 2, py: 1.75,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontSize: '1rem', fontWeight: 700, borderRadius: 3,
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              '&:hover': { boxShadow: '0 6px 24px rgba(99,102,241,0.5)', transform: 'translateY(-1px)' },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>DEMO CREDENTIALS</Typography>
        </Divider>

        {/* Demo credential cards */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          {DEMO_CREDENTIALS.map((cred) => (
            <Box
              key={cred.role}
              onClick={() => fillDemo(cred)}
              sx={{
                flex: 1, p: 2, borderRadius: 3, cursor: 'pointer',
                border: `1.5px solid ${cred.color}20`,
                backgroundColor: cred.bg,
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 16px ${cred.color}25`, borderColor: cred.color },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Box sx={{ color: cred.color }}>{cred.icon}</Box>
                <Typography variant="body2" fontWeight={700} sx={{ color: cred.color }}>{cred.role}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                {cred.email}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                password123
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography align="center" variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <MuiLink component="button" fontWeight={700} onClick={() => navigate('/register')} sx={{ color: 'primary.main' }}>
            Create one free
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
