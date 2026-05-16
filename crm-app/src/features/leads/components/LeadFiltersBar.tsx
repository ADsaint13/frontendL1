import { LeadStatus } from '../types/lead.types';
import type { LeadStatus as LeadStatusType } from '../types/lead.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  search: string;
  status: LeadStatusType | '';
}

interface LeadFiltersBarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  totalVisible: number;
  totalAll: number;
}

// ─── Status option list ───────────────────────────────────────────────────────

const STATUS_OPTIONS: { label: string; value: LeadStatusType | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: LeadStatus.NEW },
  { label: 'Contacted', value: LeadStatus.CONTACTED },
  { label: 'Qualified', value: LeadStatus.QUALIFIED },
  { label: 'Converted', value: LeadStatus.CONVERTED },
  { label: 'Lost', value: LeadStatus.LOST },
];

// ─── Status dot colour map ────────────────────────────────────────────────────

const STATUS_DOT: Record<LeadStatusType, string> = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  QUALIFIED: 'bg-purple-500',
  CONVERTED: 'bg-green-500',
  LOST: 'bg-red-500',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Filter bar with:
 *  - Debounced search input (name or email)
 *  - Status dropdown with coloured dots
 *  - Result count summary
 *  - Clear button when any filter is active
 *
 * This is a controlled component — all state lives in the parent.
 */
export default function LeadFiltersBar({
  filters,
  onChange,
  totalVisible,
  totalAll,
}: LeadFiltersBarProps) {
  const isFiltered = filters.search !== '' || filters.status !== '';

  const handleClear = () => onChange({ search: '', status: '' });

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* ── Left: search + status ── */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            {/* Search icon */}
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <input
              id="lead-search"
              type="search"
              placeholder="Search by name or email…"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Inline clear × for search field */}
            {filters.search && (
              <button
                onClick={() => onChange({ ...filters, search: '' })}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            )}
          </div>

          {/* Status dropdown */}
          <div className="relative sm:w-44">
            <select
              id="lead-status-filter"
              value={filters.status}
              onChange={(e) =>
                onChange({ ...filters, status: e.target.value as LeadStatusType | '' })
              }
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Custom chevron */}
            <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 text-gray-400">
                <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Right: result count + clear ── */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Status dot */}
          {filters.status && (
            <span
              className={`inline-block size-2 rounded-full ${STATUS_DOT[filters.status as LeadStatusType]}`}
            />
          )}

          {/* Result count */}
          <span className="text-sm text-gray-500">
            {isFiltered ? (
              <>
                <span className="font-semibold text-gray-800">{totalVisible}</span>
                {' of '}
                <span>{totalAll}</span>
                {' results'}
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-800">{totalAll}</span>
                {` lead${totalAll !== 1 ? 's' : ''}`}
              </>
            )}
          </span>

          {/* Clear all button */}
          {isFiltered && (
            <button
              onClick={handleClear}
              className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
