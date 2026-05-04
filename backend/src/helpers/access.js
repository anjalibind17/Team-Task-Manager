import Project from '../models/Project.js';

export const getProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, member: null, isAdmin: false };
  const member = project.members.find(m => m.user.toString() === userId.toString());
  return { project, member, isAdmin: member?.role === 'Admin' };
};

export const requireProjectMember = async (projectId, user) => {
  const userId = user?._id || user;
  const access = await getProjectAccess(projectId, userId);
  if (!access.project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  if (user?.role === 'Admin') return { ...access, isAdmin: true, isGlobalAdmin: true };
  if (!access.member) {
    const err = new Error('Access denied');
    err.status = 403;
    throw err;
  }
  return access;
};

export const requireProjectAdmin = async (projectId, user) => {
  const access = await requireProjectMember(projectId, user);
  if (!access.isAdmin) {
    const err = new Error('Admin access required');
    err.status = 403;
    throw err;
  }
  return access;
};
