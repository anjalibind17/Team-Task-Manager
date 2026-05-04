import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const summary = async (req, res, next) => {
  try {
    const projectFilter = req.user.role === 'Admin' ? {} : { 'members.user': req.user._id };
    const projects = await Project.find(projectFilter).select('_id name status members');
    const ids = projects.map(p => p._id);
    const tasks = await Task.find({ project: { $in: ids } }).populate('project', 'name').populate('assignedTo', 'name email').sort({ dueDate: 1 });
    const now = new Date();
    const stats = {
      projects: projects.length,
      totalTasks: tasks.length,
      todo: tasks.filter(t => t.status === 'Todo').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length
    };
    const myTasks = req.user.role === 'Admin'
      ? tasks
      : tasks.filter(t => t.assignedTo?._id.toString() === req.user._id.toString());
    res.json({ success: true, stats, projects, tasks: tasks.slice(0, 8), myTasks: myTasks.slice(0, 8) });
  } catch (error) { next(error); }
};
