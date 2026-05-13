import { Link, useParams } from 'react-router-dom';
import { useLead } from '../hooks';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate, formatCurrency, SOURCE_LABELS } from '../utils/formatters';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lead, isLoading, isError, error } = useLead(id);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!lead) return <ErrorMessage message="Lead not found." />;

  const fields: { label: string; value: string | undefined }[] = [
    { label: 'Email', value: lead.email },
    { label: 'Phone', value: lead.phone },
    { label: 'Company', value: lead.company },
    { label: 'Source', value: SOURCE_LABELS[lead.source] },
    { label: 'Value', value: lead.value != null ? formatCurrency(lead.value) : undefined },
    { label: 'Created', value: formatDate(lead.createdAt) },
    { label: 'Updated', value: formatDate(lead.updatedAt) },
  ];

  return (
    <div className="space-y-6">
      {/* ── Back & Actions ── */}
      <div className="flex items-center justify-between">
        <Link to="/leads" className="text-sm text-indigo-600 hover:underline">
          ← Back to Leads
        </Link>
        <Link
          to={`/leads/${id}/edit`}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
        >
          Edit Lead
        </Link>
      </div>

      {/* ── Lead Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
              <dd className="mt-1 text-sm text-gray-800">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>

        {lead.notes && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</p>
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
