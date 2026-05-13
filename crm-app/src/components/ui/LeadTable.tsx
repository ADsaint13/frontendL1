import { Link } from 'react-router-dom';
import type { Lead } from '../../types';
import { SOURCE_LABELS, formatDate } from '../../utils/formatters';
import { useDeleteLead } from '../../hooks';
import StatusBadge from './StatusBadge';

// ─── Column header config ─────────────────────────────────────────────────────

const COLUMNS = ['Name', 'Email', 'Status', 'Source', 'Updated', 'Actions'] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface LeadTableProps {
  leads: Lead[];
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function LeadRow({ lead }: { lead: Lead }) {
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const handleDelete = () => {
    if (window.confirm(`Delete "${lead.name}"? This action cannot be undone.`)) {
      deleteLead(lead.id);
    }
  };

  return (
    <tr className="group hover:bg-indigo-50/60 transition-colors duration-150">
      {/* Name */}
      <td className="whitespace-nowrap px-6 py-4">
        <span className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
          {lead.name}
        </span>
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

      {/* Status */}
      <td className="whitespace-nowrap px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>

      {/* Source */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {SOURCE_LABELS[lead.source]}
      </td>

      {/* Updated at */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {formatDate(lead.updated_at)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2">
          {/* View */}
          <Link
            to={`/leads/${lead.id}`}
            aria-label={`View ${lead.name}`}
            className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-indigo-700 hover:ring-indigo-300 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path fillRule="evenodd" d="M1.38 8a6.636 6.636 0 0 1 13.24 0 6.636 6.636 0 0 1-13.24 0ZM8 4a4.136 4.136 0 0 0-4.12 3.804A4.136 4.136 0 0 0 8 12a4.136 4.136 0 0 0 4.12-4.196A4.136 4.136 0 0 0 8 4Z" clipRule="evenodd" />
            </svg>
            View
          </Link>

          {/* Edit */}
          <Link
            to={`/leads/${lead.id}/edit`}
            aria-label={`Edit ${lead.name}`}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 hover:ring-indigo-400 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
            </svg>
            Edit
          </Link>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete ${lead.name}`}
            className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100 hover:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
              <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z" clipRule="evenodd" />
            </svg>
            {isDeleting ? '…' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="size-10 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          <p className="text-sm font-medium text-gray-500">No leads found</p>
          <p className="text-xs text-gray-400">Add a lead to get started.</p>
        </div>
      </td>
    </tr>
  );
}

// ─── Lead Table ───────────────────────────────────────────────────────────────

/**
 * Responsive table that displays a list of CRM leads.
 *
 * Features:
 * - Semantic <table> with <thead> / <tbody> / <th scope> for accessibility
 * - Colour-coded status badges via StatusBadge
 * - View / Edit / Delete action buttons per row
 * - Delete triggers window.confirm before calling the API
 * - Horizontally scrollable on small screens via overflow-x-auto wrapper
 */
export default function LeadTable({ leads }: LeadTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        {/* ── Head ── */}
        <thead>
          <tr className="bg-gray-50">
            {COLUMNS.map((col) => (
              <th
                key={col}
                scope="col"
                className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                  col === 'Actions' ? 'text-right' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody className="divide-y divide-gray-100">
          {leads.length === 0 ? <EmptyState /> : leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
        </tbody>
      </table>
    </div>
  );
}
