import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  allUsers: [],

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.register({ name, email, password, role });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null, allUsers: [] });
  },

  getMe: async () => {
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.data });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch user' });
      throw err;
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const res = await authAPI.updateProfile(data);
      set({ user: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update profile', loading: false });
      throw err;
    }
  },

  getAllUsers: async () => {
    try {
      const res = await authAPI.getAllUsers();
      set({ allUsers: res.data.data });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch users' });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
