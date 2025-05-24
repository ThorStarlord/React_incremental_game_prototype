import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { EssenceState } from './EssenceTypes';

/**
 * Base selector for the essence state
 */
export const selectEssenceState = (state: RootState): EssenceState => state.essence;

/**
 * Select current essence amount
 */
export const selectEssenceAmount = createSelector(
  [selectEssenceState],
  (essence) => essence.amount
);

/**
 * Select total essence collected
 */
export const selectTotalEssence = createSelector(
  [selectEssenceState],
  (essence) => essence.totalCollected
);

/**
 * Select essence generation rate
 */
export const selectEssenceGenerationRate = createSelector(
  [selectEssenceState],
  (essence) => essence.generationRate
);

/**
 * Select essence per click value
 */
export const selectEssencePerClick = createSelector(
  [selectEssenceState],
  (essence) => essence.perClick * essence.multiplier
);

/**
 * Select essence multiplier
 */
export const selectEssenceMultiplier = createSelector(
  [selectEssenceState],
  (essence) => essence.multiplier
);

/**
 * Select NPC connections count
 */
export const selectNpcConnections = createSelector(
  [selectEssenceState],
  (essence) => essence.npcConnections
);

/**
 * Select last updated timestamp
 */
export const selectEssenceLastUpdated = createSelector(
  [selectEssenceState],
  (essence) => essence.lastUpdated
);

/**
 * Select essence generation statistics
 */
export const selectEssenceStats = createSelector(
  [selectEssenceState],
  (essence) => ({
    current: essence.amount,
    total: essence.totalCollected,
    generationRate: essence.generationRate,
    perClick: essence.perClick * essence.multiplier,
    multiplier: essence.multiplier,
    npcConnections: essence.npcConnections,
    lastUpdated: essence.lastUpdated,
  })
);

/**
 * Select whether enough essence is available for a purchase
 */
export const selectCanAffordEssence = createSelector(
  [selectEssenceAmount],
  (amount) => (cost: number) => amount >= cost
);

/**
 * Convenience selector for the entire essence state (alias)
 */
export const selectEssence = selectEssenceState;

/**
 * Select essence statistics for display in PlayerStats
 */
export const selectEssenceDisplayStats = createSelector(
  [selectEssenceState],
  (essence) => ({
    totalEssence: essence.totalCollected,
    essencePerClick: essence.perClick * essence.multiplier,
    essenceGenerationRate: essence.generationRate,
  })
);
