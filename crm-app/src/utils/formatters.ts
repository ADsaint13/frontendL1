import { LeadStatus, LeadSource } from '../types';

// ─── Status badge colour map ──────────────────────────────────────────────────

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
  [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',
  [LeadStatus.QUALIFIED]: 'bg-purple-100 text-purple-800',
  [LeadStatus.CONVERTED]: 'bg-green-100 text-green-800',
  [LeadStatus.LOST]: 'bg-red-100 text-red-800',
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: 'Website',
  [LeadSource.REFERRAL]: 'Referral',
  [LeadSource.SOCIAL_MEDIA]: 'Social Media',
  [LeadSource.COLD_CALL]: 'Cold Call',
  [LeadSource.EMAIL_CAMPAIGN]: 'Email Campaign',
  [LeadSource.OTHER]: 'Other',
};

// ─── Formatting helpers ───────────────────────────────────────────────────────

/**
 * Format a number as a USD currency string.
 * e.g. formatCurrency(12500) → "$12,500"
 */
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

/**
 * Format an ISO date string into a human-readable date.
 * e.g. formatDate("2024-01-15T10:00:00Z") → "Jan 15, 2024"
 */
export const formatDate = (isoString: string): string =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(isoString),
  );

/**
 * Capitalise the first letter of a string and replace underscores with spaces.
 */
export const humanize = (str: string): string =>
  str.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
