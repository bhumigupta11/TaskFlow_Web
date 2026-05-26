import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, TextField, Button, Alert,
  Avatar, Chip, Divider, Grid, InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon, Email as EmailIcon, Save as SaveIcon,
  AdminPanelSettings as AdminIcon, Group as MemberIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', pt: 5, pb: 8, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
            Profile Settings
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Manage your account information
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -3 }}>
        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f3f4f6', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Avatar
                sx={{
                  width: 80, height: 80, mx: 'auto', mb: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  fontSize: '1.75rem', fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{user?.email}</Typography>
              <Chip
                icon={user?.role === 'Admin' ? <AdminIcon fontSize="small" /> : <MemberIcon fontSize="small" />}
                label={user?.role}
                color={user?.role === 'Admin' ? 'error' : 'primary'}
                sx={{ fontWeight: 700 }}
              />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                  ACCOUNT INFO
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: <strong>{user?.role}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Status: <Chip label="Active" size="small" color="success" sx={{ height: 18, fontSize: '0.7rem', ml: 0.5 }} />
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Edit Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Edit Profile</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update your personal information
              </Typography>

              {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth label="Full Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  margin="normal" required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth label="Email Address" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  margin="normal" required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained" type="submit" disabled={loading}
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
