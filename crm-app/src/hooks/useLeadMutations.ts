import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead, updateLead, deleteLead, updateLeadStatus } from '../services';
import type { CreateLeadPayload, UpdateLeadPayload, UpdateLeadStatusPayload } from '../types';
import { LEADS_QUERY_KEY } from './useLeads';
import { LEAD_QUERY_KEY } from './useLead';

// ─── Create ───────────────────────────────────────────────────────────────────

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const useUpdateLead = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => updateLead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEAD_QUERY_KEY, id] });
    },
  });
};

// ─── Update Status ────────────────────────────────────────────────────────────

export const useUpdateLeadStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLeadStatusPayload) => updateLeadStatus(id, payload),
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
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};
