/**
 * @file CopyTypes.ts
 * @description Type definitions for the Copy system.
 */

import { PlayerStats } from '../../Player/state/PlayerTypes';

/**
 * Defines the growth method for a Copy.
 */
export type CopyGrowthType = 'normal' | 'accelerated';

/**
 * Represents a single Copy entity.
 */
export interface Copy {
  id: string;              // Unique ID for the Copy
  name: string;            // The Copy's name
  createdAt: number;       // Timestamp of creation
  parentNPCId: string;     // The ID of the NPC this Copy was created from
  
  growthType: CopyGrowthType;
  maturity: number;        // A value from 0 to 100 representing growth progress
  loyalty: number;         // A value from 0 to 100
  
  // A Copy has its own stats, inherited or developed over time
  stats: PlayerStats;
  
  // Traits the Copy inherited at creation
  inheritedTraits: string[];
  
  // The current task the copy is assigned to (optional)
  currentTask?: string;
  location: string;        // Where the Copy currently is
}

/**
 * The state for the Copies feature slice.
 */
export interface CopiesState {
  copies: Record<string, Copy>; // All created copies, indexed by ID
  isLoading: boolean;
  error: string | null;
}