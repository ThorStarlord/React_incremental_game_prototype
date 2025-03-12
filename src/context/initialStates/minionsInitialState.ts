/**
 * @file minionsInitialState.ts
 * @description Defines the initial state for the Minions feature in the game.
 * Minions are entities that can be assigned tasks and assist the player in various ways.
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
    };
    abilities?: string[];
    specialization?: string[];
  };
  unlocked: boolean;
  cooldown: number;
  locationId?: string;
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
}

/**
 * Interface for minions state
 */
export interface MinionsState {
  minions: Record<string, Minion>;
  availableTasks: MinionTask[];
  upgrades: Record<string, MinionUpgrade>;
  maxMinionSlots: number;
  unlockedMinionSlots: number;
  nextSlotCost: number;
  config: {
    autoAssign: boolean;
    notifyOnCompletion: boolean;
    defaultAssignment: string;
  };
  lastUpdate: number;
}

/**
 * Initial state for the Minions feature
 */
const minionsInitialState: MinionsState = {
  minions: {},
  availableTasks: [],
  upgrades: {},
  maxMinionSlots: 10,
  unlockedMinionSlots: 1,
  nextSlotCost: 100,
  config: {
    autoAssign: false,
    notifyOnCompletion: true,
    defaultAssignment: 'idle'
  },
  lastUpdate: 0
};

export default minionsInitialState;
