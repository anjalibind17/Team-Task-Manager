import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { requireProjectAdmin, requireProjectMember } from '../helpers/access.js';

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description || '',
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'Admin' }]
    });
    await project.populate('members.user', 'name email');
    res.status(201).json({ success: true, project });
  } catch (error) { next(error); }
};

export const getProjects = async (req, res, next) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { 'members.user': req.user._id };
    const projects = await Project.find(filter)
      .populate('members.user', 'name email')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) { next(error); }
};

export const getProject = async (req, res, next) => {
  try {
    await requireProjectMember(req.params.id, req.user);
    const project = await Project.findById(req.params.id).populate('members.user', 'name email').populate('owner', 'name email');
    const tasks = await Task.find({ project: req.params.id }).populate('assignedTo', 'name email').sort({ dueDate: 1 });
    res.json({ success: true, project, tasks });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const updateProject = async (req, res, next) => {
  try {
    const { project } = await requireProjectAdmin(req.params.id, req.user);
    project.name = req.body.name ?? project.name;
    project.description = req.body.description ?? project.description;
    project.status = req.body.status ?? project.status;
    await project.save();
    await project.populate('members.user', 'name email');
    await project.populate('owner', 'name email');
    res.json({ success: true, project });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const deleteProject = async (req, res, next) => {
  try {
    await requireProjectAdmin(req.params.id, req.user);
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const addMember = async (req, res, next) => {
  try {
    const { project } = await requireProjectAdmin(req.params.id, req.user);
    const { email, role = 'Member' } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found. Ask them to signup first.' });
    const already = project.members.some(m => m.user.toString() === user._id.toString());
    if (already) return res.status(400).json({ success: false, message: 'User already exists in project' });
    project.members.push({ user: user._id, role });
    await project.save();
    await project.populate('members.user', 'name email');
    res.json({ success: true, project });
  } catch (error) { res.status(error.status || 500); next(error); }
};

export const removeMember = async (req, res, next) => {
  try {
    const { project } = await requireProjectAdmin(req.params.id, req.user);
    if (project.owner.toString() === req.params.userId) return res.status(400).json({ success: false, message: 'Owner cannot be removed' });
    project.members = project.members.filter(m => m.user.toString() !== req.params.userId);
    await project.save();
    await Task.updateMany({ project: project._id, assignedTo: req.params.userId }, { assignedTo: project.owner });
    await project.populate('members.user', 'name email');
    res.json({ success: true, project });
  } catch (error) { res.status(error.status || 500); next(error); }
};
