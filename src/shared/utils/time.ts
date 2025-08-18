/**
 * Returns remaining time (whole seconds).
 * - If elapsedSeconds is provided, uses it directly.
 * - Otherwise, computes elapsed from startedAt and Date.now().
 * Returns null if required inputs are missing.
 */
export function getTimeRemaining(
  startedAt?: number,
  timeLimitSeconds?: number,
  elapsedSeconds?: number
): number | null {
  if (typeof timeLimitSeconds !== 'number') return null;
  const elapsed = typeof elapsedSeconds === 'number'
    ? elapsedSeconds
    : typeof startedAt === 'number'
      ? (Date.now() - startedAt) / 1000
      : null;
  if (elapsed === null) return null;
  return Math.max(0, Math.ceil(timeLimitSeconds - elapsed));
}
