import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Helper: check if user is a project member
const isProjectMember = (project, userId, userRole) => {
  if (userRole === 'Admin') return true;
  if (project.owner.toString() === userId) return true;
  return project.members.some((m) => m.userId.toString() === userId);
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  // Accept both 'projectId' and 'project' for flexibility
  const { title, description, projectId, project: projectField, assignedTo, priority, dueDate, estimatedHours } = req.body;
  const resolvedProjectId = projectId || projectField;

  try {
    if (!title || !resolvedProjectId) {
      return res.status(400).json({ success: false, message: 'Please provide title and projectId' });
    }

    const project = await Project.findById(resolvedProjectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isProjectMember(project, req.user.id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to create tasks in this project' });
    }

    const task = await Task.create({
      title,
      description,
      project: resolvedProjectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 0,
    });

    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');

    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks by project
// @route   GET /api/tasks/projects/:projectId
// @access  Private
export const getProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  const { status, assignedTo, priority } = req.query;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isProjectMember(project, req.user.id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view tasks' });
    }

    const query = { project: projectId };
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('comments.userId', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!isProjectMember(project, req.user.id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, actualHours } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!isProjectMember(project, req.user.id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (actualHours !== undefined) task.actualHours = actualHours;

    await task.save();
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');

    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!isProjectMember(project, req.user.id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks for current user (assigned or created)
// @route   GET /api/tasks/user/tasks
// @access  Private
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }],
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name _id')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }],
    });

    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { 'members.userId': req.user.id }],
    });

    const now = new Date();
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
      inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
      overdueTasks: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length,
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'Active').length,
      completedProjects: projects.filter((p) => p.status === 'Completed').length,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!isProjectMember(project, req.user.id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    task.comments.push({ userId: req.user.id, text });
    await task.save();
    await task.populate('comments.userId', 'name email');

    res.status(201).json({ success: true, data: task.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
