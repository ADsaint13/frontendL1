import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '../services';
import type { CreateLeadPayload, UpdateLeadPayload } from '../types';
import { LEADS_QUERY_KEY } from './useLeads';
import { LEAD_QUERY_KEY } from './useLead';

// ─── Create ───────────────────────────────────────────────────────────────────

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const useUpdateLead = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => leadsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEAD_QUERY_KEY, id] });
    },
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};
