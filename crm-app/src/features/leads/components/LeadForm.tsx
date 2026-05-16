import { useState, useEffect, useId } from 'react';
import { LeadStatus, LeadSource } from '../types/lead.types';
import type { LeadStatus as LeadStatusType, LeadSource as LeadSourceType } from '../types/lead.types';
import { getAvailableTransitions, isStatusLocked } from '../utils/leadTransitions';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  source: LeadSourceType;
  status: LeadStatusType;
}

interface LeadFormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export interface LeadFormProps {
  /** Pre-filled values for edit mode. Leave undefined for create mode. */
  defaultValues?: Partial<LeadFormValues>;
  /** Called with the validated form values when the user submits. */
  onSubmit: (values: LeadFormValues) => Promise<void>;
  /** Label shown on the primary submit button (default: "Save"). */
  submitLabel?: string;
  /** Optional slot rendered before the submit button (e.g. a Cancel link). */
  cancelSlot?: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { label: string; value: LeadStatusType }[] = [
  { label: 'New', value: LeadStatus.NEW },
  { label: 'Contacted', value: LeadStatus.CONTACTED },
  { label: 'Qualified', value: LeadStatus.QUALIFIED },
  { label: 'Converted', value: LeadStatus.CONVERTED },
  { label: 'Lost', value: LeadStatus.LOST },
];

const SOURCE_OPTIONS: { label: string; value: LeadSourceType }[] = [
  { label: 'Website', value: LeadSource.WEBSITE },
  { label: 'Referral', value: LeadSource.REFERRAL },
  { label: 'Social Media', value: LeadSource.SOCIAL_MEDIA },
  { label: 'Cold Call', value: LeadSource.COLD_CALL },
  { label: 'Email Campaign', value: LeadSource.EMAIL_CAMPAIGN },
  { label: 'Other', value: LeadSource.OTHER },
];

const DEFAULT_VALUES: LeadFormValues = {
  name: '',
  email: '',
  phone: '',
  source: LeadSource.WEBSITE,
  status: LeadStatus.NEW,
};

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: LeadFormValues): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.phone && !/^[+\d\s\-().]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  return errors;
}

function hasErrors(errors: LeadFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3.5 shrink-0"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 6a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 6Zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  touched: boolean;
  children: React.ReactNode;
}

function FieldWrapper({ id, label, required, error, touched, children }: InputFieldProps) {
  const showError = touched && !!error;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="mt-1">{children}</div>
      {showError && <FieldError message={error} />}
    </div>
  );
}

// ─── Input class helpers ──────────────────────────────────────────────────────

function inputClass(touched: boolean, error?: string): string {
  const base =
    'block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors duration-150 focus:outline-none focus:ring-1';
  if (touched && error) {
    return `${base} border-red-400 bg-red-50 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500`;
  }
  return `${base} border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500`;
}

// ─── LeadForm ─────────────────────────────────────────────────────────────────

/**
 * Reusable lead form that works for both create and edit flows.
 *
 * Features:
 * - Inline field-level validation with error messages
 * - RFC-5322-style email validation regex
 * - Name and email are required; phone is optional but validated when present
 * - Submit button is disabled until all required fields are valid
 * - Loading spinner replaces the submit button label while the async onSubmit resolves
 * - cancelSlot prop accepts any ReactNode (e.g. a <Link> back button)
 * - defaultValues prop pre-fills the form for edit mode
 */
export default function LeadForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
  cancelSlot,
}: LeadFormProps) {
  const uid = useId(); // stable prefix for aria ids

  // ── State ──────────────────────────────────────────────────────────────────

  const [values, setValues] = useState<LeadFormValues>({
    ...DEFAULT_VALUES,
    ...defaultValues,
  });

  // Track which fields the user has blurred — errors only show after touch
  const [touched, setTouched] = useState<Record<keyof LeadFormErrors, boolean>>({
    name: false,
    email: false,
    phone: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Re-sync if parent swaps defaultValues (e.g. data loads after mount)
  useEffect(() => {
    if (defaultValues) {
      setValues((prev) => ({ ...prev, ...defaultValues }));
    }
  }, [defaultValues]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const errors = validate(values);
  const isFormValid = !hasErrors(errors);
  
  // Calculate allowed statuses
  const isEditMode = defaultValues !== undefined;
  const initialStatus = defaultValues?.status;
  
  let allowedStatuses = STATUS_OPTIONS;
  let statusIsLocked = false;
  
  if (isEditMode && initialStatus) {
    statusIsLocked = isStatusLocked(initialStatus);
    const validNext = getAvailableTransitions(initialStatus);
    // Include the initial status and any valid transitions
    allowedStatuses = STATUS_OPTIONS.filter(
      (opt) => opt.value === initialStatus || validNext.includes(opt.value)
    );
  } else if (!isEditMode) {
    // For new leads, maybe restrict to NEW? 
    // Usually new leads start as NEW, but if you want to let them select,
    // we can leave it or restrict it. Let's just allow NEW.
    allowedStatuses = STATUS_OPTIONS.filter((opt) => opt.value === LeadStatus.NEW);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange =
    <K extends keyof LeadFormValues>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setSubmitError(null);
    };

  const handleBlur = (field: keyof LeadFormErrors) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all validated fields as touched so errors become visible
    setTouched({ name: true, email: true, phone: true });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(values);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Lead form"
      className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

        {/* ── Name (required, full-width) ── */}
        <div className="sm:col-span-2">
          <FieldWrapper
            id={`${uid}-name`}
            label="Full Name"
            required
            error={errors.name}
            touched={touched.name}
          >
            <input
              id={`${uid}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={values.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              aria-required="true"
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={touched.name && errors.name ? `${uid}-name-error` : undefined}
              className={inputClass(touched.name, errors.name)}
            />
          </FieldWrapper>
        </div>

        {/* ── Email (required) ── */}
        <div>
          <FieldWrapper
            id={`${uid}-email`}
            label="Email"
            required
            error={errors.email}
            touched={touched.email}
          >
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              aria-required="true"
              aria-invalid={touched.email && !!errors.email}
              className={inputClass(touched.email, errors.email)}
            />
          </FieldWrapper>
        </div>

        {/* ── Phone (optional) ── */}
        <div>
          <FieldWrapper
            id={`${uid}-phone`}
            label="Phone"
            error={errors.phone}
            touched={touched.phone}
          >
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 000 0000"
              value={values.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              aria-invalid={touched.phone && !!errors.phone}
              className={inputClass(touched.phone, errors.phone)}
            />
          </FieldWrapper>
        </div>

        {/* ── Source ── */}
        <div>
          <label
            htmlFor={`${uid}-source`}
            className="block text-sm font-medium text-gray-700"
          >
            Source
          </label>
          <select
            id={`${uid}-source`}
            name="source"
            value={values.source}
            onChange={handleChange('source')}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Status ── */}
        <div>
          <label
            htmlFor={`${uid}-status`}
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id={`${uid}-status`}
            name="status"
            value={values.status}
            onChange={handleChange('status')}
            disabled={statusIsLocked}
            className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              statusIsLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
            }`}
          >
            {allowedStatuses.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── API-level submit error ── */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 shrink-0 mt-px"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
              clipRule="evenodd"
            />
          </svg>
          {submitError}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {cancelSlot}

        <button
          type="submit"
          id={`${uid}-submit`}
          disabled={isSubmitting || !isFormValid}
          aria-disabled={isSubmitting || !isFormValid}
          className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow transition-all duration-150 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              {/* Spinner */}
              <svg
                className="size-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                />
              </svg>
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
