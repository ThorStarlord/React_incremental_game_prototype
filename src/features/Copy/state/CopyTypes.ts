/**
 * @file CopyTypes.ts
 * @description Type definitions for the Copy system.
 */

import { PlayerStats } from '../../Player/state/PlayerTypes';

/**
 * Defines the growth method for a Copy.
 */
export type CopyGrowthType = 'normal' | 'accelerated';

/** A lightweight classification for Copy behavior. */
export type CopyRole = 'infiltrator' | 'researcher' | 'guardian' | 'agent' | 'none';

/**
 * States a task can be in during its lifecycle.
 */
export type CopyTaskStatus = 'idle' | 'running' | 'completed' | 'failed';

/** Minimal set of task types for MVP. */
export type CopyTaskType = 'timed' | 'gather_info' | 'train';

/** A single in‑progress or completed task for a Copy. */
export interface CopyTask {
  id: string;
  type: CopyTaskType;
  /** Seconds required to finish. */
  durationSeconds: number;
  /** Seconds progressed so far. */
  progressSeconds: number;
  status: CopyTaskStatus;
  /** Epoch ms when task started (if running). */
  startedAt?: number;
  /** Optional arbitrary payload for later integrations. */
  data?: Record<string, unknown>;
}

/** A single shareable trait slot on a Copy. */
export interface CopyTraitSlot {
  id: string;
  slotIndex: number;
  traitId: string | null;      // Trait shared from the player
  isLocked: boolean;
  unlockRequirement?: { type: 'maturity' | 'loyalty'; value: number };
}

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

  /** Player-shared traits applied to this Copy via slots. */
  traitSlots?: CopyTraitSlot[];
  /** Optional user preferences for which player traits this copy wants when available. */
  sharePreferences?: Record<string, boolean>;
  /** Optional role assignment controlling default tasks/behavior. */
  role?: CopyRole;
  /** Active task (MVP keeps one active at a time). */
  activeTask?: CopyTask | null;
  
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