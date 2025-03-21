/**
 * Combat effects and status effects
 */

import { DamageType } from './basic';

/**
 * Status effect that can be applied during combat
 */
export interface StatusEffect {
  id: string;               // Unique identifier
  name: string;             // Display name
  description: string;      // Description of effect
  duration: number;         // Number of turns effect lasts
  strength?: number;        // Power/magnitude of the effect
  type: 'buff' | 'debuff';  // Whether it's beneficial or harmful
  damageOverTime?: number;  // Damage applied each turn
  damageType?: DamageType;  // Type of damage dealt
  statsModifier?: Record<string, number>; // Stat modifications
  sourceId?: string;        // ID of the entity that applied this effect
  iconPath?: string;        // Path to icon for UI display
}

/**
 * Effect that can be applied by skills or abilities
 */
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

/**
 * Status effect in combat (simplified version)
 */
export interface CombatEffect {
  id: string;
  name: string;
  duration: number;
  effect: {
    type: string;
    value: number;
  };
}
