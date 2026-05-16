import { Link, useNavigate } from 'react-router-dom';
import { useCreateLead } from '../features/leads';
import { LeadForm, type LeadFormValues } from '../features/leads';

export default function LeadCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync: createLead } = useCreateLead();

  const handleSubmit = async (values: LeadFormValues) => {
    const lead = await createLead(values);
    // Navigate to the new lead's detail page if the API returns an id,
    // otherwise fall back to the leads list.
    const id = (lead as { id?: string })?.id;
    navigate(id ? `/leads/${id}` : '/leads');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link to="/leads" className="text-sm text-indigo-600 hover:underline">
          ← Back to Leads
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">New Lead</h1>

      <LeadForm
        onSubmit={handleSubmit}
        submitLabel="Create Lead"
        cancelSlot={
          <Link
            to="/leads"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        }
      />
    </div>
  );
}
