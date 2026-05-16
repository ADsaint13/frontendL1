import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLead, useUpdateLead } from '../features/leads';
import { DetailSkeleton } from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import { LeadForm, type LeadFormValues } from '../features/leads';

export default function LeadEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lead, isLoading, isError, error } = useLead(id);
  const { mutateAsync: updateLead } = useUpdateLead(id!);

  const handleSubmit = async (values: LeadFormValues) => {
    await updateLead(values);
    navigate(`/leads/${id}`);
  };

  if (isLoading) return <DetailSkeleton />;
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

      <LeadForm
        defaultValues={{
          name: lead.name,
          email: lead.email,
          phone: lead.phone ?? '',
          source: lead.source,
          status: lead.status,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        cancelSlot={
          <Link
            to={`/leads/${id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        }
      />
    </div>
  );
}
