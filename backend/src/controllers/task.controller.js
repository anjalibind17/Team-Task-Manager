import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { requireProjectAdmin, requireProjectMember } from '../helpers/access.js';

export const createTask = async (req, res, next) => {
  try {
    const { project } = await requireProjectAdmin(req.body.project, req.user);
    const isMember = project.members.some(m => m.user.toString() === req.body.assignedTo);
    if (!isMember) return res.status(400).json({ success: false, message: 'Assigned user must be a project member' });
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await task.populate('assignedTo', 'name email');
    res.status(201).json({ success: true, task });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const getTasks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.project) {
      await requireProjectMember(req.query.project, req.user);
      filter.project = req.query.project;
    } else if (req.user.role === 'Admin') {
      const projects = await Project.find({}).select('_id');
      filter.project = { $in: projects.map(p => p._id) };
    } else {
      filter.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }
    const tasks = await Task.find(filter).populate('project', 'name').populate('assignedTo', 'name email').sort({ dueDate: 1 });
    res.json({ success: true, tasks });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project').populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await requireProjectMember(task.project._id, req.user);
    res.json({ success: true, task });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const access = await requireProjectMember(task.project, req.user);
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();
    if (!access.isAdmin && !isAssignee) return res.status(403).json({ success: false, message: 'Access denied' });

    if (access.isAdmin) {
      ['title', 'description', 'assignedTo', 'priority', 'status', 'dueDate'].forEach(key => {
        if (req.body[key] !== undefined) task[key] = req.body[key];
      });
      if (req.body.assignedTo) {
        const ok = access.project.members.some(m => m.user.toString() === req.body.assignedTo);
        if (!ok) return res.status(400).json({ success: false, message: 'Assigned user must be a project member' });
      }
    } else {
      if (!req.body.status) return res.status(403).json({ success: false, message: 'Members can update status only' });
      task.status = req.body.status;
    }
    await task.save();
    await task.populate('assignedTo', 'name email');
    res.json({ success: true, task });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await requireProjectAdmin(task.project, req.user);
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) { res.status(error.status || 500); next(error); }
};
