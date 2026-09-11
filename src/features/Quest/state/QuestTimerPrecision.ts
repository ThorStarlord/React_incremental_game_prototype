const QUEST_TIMEOUT_COMPARISON_ULP_MULTIPLIER = 4;

/**
 * Return true when elapsed Quest time has reached an authored limit, allowing
 * only machine-scale floating-point representation noise at the boundary.
 *
 * The tolerance is relative to the magnitude of the compared seconds values
 * and remains far below any supported GameLoop fixed step. It is intentionally
 * comparison-only: accumulated and persisted timer values are never rounded,
 * clamped, or rewritten here.
 */
export const hasReachedQuestTimeLimit = (
  elapsedSeconds: number,
  timeLimitSeconds: number
): boolean => {
  if (elapsedSeconds >= timeLimitSeconds) {
    return true;
  }

  if (!Number.isFinite(elapsedSeconds) || !Number.isFinite(timeLimitSeconds)) {
    return false;
  }

  const magnitude = Math.max(
    1,
    Math.abs(elapsedSeconds),
    Math.abs(timeLimitSeconds)
  );
  const tolerance =
    Number.EPSILON * magnitude * QUEST_TIMEOUT_COMPARISON_ULP_MULTIPLIER;

  return timeLimitSeconds - elapsedSeconds <= tolerance;
};
