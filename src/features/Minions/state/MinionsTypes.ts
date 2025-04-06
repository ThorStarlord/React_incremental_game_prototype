/**
 * Types for the Minions slice of the Redux store
 */

/**
 * Interface for minion ability
 */
export interface MinionAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  unlockLevel: number;
  effect: {
    type: string;
    value: number;
    duration?: number;
  };
}

/**
 * Interface for minion assignment
 */
export interface MinionAssignment {
  id: string;
  type: 'gathering' | 'crafting' | 'exploration' | 'combat' | 'idle';
  locationId?: string;
  resourceId?: string;
  taskId?: string;
  startTime: number;
  duration: number;
  completed: boolean;
  progress?: number;
  rewards?: {
    resources?: Record<string, number>;
    items?: Record<string, number>;
    experience: number;
  };
}

/**
 * Interface for minion specialization
 */
export interface MinionSpecialization {
  id: string;
  name: string;
  description: string;
  bonuses: {
    [statName: string]: number;
  };
  tasks: string[];
}

/**
 * Interface for minion entity
 */
export interface Minion {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
    stamina: number;
    [key: string]: number;
  };
  abilities: MinionAbility[];
  assignment: MinionAssignment | null;
  unlocked: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  specialization?: string;
  loyalty: number;
  fatigue: number;
  recoveryRate: number;
  imageUrl?: string;
  createdAt?: number;
  traits?: string[];
  lastFed?: number;
  status?: string;
}

/**
 * Interface for minion task
 */
export interface MinionTask {
  id: string;
  name: string;
  description: string;
  duration: number;
  requiredLevel: number;
  rewards: {
    resources?: Record<string, number>;
    items?: Record<string, number>;
    experience: number;
  };
  requirements: {
    stats?: {
      strength?: number;
      dexterity?: number;
      intelligence?: number;
      stamina?: number;
      [key: string]: number | undefined;
    };
    abilities?: string[];
    specialization?: string[];
  };
  unlocked: boolean;
  cooldown: number;
  locationId?: string;
  efficiency?: number;
  failureChance?: number;
  minEfficiency?: number;
}

/**
 * Interface for minion upgrade
 */
export interface MinionUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: {
    type: string;
    value: number;
  };
  purchased: boolean;
  requiredLevel: number;
  maxLevel?: number;
  currentLevel?: number;
}

/**
 * Interface for minion trait
 */
export interface MinionTrait {
  id: string;
  name: string;
  description: string;
  bonuses?: {
    [statName: string]: number;
  };
  penalties?: {
    [statName: string]: number;
  };
  compatible?: string[];
  incompatible?: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

/**
 * Interface for the minions state in Redux
 */
export interface MinionsState {
  minions: Record<string, Minion>;
  availableTasks: MinionTask[];
  upgrades: Record<string, MinionUpgrade>;
  traits: Record<string, MinionTrait>;
  specializations: Record<string, MinionSpecialization>;
  maxMinionSlots: number;
  unlockedMinionSlots: number;
  nextSlotCost: number;
  config: {
    autoAssign: boolean;
    notifyOnCompletion: boolean;
    defaultAssignment: string;
  };
  lastUpdate: number;
  isLoading: boolean;
  error: string | null;
  selectedMinionId: string | null;
  simulation: {
    running: boolean;
    interval: number;
    lastProcessed: number;
  };
}

/**
 * Payload for creating a new minion
 */
export interface CreateMinionPayload {
  name: string;
  type: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  traits?: string[];
}

/**
 * Payload for updating a minion
 */
export interface UpdateMinionPayload {
  minionId: string;
  updates: Partial<Omit<Minion, 'id'>>;
}

/**
 * Payload for assigning a task to a minion
 */
export interface AssignTaskPayload {
  minionId: string;
  taskId: string;
  locationId?: string;
}

/**
 * Payload for completing a task
 */
export interface CompleteTaskPayload {
  minionId: string;
  success: boolean;
  rewards?: {
    resources?: Record<string, number>;
    items?: Record<string, number>;
    experience: number;
  };
}

/**
 * Payload for adding experience to a minion
 */
export interface AddExperiencePayload {
  minionId: string;
  amount: number;
}

/**
 * Payload for upgrading a minion stat
 */
export interface UpgradeStatPayload {
  minionId: string;
  stat: string;
  amount: number;
  cost: number;
}

/**
 * Payload for adding a trait to a minion
 */
export interface AddTraitPayload {
  minionId: string;
  traitId: string;
}

/**
 * Payload for removing a trait from a minion
 */
export interface RemoveTraitPayload {
  minionId: string;
  traitId: string;
}

/**
 * Payload for feeding a minion
 */
export interface FeedMinionPayload {
  minionId: string;
  foodId: string;
  quality: number;
}

/**
 * Payload for purchasing an upgrade
 */
export interface PurchaseUpgradePayload {
  upgradeId: string;
  cost: number;
}

/**
 * Payload for removing a minion
 */
export interface RemoveMinionPayload {
  minionId: string;
}

/**
 * Payload for updating configuration
 */
export interface UpdateConfigPayload {
  config: Partial<MinionsState['config']>;
}

/**
 * Payload for updating simulation settings
 */
export interface UpdateSimulationSettingsPayload {
  running?: boolean;
  interval?: number;
}

/**
 * Payload for unlocking a minion slot
 */
export interface UnlockSlotPayload {
  cost: number;
}

/**
 * Payload for unlocking a new task
 */
export interface UnlockTaskPayload {
  taskId: string;
  cost: number;
}

/**
 * Payload for processing simulation tick
 */
export interface ProcessSimulationTickPayload {
  timestamp: number;
}
