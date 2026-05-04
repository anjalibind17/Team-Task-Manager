import Link from 'next/link';

export default function Home() {
  return <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <h1 className="text-2xl font-black text-slate-950">TaskFlow</h1>
      <div className="flex gap-3"><Link className="btn-secondary" href="/login">Login</Link><Link className="btn-primary" href="/signup">Signup</Link></div>
    </nav>
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
      <div><span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">Full-Stack Team Task Manager</span><h2 className="mt-6 text-5xl font-black leading-tight text-slate-950">Create projects, assign tasks, and track team progress.</h2><p className="mt-5 text-lg text-slate-600">A premium assignment-ready project with authentication, MongoDB relationships, REST APIs, validations, Admin/Member roles, and dashboard analytics.</p><Link href="/signup" className="mt-8 inline-block btn-primary">Start Now</Link></div>
      <div className="card p-6"><div className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-300">Project Progress</p><h3 className="mt-3 text-4xl font-black">78%</h3><div className="mt-6 h-3 rounded-full bg-slate-800"><div className="h-3 w-3/4 rounded-full bg-indigo-400" /></div></div><div className="mt-4 grid grid-cols-3 gap-4"><div className="rounded-xl bg-slate-50 p-4"><b>12</b><p className="text-xs text-slate-500">Tasks</p></div><div className="rounded-xl bg-slate-50 p-4"><b>5</b><p className="text-xs text-slate-500">Members</p></div><div className="rounded-xl bg-slate-50 p-4"><b>2</b><p className="text-xs text-slate-500">Overdue</p></div></div></div>
    </section>
  </main>;
}
