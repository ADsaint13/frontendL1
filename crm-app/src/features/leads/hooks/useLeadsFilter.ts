import { useMemo } from 'react';
import { useLeadsFilterContext } from '../context/LeadsFilterContext';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Lead } from '../types/lead.types';

export function useLeadsFilter(allLeads: Lead[]) {
  const { filters, setFilters } = useLeadsFilterContext();
  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredLeads = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim();
    return allLeads.filter((lead) => {
      // Status filter
      if (filters.status && lead.status !== filters.status) return false;
      // Search filter — name OR email
      if (term && !lead.name.toLowerCase().includes(term) && !lead.email.toLowerCase().includes(term)) {
        return false;
      }
      return true;
    });
  }, [allLeads, debouncedSearch, filters.status]);

  return {
    filters,
    setFilters,
    filteredLeads,
  };
}
