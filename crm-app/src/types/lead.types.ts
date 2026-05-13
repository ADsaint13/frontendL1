// ─── Lead Status ─────────────────────────────────────────────────────────────

/**
 * Represents the lifecycle stage of a lead in the sales pipeline.
 * Values are uppercase strings to match the API contract.
 *
 * Uses a const-object pattern instead of `enum` because TypeScript 6+
 * with `erasableSyntaxOnly` prohibits enums that emit runtime code.
 * Ergonomics are identical: LeadStatus.NEW, exhaustive switch, etc.
 */
export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

// ─── Lead Source ─────────────────────────────────────────────────────────────

/** Describes how a lead was originally acquired. */
export const LeadSource = {
  WEBSITE: 'WEBSITE',
  REFERRAL: 'REFERRAL',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  COLD_CALL: 'COLD_CALL',
  EMAIL_CAMPAIGN: 'EMAIL_CAMPAIGN',
  OTHER: 'OTHER',
} as const;

export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

// ─── Core Lead Interface ──────────────────────────────────────────────────────

/**
 * Represents a single CRM lead record returned from the API.
 * Date fields use snake_case ISO strings to match the backend schema.
 */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  created_at: string; // ISO 8601 date-time string
  updated_at: string; // ISO 8601 date-time string
}

// ─── API Request / Response Payload Types ────────────────────────────────────

/** Fields required to create a new lead. */
export type CreateLeadPayload = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;

/** All lead fields are optional for a PATCH update. */
export type UpdateLeadPayload = Partial<CreateLeadPayload>;

// ─── Paginated Response ───────────────────────────────────────────────────────

export interface PaginatedLeads {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}

// ─── Filter / Query Options ───────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  page?: number;
  limit?: number;
}
