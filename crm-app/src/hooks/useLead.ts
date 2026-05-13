import { useQuery } from '@tanstack/react-query';
import { leadsService } from '../services';

export const LEAD_QUERY_KEY = 'lead' as const;

/**
 * Fetches a single lead by ID.
 * Query is disabled when `id` is falsy.
 */
export const useLead = (id: string | undefined) =>
  useQuery({
    queryKey: [LEAD_QUERY_KEY, id],
    queryFn: () => leadsService.getById(id!),
    enabled: !!id,
  });
