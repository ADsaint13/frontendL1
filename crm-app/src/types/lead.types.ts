// ─── Lead Status & Source Enums ──────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export type LeadSource =
  | 'website'
  | 'referral'
  | 'social_media'
  | 'cold_call'
  | 'email_campaign'
  | 'other';

// ─── Core Lead Interface ──────────────────────────────────────────────────────

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  value?: number; // estimated deal value in USD
  assignedTo?: string; // user id
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ─── API Request / Response Types ────────────────────────────────────────────

export type CreateLeadPayload = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface PaginatedLeads {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}

// ─── Filter / Sort Options ────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  page?: number;
  limit?: number;
}
