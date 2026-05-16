import { useQuery } from '@tanstack/react-query';
import { getLeads } from '../api/leads.api';
import type { LeadFilters } from '../types/lead.types';

export const LEADS_QUERY_KEY = 'leads' as const;

/**
 * Fetches a paginated, filtered list of leads.
 * Automatically refetches when `filters` changes.
 */
export const useLeads = (filters?: LeadFilters) =>
  useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => getLeads(filters),
  });
