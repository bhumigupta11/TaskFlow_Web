import express from 'express';
import {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  getUserTasks,
  getDashboardStats,
  addComment,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Order matters: specific routes before parameterized ones
router.get('/user/tasks', getUserTasks);
router.get('/dashboard/stats', getDashboardStats);
router.get('/projects/:projectId', getProjectTasks);

router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

export default router;
