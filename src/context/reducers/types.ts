/**
 * Shared type definitions for state reducers
 */

// Common interfaces for state objects
export interface BaseState {
  id: string;
  [key: string]: any;
}

export interface PlayerState {
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  inventory: InventoryItem[];
  equippedItems?: Record<string, string>;
  attributes?: Record<string, number>;
  attributePoints?: number;
  skills?: Skill[];
  acquiredTraits?: string[];
  equippedTraits?: string[];
  activeEffects?: StatusEffect[];
  stats?: Record<string, any>;
  [key: string]: any;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  quality?: string;
  acquired?: {
    timestamp: number;
    source: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Skill {
  id: string;
  level: number;
  experience: number;
  [key: string]: any;
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  strength?: number;
  [key: string]: any;
}

export interface GameState {
  player: PlayerState;
  essence: {
    amount: number;
    [key: string]: any;
  };
  gameData?: {
    [key: string]: any;
  };
  stats?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ActionType<T = any> {
  type: string;
  payload: T;
}
