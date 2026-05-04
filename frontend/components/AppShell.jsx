'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout, getUser } from '@/lib/auth';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/tasks', label: 'Tasks' }
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const user = typeof window !== 'undefined' ? getUser() : null;
  return <div className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-slate-950 p-5 text-white md:block">
      <Link href="/dashboard" className="text-2xl font-black tracking-tight">TaskFlow</Link>
      <p className="mt-1 text-xs text-slate-400">Team Task Manager</p>
      <nav className="mt-10 space-y-2">
        {nav.map(item => <Link key={item.href} href={item.href} className={`block rounded-xl px-4 py-3 text-sm font-semibold ${pathname.startsWith(item.href) ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>{item.label}</Link>)}
      </nav>
      <button onClick={logout} className="absolute bottom-5 left-5 right-5 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-600">Logout</button>
    </aside>
    <main className="md:pl-64">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur md:px-8">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-black">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1><p className="text-sm text-slate-500">Manage projects, tasks and progress in one place.</p></div>
          <div className="flex items-center gap-3">
            {user?.role === 'Admin' && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Admin</span>}
            <Link href="/projects/new" className="btn-primary">New Project</Link>
          </div>
        </div>
      </header>
      <div className="p-5 md:p-8">{children}</div>
    </main>
  </div>;
}
