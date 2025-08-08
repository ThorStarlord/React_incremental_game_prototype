/**
 * @file copyUtils.ts
 * @description Utility functions for the Copy system.
 */
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import type { Copy } from '../state/CopyTypes';

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const applyGrowth = (current: number, baseDelta: number, accelerated: boolean): number => {
	const delta = baseDelta * (accelerated ? COPY_SYSTEM.ACCELERATED_GROWTH_MULTIPLIER : 1);
	return clamp(current + delta, COPY_SYSTEM.MATURITY_MIN, COPY_SYSTEM.MATURITY_MAX);
};

export const applyLoyaltyDecay = (current: number, decay: number): number => {
	return clamp(current - decay, COPY_SYSTEM.LOYALTY_MIN, COPY_SYSTEM.LOYALTY_MAX);
};

export const isQualifyingForEssenceBonus = (copy: Copy): boolean =>
	copy.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD && copy.loyalty > COPY_SYSTEM.LOYALTY_THRESHOLD;

// Keep file as a module even if tree-shaken
export {};
