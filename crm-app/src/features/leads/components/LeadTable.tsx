import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lead } from '../types/lead.types';
import { SOURCE_LABELS, formatDate } from '../../../utils/formatters';
import { useDeleteLead } from '../hooks/useLeadMutations';
import StatusBadge from './StatusBadge';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// ─── Column header config ─────────────────────────────────────────────────────

const COLUMNS = ['NAME', 'RECORD TYPE', 'MERCHANT ID', 'EMAIL', 'OWNER', ''] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface LeadTableProps {
  leads: Lead[];
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function LeadRow({ lead }: { lead: Lead }) {
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    deleteLead(lead.id, {
      onSuccess: () => setIsDeleteModalOpen(false)
    });
  };

  return (
    <>
      <tr className="group hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-0">
        {/* Name */}
        <td className="whitespace-nowrap px-6 py-4">
          <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {lead.name}
          </span>
        </td>

        {/* Record Type */}
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
             <div className="size-5 rounded bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold">L</div>
             Lead
          </div>
        </td>

        {/* Merchant ID */}
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-mono">
          Acme{lead.id.split('-')[0].toUpperCase()}
        </td>

        {/* Email */}
        <td className="whitespace-nowrap px-6 py-4">
          <a
            href={`mailto:${lead.email}`}
            className="text-sm text-gray-600 hover:text-indigo-600 hover:underline transition-colors"
          >
            {lead.email}
          </a>
        </td>

        {/* Owner */}
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">JC</div>
            Jamie Carter
          </div>
        </td>

        {/* Actions */}
        <td className="whitespace-nowrap px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* View */}
            <Link
              to={`/leads/${lead.id}`}
              aria-label={`View ${lead.name}`}
              className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-indigo-700 hover:ring-indigo-300 transition-all"
            >
              View
            </Link>

            {/* Edit */}
            <Link
              to={`/leads/${lead.id}/edit`}
              aria-label={`Edit ${lead.name}`}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 hover:ring-indigo-400 transition-all"
            >
              Edit
            </Link>

            {/* Delete */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label={`Delete ${lead.name}`}
              className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100 hover:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isDeleting ? '…' : 'Delete'}
            </button>
          </div>
        </td>
      </tr>
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-6 py-24 text-center">
        <div className="mx-auto max-w-sm flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-indigo-50 opacity-50 blur-xl" />
            <svg className="relative h-16 w-16 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No leads found</h3>
          <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
            Get started by creating a new lead or adjusting your search filters.
          </p>
          <div className="mt-6">
            <Link
              to="/leads/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              New Lead
            </Link>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Lead Table ───────────────────────────────────────────────────────────────

export default function LeadTable({ leads }: LeadTableProps) {
  return (
    <div className="w-full">
      <table className="min-w-full text-left">
        {/* ── Head ── */}
        <thead>
          <tr className="border-b border-gray-200">
            {COLUMNS.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {leads.length === 0 ? <EmptyState /> : leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
        </tbody>
      </table>
    </div>
  );
}
