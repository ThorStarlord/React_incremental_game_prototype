/**
 * Basic enemy type definitions used in the game
 */

/**
 * Simple Enemy interface for basic enemy representation
 */
export interface Enemy {
  id: string;
  name: string;
  level?: number;
  health: number;
  maxHealth: number;
  currentHealth?: number;
  type?: 'normal' | 'elite' | 'boss';
  enemyType?: string;
  description?: string;
  lootTable?: any[];
  abilities?: any[];
  stats?: Record<string, number>;
  defense?: number;
  attack?: number;
  speed?: number;
  attackRate?: number;
  criticalChance?: number;
  criticalMultiplier?: number;
  drops?: any[];
  essenceValue?: number;
  experienceValue?: number;
  goldValue?: number;
  portrait?: string;
}