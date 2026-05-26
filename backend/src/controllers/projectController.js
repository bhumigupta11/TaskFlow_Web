import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc Create project
export const createProject = async (req, res, next) => {
  const { name, description, dueDate, priority } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a project name' 
      });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      dueDate,
      priority,
      members: [
        {
          userId: req.user.id,
          role: 'Admin',
        },
      ],
    });

    await project.populate('owner', 'name email');
    await project.populate('members.userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get all projects for user
export const getUserProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.userId': req.user.id },
      ],
    }).populate('owner', 'name email').populate('members.userId', 'name email');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get single project
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email');

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Check if user is member
    const isMember = project.owner.toString() === req.user.id || 
                     project.members.some(m => m.userId._id.toString() === req.user.id);

    if (!isMember && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this project' 
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update project
export const updateProject = async (req, res, next) => {
  const { name, description, status, dueDate, priority } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this project' 
      });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;
    if (priority) project.priority = priority;

    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members.userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this project' 
      });
    }

    // Delete all tasks in project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Add member to project
export const addMember = async (req, res, next) => {
  const { userId, role } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userId' 
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to add members to this project' 
      });
    }

    // Check if user already exists
    const memberExists = project.members.find(m => m.userId.toString() === userId);
    if (memberExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already a member' 
      });
    }

    project.members.push({
      userId,
      role: role || 'Member',
    });

    await project.save();
    await project.populate('members.userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Remove member from project
export const removeMember = async (req, res, next) => {
  const { userId } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to remove members' 
      });
    }

    project.members = project.members.filter(m => m.userId.toString() !== userId);

    await project.save();
    await project.populate('members.userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
