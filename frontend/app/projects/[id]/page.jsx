'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TaskBadge from '@/components/TaskBadge';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';

const emptyTask = { title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' };

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [member, setMember] = useState({ email: '', role: 'Member' });
  const [task, setTask] = useState(emptyTask);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', status: 'Active' });

  const load = async () => {
    const res = await api.get(`/projects/${id}`);
    setData(res.data);
    setProjectForm({
      name: res.data.project.name,
      description: res.data.project.description || '',
      status: res.data.project.status
    });
  };

  useEffect(() => { load(); }, [id]);

  if (!data) return <ProtectedRoute><AppShell>Loading...</AppShell></ProtectedRoute>;

  const user = getUser();
  const memberRecord = data.project.members.find(m => m.user._id === user?._id);
  const myRole = user?.role === 'Admin' ? 'Admin' : memberRecord?.role;
  const isAdmin = myRole === 'Admin';

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, member);
      toast.success('Member added');
      setMember({ email: '', role: 'Member' });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const removeMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, projectForm);
      toast.success('Project updated');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const deleteProject = async () => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      router.push('/projects');
    } catch (err) { toast.error(err.message); }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...task, project: id });
      toast.success('Task created');
      setTask(emptyTask);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return <ProtectedRoute><AppShell>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">{data.project.name}</h2>
              <p className="mt-2 text-slate-500">{data.project.description || 'No description yet.'}</p>
            </div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">Your role: {myRole || 'Member'}</span>
          </div>
        </div>

        {isAdmin && <form onSubmit={saveProject} className="mt-6 card p-6">
          <h3 className="text-xl font-black">Project Settings</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="input" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}/>
            <select className="input" value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
              <option>Active</option><option>Completed</option><option>On Hold</option>
            </select>
            <textarea className="input md:col-span-2" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}/>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-primary">Save Changes</button>
            <button type="button" onClick={deleteProject} className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-600">Delete Project</button>
          </div>
        </form>}

        <div className="mt-6 card p-6">
          <h3 className="text-xl font-black">Tasks</h3>
          <div className="mt-5 space-y-3">
            {data.tasks.map(t => <div key={t._id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <b>{t.title}</b>
                  <p className="text-sm text-slate-500">Assigned to {t.assignedTo?.name} - Due {new Date(t.dueDate).toLocaleDateString()} - {t.priority}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TaskBadge>{t.status}</TaskBadge>
                  <select className="input py-2" value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                    <option>Todo</option><option>In Progress</option><option>Completed</option>
                  </select>
                  {isAdmin && <button onClick={() => deleteTask(t._id)} className="btn-secondary py-2" type="button">Delete</button>}
                </div>
              </div>
            </div>)}
            {!data.tasks.length && <p className="text-sm text-slate-500">No tasks created yet.</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-xl font-black">Team Members</h3>
          <div className="mt-4 space-y-3">
            {data.project.members.map(m => <div key={m.user._id} className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div><b>{m.user.name}</b><p className="text-xs text-slate-500">{m.user.email} - {m.role}</p></div>
                {isAdmin && data.project.owner?._id !== m.user._id && <button onClick={() => removeMember(m.user._id)} className="text-xs font-bold text-rose-600" type="button">Remove</button>}
              </div>
            </div>)}
          </div>
          {isAdmin && <form onSubmit={addMember} className="mt-5 space-y-3">
            <input className="input" placeholder="member@email.com" value={member.email} onChange={e => setMember({ ...member, email: e.target.value })}/>
            <select className="input" value={member.role} onChange={e => setMember({ ...member, role: e.target.value })}><option>Member</option><option>Admin</option></select>
            <button className="btn-primary w-full">Add Member</button>
          </form>}
        </div>

        {isAdmin && <form onSubmit={createTask} className="card p-6">
          <h3 className="text-xl font-black">Create Task</h3>
          <div className="mt-4 space-y-3">
            <input className="input" placeholder="Task title" value={task.title} onChange={e => setTask({ ...task, title: e.target.value })}/>
            <textarea className="input" placeholder="Description" value={task.description} onChange={e => setTask({ ...task, description: e.target.value })}/>
            <select className="input" value={task.assignedTo} onChange={e => setTask({ ...task, assignedTo: e.target.value })}>
              <option value="">Assign to</option>
              {data.project.members.map(m => <option key={m.user._id} value={m.user._id}>{m.user.name}</option>)}
            </select>
            <select className="input" value={task.priority} onChange={e => setTask({ ...task, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select>
            <input className="input" type="date" value={task.dueDate} onChange={e => setTask({ ...task, dueDate: e.target.value })}/>
            <button className="btn-primary w-full">Create Task</button>
          </div>
        </form>}
      </div>
    </div>
  </AppShell></ProtectedRoute>;
}
