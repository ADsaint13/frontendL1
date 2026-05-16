import React, { createContext, useContext, useState, useMemo } from 'react';
import type { LeadStatus } from '../types/lead.types';

export interface FilterState {
  search: string;
  status: LeadStatus | '';
}

interface LeadsFilterContextValue {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const LeadsFilterContext = createContext<LeadsFilterContextValue | undefined>(undefined);

export function LeadsFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({ search: '', status: '' });

  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <LeadsFilterContext.Provider value={value}>
      {children}
    </LeadsFilterContext.Provider>
  );
}

export function useLeadsFilterContext() {
  const context = useContext(LeadsFilterContext);
  if (!context) {
    throw new Error('useLeadsFilterContext must be used within a LeadsFilterProvider');
  }
  return context;
}
