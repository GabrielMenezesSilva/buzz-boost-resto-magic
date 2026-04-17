import { useEffect, useRef, useCallback } from 'react';

/** Events that count as user activity and reset the timeout timer */
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
];

interface UsePinTimeoutOptions {
  /** Inactivity duration in milliseconds before auto-logout. Default: 15 min */
  timeoutMs?: number;
  /** Whether the timeout is currently active (e.g. only when an employee is logged in) */
  enabled: boolean;
  /** Callback invoked when the timeout fires */
  onTimeout: () => void;
}

/**
 * usePinTimeout
 *
 * Monitors user activity on the window. If no activity is detected within
 * `timeoutMs` milliseconds, `onTimeout` is called — intended to clear the
 * active employee PIN session so the POS requires re-authentication.
 *
 * The timer resets on any of the ACTIVITY_EVENTS listed above.
 */
export function usePinTimeout({
  timeoutMs = 15 * 60 * 1000, // 15 minutes default
  enabled,
  onTimeout,
}: UsePinTimeoutOptions): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep callback ref up-to-date without re-registering event listeners
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const resetTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onTimeoutRef.current();
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (!enabled) {
      // Clear any running timer when disabled (employee logged out)
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start the timer immediately when enabled
    resetTimer();

    // Register activity listeners
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true }),
    );

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [enabled, resetTimer]);
}
