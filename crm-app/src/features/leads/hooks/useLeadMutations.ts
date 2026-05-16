import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createLead, updateLead, deleteLead, updateLeadStatus } from '../api/leads.api';
import type { CreateLeadPayload, UpdateLeadPayload, UpdateLeadStatusPayload, PaginatedLeads } from '../types/lead.types';
import { LEADS_QUERY_KEY } from './useLeads';
import { LEAD_QUERY_KEY } from './useLead';

// ─── Create ───────────────────────────────────────────────────────────────────

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create lead: ${error.message}`);
    }
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
      toast.success('Lead updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update lead: ${error.message}`);
    }
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
      toast.success('Status updated');
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: [LEADS_QUERY_KEY] });

      // Snapshot the previous value
      const previousLeads = queryClient.getQueriesData<PaginatedLeads>({ queryKey: [LEADS_QUERY_KEY] });

      // Optimistically update to the new value
      queryClient.setQueriesData<PaginatedLeads>({ queryKey: [LEADS_QUERY_KEY] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((lead) => lead.id !== id),
          total: Math.max(0, old.total - 1),
        };
      });

      // Return a context object with the snapshotted value
      return { previousLeads };
    },
    onError: (error, _id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLeads) {
        context.previousLeads.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to delete lead: ${error.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
    onSuccess: () => {
      toast.success('Lead deleted successfully');
    },
  });
};
