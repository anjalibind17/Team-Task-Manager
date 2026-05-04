'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data.projects));
  }, []);

  return <ProtectedRoute><AppShell>
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-black">Projects</h2>
        <p className="text-sm text-slate-500">{user?.role === 'Admin' ? 'Showing every project in the workspace.' : 'Projects where you are a team member.'}</p>
      </div>
      <Link href="/projects/new" className="btn-primary">Create Project</Link>
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(p => <Link href={`/projects/${p._id}`} key={p._id} className="card block p-6 hover:-translate-y-1 hover:transition">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-black">{p.name}</h3>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">{p.status}</span>
        </div>
        <p className="mt-3 min-h-12 text-sm text-slate-500">{p.description || 'No description'}</p>
        <div className="mt-5 flex items-center justify-between text-sm font-bold text-slate-700">
          <span>{p.members.length} members</span>
          {p.owner?.name && <span>Owner: {p.owner.name}</span>}
        </div>
      </Link>)}
      {!projects.length && <div className="card p-6 text-sm text-slate-500">No projects yet.</div>}
    </div>
  </AppShell></ProtectedRoute>;
}
