import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLead, useUpdateLead } from '../hooks';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { LeadStatus, LeadSource } from '../types';
import type { UpdateLeadPayload } from '../types';

export default function LeadEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lead, isLoading, isError, error } = useLead(id);
  const { mutateAsync: updateLead, isPending } = useUpdateLead(id!);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as UpdateLeadPayload;
    await updateLead(data);
    navigate(`/leads/${id}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!lead) return <ErrorMessage message="Lead not found." />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link to={`/leads/${id}`} className="text-sm text-indigo-600 hover:underline">
          ← Back to Lead
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={lead.name}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={lead.email}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={lead.phone ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={lead.status}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Object.values(LeadStatus).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="source">
              Source
            </label>
            <select
              id="source"
              name="source"
              defaultValue={lead.source}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Object.values(LeadSource).map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()).toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to={`/leads/${id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
