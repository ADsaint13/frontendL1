import apiClient from '../utils/apiClient';
import type { Lead, CreateLeadPayload, UpdateLeadPayload, PaginatedLeads, LeadFilters } from '../types';

const BASE = '/leads';

export const leadsService = {
  /**
   * Fetch a paginated, filtered list of leads.
   */
  getAll: async (filters?: LeadFilters): Promise<PaginatedLeads> => {
    const { data } = await apiClient.get<PaginatedLeads>(BASE, { params: filters });
    return data;
  },

  /**
   * Fetch a single lead by its ID.
   */
  getById: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<Lead>(`${BASE}/${id}`);
    return data;
  },

  /**
   * Create a new lead.
   */
  create: async (payload: CreateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.post<Lead>(BASE, payload);
    return data;
  },

  /**
   * Partially update an existing lead.
   */
  update: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.patch<Lead>(`${BASE}/${id}`, payload);
    return data;
  },

  /**
   * Permanently delete a lead.
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
