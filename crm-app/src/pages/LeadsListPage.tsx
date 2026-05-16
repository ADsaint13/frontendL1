import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { useLeads } from '../features/leads';
import { LeadTable, LeadFiltersBar, type FilterState } from '../features/leads';
import { TableSkeleton } from '../components/ui/Skeleton';

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LeadsLoadingState() {
  return <TableSkeleton columns={6} rows={6} />;
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
  const [filters, setFilters] = useState<FilterState>({ search: '', status: '' });
  const debouncedSearch = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useLeads();
  const allLeads = data?.data ?? [];

  const filteredLeads = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim();
    return allLeads.filter((lead) => {
      if (filters.status && lead.status !== filters.status) return false;
      if (term && !lead.name.toLowerCase().includes(term) && !lead.email.toLowerCase().includes(term)) {
        return false;
      }
      return true;
    });
  }, [allLeads, debouncedSearch, filters.status]);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shrink-0">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-0.5">Jamie Carter</div>
          <h1 className="text-xl font-semibold text-gray-900">Leads / All Leads</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Top Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-64 rounded-md border border-gray-300 py-1.5 pl-9 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <span className="text-xs text-gray-400 font-semibold border border-gray-200 rounded px-1 py-0.5">⌘K</span>
            </div>
          </div>

          <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            Save as Smartboard
          </button>
          <Link
            to="/leads/new"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            New Lead
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
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
          <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Subtle filters bar wrapper */}
            <div className="border-b border-gray-200">
              <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
                <LeadFiltersBar
                  filters={filters}
                  onChange={setFilters}
                  totalVisible={filteredLeads.length}
                  totalAll={allLeads.length}
                />
              </div>
            </div>

            {/* Filtered data into table */}
            <div className="flex-1 overflow-y-auto">
              <LeadTable leads={filteredLeads} />
            </div>

            {/* Pagination Mock */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 bg-white shrink-0">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Total count <span className="font-medium text-gray-900">{filteredLeads.length}</span> per page
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 text-sm font-medium transition-colors">
                      Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 transition-colors">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors">
                      4
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors">
                      5
                    </button>
                    <button className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 text-sm font-medium transition-colors">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
