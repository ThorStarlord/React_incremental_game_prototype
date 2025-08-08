/**
 * @file copyUtils.ts
 * @description Utility functions for the Copy system.
 */

import { COPY_SYSTEM } from '../../../constants/gameConstants';
import type { Copy } from '../state/CopyTypes';

/** Clamp a number between min and max. */
export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Generate a unique Copy ID. (Simple timestamp-based; can swap for uuid later.) */
export const generateCopyId = (): string => `copy_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

/** Generate a display name for a copy derived from NPC name. */
export const generateCopyName = (npcName: string, sequence?: number): string => {
  return sequence ? `${npcName} Echo ${sequence}` : `Copy of ${npcName}`;
};

/** Return true if copy meets maturity & loyalty thresholds for essence bonus. */
export const isQualifyingForEssenceBonus = (copy: Copy): boolean =>
  copy.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD && copy.loyalty > COPY_SYSTEM.LOYALTY_THRESHOLD;

/** Ensure maturity / loyalty values are clamped to system limits. */
export const normalizeCopyProgress = (copy: Copy): Copy => ({
  ...copy,
  maturity: clamp(copy.maturity, COPY_SYSTEM.MATURITY_MIN, COPY_SYSTEM.MATURITY_MAX),
  loyalty: clamp(copy.loyalty, COPY_SYSTEM.LOYALTY_MIN, COPY_SYSTEM.LOYALTY_MAX),
});

/** Apply growth to a copy returning new maturity (already clamped). */
export const applyGrowth = (current: number, delta: number, accelerated: boolean): number => {
  const base = current + delta * (accelerated ? COPY_SYSTEM.ACCELERATED_GROWTH_MULTIPLIER : 1);
  return clamp(base, COPY_SYSTEM.MATURITY_MIN, COPY_SYSTEM.MATURITY_MAX);
};

/** Apply loyalty decay returning new loyalty value (already clamped). */
export const applyLoyaltyDecay = (current: number, delta: number): number => {
  const value = current - delta;
  return clamp(value, COPY_SYSTEM.LOYALTY_MIN, COPY_SYSTEM.LOYALTY_MAX);
};
