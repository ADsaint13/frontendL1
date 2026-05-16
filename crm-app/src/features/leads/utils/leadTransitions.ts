import { LeadStatus } from '../types/lead.types';

/**
 * Defines the allowed status transitions for a CRM lead.
 * 
 * Rules:
 * - NEW -> CONTACTED or LOST
 * - CONTACTED -> QUALIFIED or LOST
 * - QUALIFIED -> CONVERTED or LOST
 * - CONVERTED -> no transitions
 * - LOST -> no transitions
 */
const TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  [LeadStatus.NEW]: [LeadStatus.CONTACTED, LeadStatus.LOST],
  [LeadStatus.CONTACTED]: [LeadStatus.QUALIFIED, LeadStatus.LOST],
  [LeadStatus.QUALIFIED]: [LeadStatus.CONVERTED, LeadStatus.LOST],
  [LeadStatus.CONVERTED]: [],
  [LeadStatus.LOST]: [],
};

/**
 * Returns an array of statuses that the lead can transition to from the current status.
 */
export function getAvailableTransitions(currentStatus: LeadStatus): LeadStatus[] {
  return TRANSITIONS[currentStatus] || [];
}

/**
 * Checks if a transition from currentStatus to nextStatus is allowed.
 */
export function isValidTransition(currentStatus: LeadStatus, nextStatus: LeadStatus): boolean {
  return getAvailableTransitions(currentStatus).includes(nextStatus);
}

/**
 * Checks if the lead is in a locked state (cannot transition further).
 */
export function isStatusLocked(status: LeadStatus): boolean {
  return getAvailableTransitions(status).length === 0;
}
