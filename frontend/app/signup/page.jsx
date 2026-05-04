'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/auth/signup', form); saveAuth(data.token, data.user); toast.success('Account created'); router.push('/dashboard'); }
    catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };
  return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4"><form onSubmit={submit} className="card w-full max-w-md p-8"><h1 className="text-3xl font-black">Create Account</h1><p className="mt-2 text-slate-500">Start managing team projects.</p><div className="mt-6 space-y-4"><input className="input" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input className="input" type="password" placeholder="Password min 6 chars" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button disabled={loading} className="btn-primary w-full">{loading?'Please wait...':'Signup'}</button></div><p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-indigo-600" href="/login">Login</Link></p></form></div>;
}
