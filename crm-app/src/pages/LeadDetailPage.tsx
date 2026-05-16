import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLead, useDeleteLead } from '../features/leads';
import { StatusBadge, LeadStatusTransition } from '../features/leads';
import ConfirmModal from '../components/ui/ConfirmModal';
import { DetailSkeleton } from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate, SOURCE_LABELS } from '../utils/formatters';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError, error } = useLead(id);
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    deleteLead(id!, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate('/leads');
      }
    });
  };

  if (isLoading) return <DetailSkeleton />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!lead) return <ErrorMessage message="Lead not found." />;

  const fields: { label: string; value: string | undefined }[] = [
    { label: 'Email', value: lead.email },
    { label: 'Phone', value: lead.phone },
    { label: 'Source', value: SOURCE_LABELS[lead.source] },
    { label: 'Created', value: formatDate(lead.created_at) },
    { label: 'Updated', value: formatDate(lead.updated_at) },
  ];

  return (
    <div className="space-y-6">
      {/* ── Back & Actions ── */}
      <div className="flex items-center justify-between">
        <Link to="/leads" className="text-sm text-indigo-600 hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
          ← Back to Leads
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
          >
            Delete
          </button>
          <Link
            to={`/leads/${id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          >
            Edit Lead
          </Link>
        </div>
      </div>

      {/* ── Lead Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={lead.status} />
            <LeadStatusTransition lead={lead} />
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
              <dd className="mt-1 text-sm text-gray-800">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
      
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
