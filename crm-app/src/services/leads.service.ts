import axios from 'axios';
import apiClient from '../utils/apiClient';
import type {
  Lead,
  CreateLeadPayload,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
  PaginatedLeads,
  LeadFilters,
} from '../types';

// ─── Error Handling ───────────────────────────────────────────────────────────

/**
 * Normalises any thrown value into a plain Error so callers always
 * receive a consistent `Error` object regardless of what Axios threw.
 *
 * Priority:  API response message  →  Axios message  →  fallback string
 */
function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    // The server returned a structured error body
    const serverMessage: string | undefined =
      error.response?.data?.message ?? error.response?.data?.error;

    throw new Error(serverMessage ?? error.message);
  }

  if (error instanceof Error) throw error;

  throw new Error('An unexpected error occurred.');
}

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = '/leads';

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Fetch a paginated, optionally filtered list of leads.
 *
 * @example
 * const { data, total } = await getLeads({ status: LeadStatus.NEW, page: 1 });
 */
export async function getLeads(filters?: LeadFilters): Promise<PaginatedLeads> {
  try {
    const { data } = await apiClient.get<PaginatedLeads>(BASE, { params: filters });
    return data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Fetch a single lead by its ID.
 *
 * @throws {Error} when the lead is not found (404) or the request fails.
 */
export async function getLeadById(id: string): Promise<Lead> {
  try {
    const { data } = await apiClient.get<Lead>(`${BASE}/${id}`);
    return data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Create a new lead record.
 *
 * @returns The newly created lead with server-generated id and timestamps.
 */
export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  try {
    const { data } = await apiClient.post<Lead>(BASE, payload);
    return data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Partially update a lead's fields (PATCH semantics — only send changed fields).
 *
 * @example
 * await updateLead('abc123', { name: 'Jane Doe', phone: '+1-555-0100' });
 */
export async function updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
  try {
    const { data } = await apiClient.patch<Lead>(`${BASE}/${id}`, payload);
    return data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Permanently delete a lead by ID.
 *
 * Resolves to `void` on success; throws on failure.
 */
export async function deleteLead(id: string): Promise<void> {
  try {
    await apiClient.delete(`${BASE}/${id}`);
  } catch (error) {
    handleError(error);
  }
}

/**
 * Transition a lead to a new status via the dedicated status endpoint.
 *
 * Using a separate endpoint (PATCH /leads/:id/status) keeps status changes
 * auditable and lets the backend apply pipeline validation rules independently
 * from a general-purpose update.
 *
 * @example
 * await updateLeadStatus('abc123', { status: LeadStatus.QUALIFIED });
 */
export async function updateLeadStatus(
  id: string,
  payload: UpdateLeadStatusPayload,
): Promise<Lead> {
  try {
    const { data } = await apiClient.patch<Lead>(`${BASE}/${id}/status`, payload);
    return data;
  } catch (error) {
    handleError(error);
  }
}
