/**
 * Types for the Combat slice of the Redux store
 */

/**
 * Combat log entry for tracking actions and events
 */
export interface SimpleLogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: string;
  importance: 'normal' | 'high';
}

/**
 * Status effect that can be applied to combatants
 */
export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  strength: number;
  type: 'buff' | 'debuff' | 'dot' | 'hot';
}

/**
 * Difficulty levels for combat
 */
export type CombatDifficulty = 'easy' | 'normal' | 'hard' | 'nightmare';

/**
 * Combat actor stats (both player and enemies)
 */
export interface CombatStats {
  currentHealth: number;
  maxHealth: number;
  currentMana?: number;
  maxMana?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  level?: number;
}

/**
 * Combat skill with cooldown management
 */
export interface CombatSkill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  manaCost: number;
  damage?: number;
  targeting: 'single' | 'aoe' | 'self';
  effects?: StatusEffect[];
}

/**
 * Combat item
 */
export interface CombatItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  uses: 'combat' | 'adventure' | 'both';
  effect?: string;
  power?: number;
}

/**
 * Enemy data for combat
 */
export interface CombatEnemy {
  id: string;
  name: string;
  level: number;
  currentHealth: number;
  maxHealth: number;
  attack: number;
  defense: number;
  imageUrl?: string;
  traits?: string[];
  rewards?: CombatRewards;
}

/**
 * Rewards from combat
 */
export interface CombatRewards {
  experience: number;
  gold: number;
  essence?: number;
  items: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

/**
 * Combat result when combat ends
 */
export interface CombatResult {
  victory: boolean;
  rewards?: CombatRewards;
  retreat?: boolean;
}

/**
 * State for the Combat slice
 */
export interface CombatState {
  // Is combat active?
  active: boolean;
  
  // Turn management
  playerTurn: boolean;
  round: number;
  
  // Combatant stats
  playerStats: CombatStats;
  enemyStats?: CombatEnemy;
  
  // Combat resources
  skills: CombatSkill[];
  items: CombatItem[];
  effects: StatusEffect[];
  
  // Combat location and details
  dungeonId?: string;
  difficulty: CombatDifficulty;
  encounter: number;
  totalEncounters: number;
  
  // Combat log
  log: SimpleLogEntry[];
  
  // Results
  result: CombatResult | null;
  
  // Loading state
  loading: boolean;
}

/**
 * Payload for starting combat
 */
export interface StartCombatPayload {
  dungeonId: string;
  difficulty: CombatDifficulty;
  enemyLevel?: number;
  encounter?: number;
  totalEncounters?: number;
}

/**
 * Payload for executing a combat action
 */
export interface CombatActionPayload {
  actionType: 'attack' | 'defend' | 'skill' | 'item' | 'flee';
  targetId?: string;
  skillId?: string;
  itemId?: string;
}

/**
 * Payload for ending combat
 */
export interface EndCombatPayload {
  result: CombatResult;
}
