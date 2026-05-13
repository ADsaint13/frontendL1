import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeads, useDebounce } from '../hooks';
import LeadTable from '../components/ui/LeadTable';
import LeadFiltersBar, { type FilterState } from '../components/ui/LeadFiltersBar';

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LeadsLoadingState() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-3.5">
        <div className="flex gap-8">
          {['w-12', 'w-16', 'w-14', 'w-14', 'w-16', 'w-14'].map((w, i) => (
            <div key={i} className={`h-3 ${w} rounded bg-gray-200 animate-pulse`} />
          ))}
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-8 border-b border-gray-100 px-6 py-4 last:border-0"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-36 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
          <div className="ml-auto flex gap-2">
            <div className="h-6 w-14 rounded-md bg-gray-100 animate-pulse" />
            <div className="h-6 w-12 rounded-md bg-gray-100 animate-pulse" />
            <div className="h-6 w-16 rounded-md bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Error panel ──────────────────────────────────────────────────────────────

function LeadsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-600">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="mt-4 text-base font-semibold text-red-800">Failed to load leads</h2>
      <p className="mt-1 max-w-sm text-sm text-red-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clipRule="evenodd" />
        </svg>
        Try again
      </button>
    </div>
  );
}

// ─── Leads List Page ──────────────────────────────────────────────────────────

/**
 * Fetches all leads once via React Query, then applies client-side
 * filtering so search and status changes feel instant with no extra
 * network requests.
 *
 * Filter flow:
 *   raw input  →  useDebounce (300 ms)  →  useMemo filter  →  LeadTable
 */
export default function LeadsListPage() {
  // ── Filter state (raw — drives the controlled inputs) ──────────────────────
  const [filters, setFilters] = useState<FilterState>({ search: '', status: '' });

  // ── Debounce the search term so filtering only runs after typing stops ─────
  const debouncedSearch = useDebounce(filters.search, 300);

  // ── Fetch all leads once; refetch is manual (error recovery only) ──────────
  const { data, isLoading, isError, error, refetch } = useLeads();
  const allLeads = data?.data ?? [];

  // ── Client-side filter — runs only when debounced search or status change ──
  const filteredLeads = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim();
    return allLeads.filter((lead) => {
      // Status filter
      if (filters.status && lead.status !== filters.status) return false;
      // Search filter — name OR email
      if (term && !lead.name.toLowerCase().includes(term) && !lead.email.toLowerCase().includes(term)) {
        return false;
      }
      return true;
    });
  }, [allLeads, debouncedSearch, filters.status]);

  return (
    <div className="space-y-4">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading
              ? 'Loading…'
              : isError
              ? 'Could not load leads'
              : `${allLeads.length} total lead${allLeads.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <Link
          to="/leads/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
          New Lead
        </Link>
      </div>

      {/* ── 1. Loading state ── */}
      {isLoading && <LeadsLoadingState />}

      {/* ── 2. Error state ── */}
      {isError && (
        <LeadsErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      )}

      {/* ── 3. Success state ── */}
      {!isLoading && !isError && (
        <>
          {/* Filter bar — only shown when there is data to filter */}
          <LeadFiltersBar
            filters={filters}
            onChange={setFilters}
            totalVisible={filteredLeads.length}
            totalAll={allLeads.length}
          />

          {/* Filtered data into table */}
          <LeadTable leads={filteredLeads} />
        </>
      )}
    </div>
  );
}
