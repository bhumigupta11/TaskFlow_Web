import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert, Link as MuiLink,
  InputAdornment, IconButton, Divider, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import {
  Email as EmailIcon, Lock as LockIcon, Person as PersonIcon,
  Visibility, VisibilityOff, Bolt as BoltIcon,
  AdminPanelSettings as AdminIcon, Group as MemberIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Member' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BoltIcon sx={{ color: '#fbbf24', fontSize: 36 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
              TaskFlow
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
            Start managing your team today
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join TaskFlow and start collaborating
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              margin="normal"
              required
              helperText="Minimum 6 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Role Selection */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Account Role
              </Typography>
              <ToggleButtonGroup
                value={form.role}
                exclusive
                onChange={(e, val) => val && setForm({ ...form, role: val })}
                fullWidth
                sx={{ gap: 1 }}
              >
                <ToggleButton
                  value="Member"
                  sx={{
                    borderRadius: '10px !important',
                    border: '1px solid #e5e7eb !important',
                    flex: 1,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: '#eff6ff',
                      borderColor: '#6366f1 !important',
                      color: '#4f46e5',
                    },
                  }}
                >
                  <MemberIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight={600}>Member</Typography>
                    <Typography variant="caption" color="text.secondary">Join projects</Typography>
                  </Box>
                </ToggleButton>
                <ToggleButton
                  value="Admin"
                  sx={{
                    borderRadius: '10px !important',
                    border: '1px solid #e5e7eb !important',
                    flex: 1,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: '#fef2f2',
                      borderColor: '#ef4444 !important',
                      color: '#dc2626',
                    },
                  }}
                >
                  <AdminIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight={600}>Admin</Typography>
                    <Typography variant="caption" color="text.secondary">Manage teams</Typography>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Typography align="center" variant="body2">
            Already have an account?{' '}
            <MuiLink
              component="button"
              fontWeight={600}
              onClick={() => navigate('/login')}
              sx={{ color: 'primary.main' }}
            >
              Sign in
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
