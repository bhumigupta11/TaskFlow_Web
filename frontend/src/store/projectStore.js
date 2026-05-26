import { create } from 'zustand';
import { projectAPI, taskAPI } from '../services/api';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  tasks: [],
  userTasks: [],
  stats: null,

  // ─── Projects ────────────────────────────────────────────────────────────────

  createProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await projectAPI.createProject(data);
      set({ projects: [res.data.data, ...get().projects], loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create project', loading: false });
      throw err;
    }
  },

  getUserProjects: async () => {
    set({ loading: true, error: null });
    try {
      const res = await projectAPI.getUserProjects();
      set({ projects: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch projects', loading: false });
      throw err;
    }
  },

  getProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await projectAPI.getProject(id);
      set({ selectedProject: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch project', loading: false });
      throw err;
    }
  },

  updateProject: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await projectAPI.updateProject(id, data);
      set({
        projects: get().projects.map((p) => (p._id === id ? res.data.data : p)),
        selectedProject: res.data.data,
        loading: false,
      });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update project', loading: false });
      throw err;
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await projectAPI.deleteProject(id);
      set({ projects: get().projects.filter((p) => p._id !== id), selectedProject: null, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete project', loading: false });
      throw err;
    }
  },

  addMember: async (projectId, data) => {
    try {
      const res = await projectAPI.addMember(projectId, data);
      set({ selectedProject: res.data.data });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to add member' });
      throw err;
    }
  },

  removeMember: async (projectId, userId) => {
    try {
      const res = await projectAPI.removeMember(projectId, userId);
      set({ selectedProject: res.data.data });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to remove member' });
      throw err;
    }
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────────

  createTask: async (data) => {
    try {
      const res = await taskAPI.createTask(data);
      set({ tasks: [res.data.data, ...get().tasks] });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create task' });
      throw err;
    }
  },

  getProjectTasks: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const res = await taskAPI.getProjectTasks(projectId);
      set({ tasks: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', loading: false });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await taskAPI.updateTask(id, data);
      set({
        tasks: get().tasks.map((t) => (t._id === id ? res.data.data : t)),
        userTasks: get().userTasks.map((t) => (t._id === id ? res.data.data : t)),
      });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update task' });
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      await taskAPI.deleteTask(id);
      set({
        tasks: get().tasks.filter((t) => t._id !== id),
        userTasks: get().userTasks.filter((t) => t._id !== id),
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete task' });
      throw err;
    }
  },

  getUserTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await taskAPI.getUserTasks();
      set({ userTasks: res.data.data, loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', loading: false });
      throw err;
    }
  },

  getDashboardStats: async () => {
    try {
      const res = await taskAPI.getDashboardStats();
      set({ stats: res.data.data });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch stats' });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
