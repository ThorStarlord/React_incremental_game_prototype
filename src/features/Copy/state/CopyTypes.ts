/**
 * @file CopyTypes.ts
 * @description Type definitions for the Copy system.
 */

import { PlayerStats, RoutineFamiliarityId } from '../../Player/state/PlayerTypes';

/**
 * Defines the growth method for a Copy.
 */
export type CopyGrowthType = 'normal' | 'accelerated';

/** A lightweight classification for Copy behavior. */
export type CopyRole = 'infiltrator' | 'researcher' | 'guardian' | 'agent' | 'none';

/** Authored M20 production tasks that may be delegated to a Copy. */
export type CopyProductionTaskId = RoutineFamiliarityId;

export type CopyTaskOrigin =
  | { type: 'manual' }
  | { type: 'preferred_manual' }
  | {
      type: 'standing_order';
      routineId: CopyProductionTaskId;
      subjectId?: string;
    };

export type CopyStandingOrderCondition = {
  type: 'archive_verification_backlog';
  targetPending: number;
};

export interface CopyStandingOrder {
  enabled: boolean;
  condition: CopyStandingOrderCondition;
  enabledAtTick: number;
  lastTriggeredTick?: number;
}

export type ArchiveVerificationCaseStatus =
  | 'pending'
  | 'in_progress'
  | 'verified'
  | 'escalated';

export type ArchiveVerificationCaseClassification =
  | 'routine'
  | 'source_contradiction';

export interface ArchiveVerificationCase {
  id: string;
  status: ArchiveVerificationCaseStatus;
  classification: ArchiveVerificationCaseClassification;
  sourceIds: string[];
  createdAtTick: number;
  assignedCopyId?: string;
}

export type CopyExceptionStatus = 'open' | 'acknowledged' | 'resolved';
export type CopyExceptionSeverity = 'attention' | 'blocking';

export type CopyExceptionContext = {
  code: 'archive_source_contradiction';
  archiveCaseId: string;
  conflictingSourceIds: string[];
};

export interface CopyException {
  id: string;
  copyId: string;
  routineId: CopyProductionTaskId;
  severity: CopyExceptionSeverity;
  status: CopyExceptionStatus;
  detectedAtTick: number;
  detectedAtGameTimeMs: number;
  context: CopyExceptionContext;
  acknowledgedAtTick?: number;
  resolution?: {
    resolvedAtTick: number;
    action: 'player_resolved' | 'resume_order' | 'disable_order';
  };
}

/**
 * States a task can be in during its lifecycle.
 */
export type CopyTaskStatus = 'idle' | 'running' | 'completed' | 'failed';

/** Minimal set of task types for MVP. */
export type CopyTaskType = 'timed' | 'gather_info' | 'train';

/** A single in-progress or completed task for a Copy. */
export interface CopyTask {
  id: string;
  type: CopyTaskType;
  /** Authored production task identity. Absent only on legacy task state. */
  productionTaskId?: CopyProductionTaskId;
  /** Seconds required to finish. */
  durationSeconds: number;
  /** Seconds progressed so far. */
  progressSeconds: number;
  status: CopyTaskStatus;
  /** Epoch ms when task started (if running). */
  startedAt?: number;
  /** Logical GameLoop tick when execution began. */
  startedAtTick?: number;
  /** Typed provenance for manual, preferred, or standing-order execution. */
  origin?: CopyTaskOrigin;
  /** Optional arbitrary payload retained only for legacy integrations. */
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
  /**
   * Player-authored ordered allowlist for routine delegation. Optional keeps
   * historical saves valid; only authored CopyProductionTaskIds may persist.
   */
  routinePriority?: CopyProductionTaskId[];
  /**
   * Player-authored standing responsibilities. Optional for historical saves;
   * absence means no autonomous standing work is authorized.
   */
  standingOrders?: Partial<Record<CopyProductionTaskId, CopyStandingOrder>>;
  
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