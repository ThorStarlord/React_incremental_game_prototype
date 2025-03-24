/**
 * Root export file for combat types
 */

// Import enums from basic.ts which seems to exist
import { 
  DamageType, 
  ResourceType, 
  EnvironmentType, 
  CombatSource, 
  CombatTarget, 
  CombatActionType, 
  CombatActionResult, 
  CombatStatus 
} from './basic';

// Import from enemyTypes.ts which has at least one export
import { createDefaultEnemy } from './enemyTypes';

// Re-export the enums from basic.ts
export {
  DamageType,
  ResourceType,
  EnvironmentType,
  CombatSource,
  CombatTarget,
  CombatActionType,
  CombatActionResult,
  CombatStatus,
  createDefaultEnemy
};

// Define essential combat actor interfaces
export interface CombatActor {
  id: string;
  name: string;
  type: 'player' | 'enemy' | 'ally';
  currentHealth: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  critChance: number;
  dodgeChance: number;
  resistances: Record<string, number>;
  statusEffects: StatusEffect[];
  skills: ActiveSkill[];
}

export interface ManaUser extends CombatActor {
  mana: number;
  maxMana: number;
}

export interface Enemy extends CombatActor {
  type: 'enemy';
  enemyType: string;
  experience: number;
  gold: number;
  lootTable: LootItem[];
  abilities: any[];
  immunities: DamageType[];
  weaknesses: DamageType[];
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  imageUrl?: string;
}

export interface Player extends CombatActor, ManaUser {
  type: 'player';
  characterClass: string;
  experience: number;
  experienceToNextLevel: number;
  inventory: any[];
  stats: Record<string, number>;
}

// Define essential enemy interfaces
export interface EnemyBase {
  id: string;
  name: string;
  level: number;
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  category?: string;
  enemyType?: string;
  imageUrl?: string;
}

export interface RewardableEnemy extends EnemyBase {
  experience: number;
  gold: number;
  essence: number;
  lootTable: LootDrop[];
}

export interface DungeonEnemy extends RewardableEnemy {
  traits: string[];
  portrait?: string;
}

// Define essential item and skill interfaces
export interface LootDrop {
  id: string;
  name: string;
  quantity: number;
  dropChance: number;
  quality?: string;
  type?: string;
  value?: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  isAoE?: boolean;
  manaCost?: number;
  level?: number;
  effect?: any;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  strength?: number;
  type: 'buff' | 'debuff';
  damageOverTime?: number;
  damageType?: DamageType;
  statsModifier?: Record<string, number>;
  sourceId?: string;
  iconPath?: string;
}

export interface Effect {
  id: string;
  name: string;
  description?: string;
  duration: number;
  strength: number;
  type: 'buff' | 'debuff' | 'damage' | 'heal' | 'status';
  statusEffect?: StatusEffect;
  damageType?: DamageType;
}

export interface CombatEffect {
  id: string;
  name: string;
  duration: number;
  effect: {
    type: string;
    value: number;
  };
}

export interface ActiveSkill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  manaCost?: number;
  damage?: number;
  targeting: 'single' | 'aoe' | 'self';
  damageType?: DamageType;
  effects?: StatusEffect[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cooldown: number;
  manaCost: number;
}

export interface LootItem {
  id: string;
  name: string;
  quantity: number;
  rarity: string;
  type: string;
}

export interface CombatRewards {
  experience: number;
  gold: number;
  items: LootItem[];
  bonusLoot?: LootItem[]; // Add missing bonusLoot property to match rewards.ts
}

export interface CombatLogEntry {
  message: string;
  type: string;
  timestamp: number;
  importance: 'normal' | 'high';
}

export interface CombatLogData {
  entries: CombatLogEntry[];
  turnCount: number;
}

export interface CombatState {
  active: boolean;
  inCombat: boolean;
  playerTurn: boolean;
  round: number;
  combatants: CombatActor[];
  combatLog: CombatLogEntry[];
  rewards?: CombatRewards;
  activeEffects: Record<'player' | 'enemy', StatusEffect[]>;
  lastUpdated: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  environment: EnvironmentType;
  isAutoMode: boolean;
  status: CombatStatus;
  activeEnemy: Enemy | null;
  playerEffects: CombatEffect[];
  enemyEffects: CombatEffect[];
  turnQueue: CombatActor[];
  log: any[];
}

export interface CombatStateContainer {
  player: ManaUser;
  enemies: Enemy[];
  environment: EnvironmentType;
  rewards: CombatRewards;
  state: CombatState;
}

export interface ExtendedCombatState {
  active: boolean;
  playerTurn: boolean;
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
    [key: string]: any;
  };
  enemyStats?: {
    id: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    attack: number;
    defense: number;
    [key: string]: any;
  };
  skills?: ActiveSkill[];
  items?: {
    id: string;
    name: string;
    effect: any;
    quantity: number;
  }[];
  effects?: StatusEffect[];
  log: CombatLogEntry[];
  turnHistory?: {
    actor: 'player' | 'enemy';
    action: CombatActionType;
    result: CombatActionResult;
    timestamp: number;
  }[];
  rewards?: CombatRewards;
}

export interface HookCombatState extends ExtendedCombatState {
  calculateStats?: () => Record<string, number>;
}

// Export type aliases for backward compatibility
export type CombatEnemy = Enemy;
export type BaseEnemy = EnemyBase;
export type EnemyDrop = LootDrop;
export type EnemyAbility = Ability;
