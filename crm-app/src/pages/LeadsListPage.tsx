import { Link } from 'react-router-dom';
import { useLeads } from '../hooks';
import LeadTable from '../components/ui/LeadTable';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function LeadsListPage() {
  const { data, isLoading, isError, error } = useLeads();

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {data?.total ?? 0} total lead{data?.total !== 1 ? 's' : ''}
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

      {/* ── States ── */}
      {isLoading && <LoadingSpinner />}
      {isError && <ErrorMessage message={(error as Error).message} />}

      {/* ── Table ── */}
      {!isLoading && !isError && (
        <LeadTable leads={data?.data ?? []} />
      )}
    </div>
  );
}
