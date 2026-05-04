'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import TaskBadge from '@/components/TaskBadge';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks,setTasks]=useState([]);
  const load=()=>api.get('/tasks').then(res=>setTasks(res.data.tasks));
  useEffect(()=>{load();},[]);
  const update=async(id,status)=>{try{await api.put(`/tasks/${id}`,{status});load();toast.success('Status updated')}catch(err){toast.error(err.message)}};
  return <ProtectedRoute><AppShell><h2 className="mb-6 text-2xl font-black">Tasks</h2><div className="card overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-slate-600"><tr><th className="p-4">Task</th><th>Project</th><th>Assignee</th><th>Status</th><th>Due</th><th>Action</th></tr></thead><tbody>{tasks.map(t=><tr key={t._id} className="border-t border-slate-100"><td className="p-4 font-bold">{t.title}</td><td>{t.project?.name}</td><td>{t.assignedTo?.name}</td><td><TaskBadge>{t.status}</TaskBadge></td><td>{new Date(t.dueDate).toLocaleDateString()}</td><td><select className="input max-w-40 py-2" value={t.status} onChange={e=>update(t._id,e.target.value)}><option>Todo</option><option>In Progress</option><option>Completed</option></select></td></tr>)}</tbody></table></div></AppShell></ProtectedRoute>;
}
