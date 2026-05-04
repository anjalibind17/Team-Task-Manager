export default function TaskBadge({ children }) {
  const color = children === 'Completed' ? 'bg-emerald-100 text-emerald-700' : children === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{children}</span>;
}
