import { Link } from 'react-router-dom';
import { useLeads } from '../hooks';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function LeadsListPage() {
  const { data, isLoading, isError, error } = useLeads();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;

  const leads = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">{data?.total ?? 0} total leads</p>
        </div>
        <Link
          to="/leads/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
        >
          + New Lead
        </Link>
      </div>

      {/* ── Table ── */}
      {leads.length === 0 ? (
        <p className="text-gray-500 text-sm">No leads found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Company', 'Status', 'Value', 'Created'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {lead.firstName} {lead.lastName}
                    </Link>
                    <p className="text-xs text-gray-400">{lead.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lead.company ?? '—'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {lead.value != null ? formatCurrency(lead.value) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
