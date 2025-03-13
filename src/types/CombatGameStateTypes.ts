export enum CombatStatus {
  NOT_STARTED = 'not_started',
  PLAYER_TURN = 'player_turn',
  ENEMY_TURN = 'enemy_turn',
  VICTORY = 'victory',
  DEFEAT = 'defeat'
}

export interface CombatLogEntry {
  timestamp: string;
  message: string;
  type: 'system' | 'attack' | 'defense' | 'special';
  importance: 'normal' | 'high';
}

export interface CombatRewards {
  experience: number;
  gold: number;
  items: InventoryItem[];
}

export interface CombatState {
  active: boolean;
  status: CombatStatus;
  round: number;
  playerTurn: boolean;
  activeEnemy: Enemy | null;
  playerEffects: StatusEffect[];
  enemyEffects: StatusEffect[];
  log: CombatLogEntry[];
  rewards: CombatRewards;
}

// Define other related types like Enemy, StatusEffect, InventoryItem, etc.
// ...existing code...
