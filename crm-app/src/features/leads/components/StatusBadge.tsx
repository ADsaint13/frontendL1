import { LeadStatus } from '../types/lead.types';
import type { LeadStatus as LeadStatusType } from '../types/lead.types';
import { STATUS_COLORS, humanize } from '../../../utils/formatters';

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {humanize(status)}
    </span>
  );
}
