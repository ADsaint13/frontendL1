import { Link } from 'react-router-dom';
import { useLeads } from '../features/leads';

const stats = [
  { label: 'Total Leads', key: 'total' },
  { label: 'Won Deals', value: '—' },
  { label: 'Open Proposals', value: '—' },
];

export default function DashboardPage() {
  const { data } = useLeads({ limit: 1 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your CRM pipeline.</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Leads</p>
          <p className="mt-2 text-4xl font-bold text-indigo-600">{data?.total ?? '—'}</p>
        </div>
        {stats.slice(1).map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <p className="mt-2 text-4xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Link ── */}
      <div className="flex gap-4">
        <Link
          to="/leads"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
        >
          View All Leads →
        </Link>
      </div>
    </div>
  );
}
