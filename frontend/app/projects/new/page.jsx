'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';

export default function NewProject() {
  const router = useRouter();
  const [form,setForm]=useState({name:'',description:''});
  const submit=async(e)=>{e.preventDefault();try{const {data}=await api.post('/projects',form);toast.success('Project created');router.push(`/projects/${data.project._id}`)}catch(err){toast.error(err.message)}};
  return <ProtectedRoute><AppShell><form onSubmit={submit} className="card mx-auto max-w-2xl p-8"><h2 className="text-2xl font-black">Create Project</h2><div className="mt-6 space-y-4"><div><label className="label">Project Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div><label className="label">Description</label><textarea className="input min-h-32" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div><button className="btn-primary">Create</button></div></form></AppShell></ProtectedRoute>;
}
