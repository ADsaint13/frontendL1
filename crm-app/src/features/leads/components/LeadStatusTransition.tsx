import { useState, useRef, useEffect } from 'react';
import { useUpdateLeadStatus } from '../hooks/useLeadMutations';
import type { Lead, LeadStatus } from '../types/lead.types';
import { getAvailableTransitions, isStatusLocked } from '../utils/leadTransitions';
import { humanize } from '../../../utils/formatters';

interface LeadStatusTransitionProps {
  lead: Lead;
}

export default function LeadStatusTransition({ lead }: LeadStatusTransitionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: updateStatus, isPending } = useUpdateLeadStatus(lead.id);

  const availableTransitions = getAvailableTransitions(lead.status);
  const isLocked = isStatusLocked(lead.status);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTransition = (newStatus: LeadStatus) => {
    updateStatus({ status: newStatus });
    setIsOpen(false);
  };

  if (isLocked) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
        </svg>
        Status Locked
      </span>
    );
  }

  if (availableTransitions.length === 0) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isPending ? 'Updating...' : 'Update Status'}
        <svg className="-mr-1 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {availableTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleTransition(status)}
                className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                  status === 'LOST' 
                    ? 'text-red-700 hover:bg-red-50' 
                    : status === 'CONVERTED'
                      ? 'text-green-700 hover:bg-green-50'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                role="menuitem"
              >
                Mark as {humanize(status)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
