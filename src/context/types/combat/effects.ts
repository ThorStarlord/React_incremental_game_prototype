/**
 * Combat effects and status effects
 */

import { DamageType } from './basic';

/**
 * Status effect that can be applied to a combatant
 */
export interface StatusEffect {
  /** Unique identifier for the effect */
  id: string;
  
  /** Display name of the effect */
  name: string;
  
  /** Description of what the effect does */
  description: string;
  
  /** How long the effect lasts (turns) */
  duration: number;
  
  /** Strength/magnitude of the effect (e.g. 0.5 for 50% damage reduction) */
  strength?: number;
  
  /** Type of effect (buff or debuff) */
  type: 'buff' | 'debuff';
  
  /** Periodic damage applied by the effect */
  damageOverTime?: number;
  
  /** Type of damage for DoT effects */
  damageType?: DamageType;
  
  /** Changes to stats applied by the effect */
  statsModifier?: Record<string, number>;
  
  /** ID of the source that applied this effect */
  sourceId?: string;
  
  /** Path to the icon representing this effect */
  iconPath?: string;
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
