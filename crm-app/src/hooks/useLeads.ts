import { useQuery } from '@tanstack/react-query';
import { leadsService } from '../services';
import type { LeadFilters } from '../types';

export const LEADS_QUERY_KEY = 'leads' as const;

/**
 * Fetches a paginated, filtered list of leads.
 * Automatically refetches when `filters` changes.
 */
export const useLeads = (filters?: LeadFilters) =>
  useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadsService.getAll(filters),
  });
