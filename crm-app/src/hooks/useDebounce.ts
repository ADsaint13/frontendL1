import { useState, useEffect } from 'react';

/**
 * Delays updating the returned value until `delay` ms have passed
 * since the last change to `value`.
 *
 * Prevents firing a filter/search on every keystroke.
 *
 * @example
 * const debouncedSearch = useDebounce(searchInput, 300);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup on value/delay change
  }, [value, delay]);

  return debouncedValue;
}
