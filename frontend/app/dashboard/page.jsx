'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import TaskBadge from '@/components/TaskBadge';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    api.get('/dashboard/summary').then(res => setData(res.data));
  }, []);

  return <ProtectedRoute><AppShell>{!data ? <p>Loading dashboard...</p> : <>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-black">Dashboard</h2>
        <p className="text-sm text-slate-500">{user?.role === 'Admin' ? 'Admin view across all projects.' : 'Your assigned work and project progress.'}</p>
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Projects" value={data.stats.projects}/>
      <StatCard label="Tasks" value={data.stats.totalTasks}/>
      <StatCard label="Todo" value={data.stats.todo}/>
      <StatCard label="In Progress" value={data.stats.inProgress}/>
      <StatCard label="Completed" value={data.stats.completed}/>
      <StatCard label="Overdue" value={data.stats.overdue}/>
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h2 className="text-xl font-black">Recent Tasks</h2>
        <div className="mt-5 space-y-3">
          {data.tasks.map(t => <div key={t._id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3"><b>{t.title}</b><TaskBadge>{t.status}</TaskBadge></div>
            <p className="mt-1 text-sm text-slate-500">{t.project?.name} - Assigned to {t.assignedTo?.name}</p>
          </div>)}
          {!data.tasks.length && <p className="text-sm text-slate-500">No tasks yet.</p>}
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-black">{user?.role === 'Admin' ? 'All Active Work' : 'My Tasks'}</h2>
        <div className="mt-5 space-y-3">
          {data.myTasks.map(t => <div key={t._id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3"><b>{t.title}</b><TaskBadge>{t.status}</TaskBadge></div>
            <p className="mt-1 text-sm text-slate-500">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
          </div>)}
          {!data.myTasks.length && <p className="text-sm text-slate-500">No assigned tasks yet.</p>}
        </div>
      </div>
    </div>
  </>}</AppShell></ProtectedRoute>;
}
