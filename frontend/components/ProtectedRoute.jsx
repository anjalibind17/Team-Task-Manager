'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('ttmToken');
    if (!token) router.replace('/login');
    else setReady(true);
  }, [router]);
  if (!ready) return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>;
  return children;
}
