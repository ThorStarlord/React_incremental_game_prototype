import type { PlayerState, PlayerStats } from '../state/PlayerTypes';
import type { RootState } from '../../../app/store';

/**
 * Calculate derived player statistics from current player state
 * @param playerState - Current player state from Redux
 * @returns Computed player statistics object
 */
export const getPlayerStats = (playerState: PlayerState): PlayerStats => {
  // FIXED: Destructure attributes and statusEffects directly.
  // The base stats are now the playerState itself.
  const { attributes, statusEffects } = playerState;

  // Calculate attribute-based bonuses
  const strengthBonus = Math.floor((attributes.strength - 10) / 2);
  const dexterityBonus = Math.floor((attributes.dexterity - 10) / 2);
  const intelligenceBonus = Math.floor((attributes.intelligence - 10) / 2);
  const constitutionBonus = Math.floor((attributes.constitution - 10) / 2);
  const wisdomBonus = Math.floor((attributes.wisdom - 10) / 2);

  // Calculate derived stats from attributes
  // FIXED: Reference stats directly from playerState
  const maxHealth = playerState.maxHealth + (constitutionBonus * 5);
  const maxMana = playerState.maxMana + (intelligenceBonus * 3);
  const attack = playerState.attack + strengthBonus;
  const defense = playerState.defense + constitutionBonus;
  const speed = playerState.speed + dexterityBonus;
  const healthRegen = playerState.healthRegen + (constitutionBonus * 0.1);
  const manaRegen = playerState.manaRegen + (wisdomBonus * 0.15);
  const criticalChance = Math.min(0.5, playerState.criticalChance + (dexterityBonus * 0.01));
  const criticalDamage = playerState.criticalDamage + (strengthBonus * 0.05);

  // Apply status effect modifiers
  let statusModifiers: Partial<PlayerStats> = {
    health: 0,
    mana: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    healthRegen: 0,
    manaRegen: 0,
    criticalChance: 0,
    criticalDamage: 0
  };

  statusEffects.forEach(effect => {
    if (effect.effects) {
      Object.entries(effect.effects).forEach(([stat, value]) => {
        if (stat in statusModifiers) {
          (statusModifiers as any)[stat] += value as number;
        }
      });
    }
  });

  return {
    health: Math.max(0, Math.min(maxHealth, playerState.health + (statusModifiers.health || 0))),
    maxHealth: Math.max(1, maxHealth),
    mana: Math.max(0, Math.min(maxMana, playerState.mana + (statusModifiers.mana || 0))),
    maxMana: Math.max(0, maxMana),
    attack: Math.max(0, attack + (statusModifiers.attack || 0)),
    defense: Math.max(0, defense + (statusModifiers.defense || 0)),
    speed: Math.max(0, speed + (statusModifiers.speed || 0)),
    healthRegen: Math.max(0, healthRegen + (statusModifiers.healthRegen || 0)),
    manaRegen: Math.max(0, manaRegen + (statusModifiers.manaRegen || 0)),
    criticalChance: Math.max(0, Math.min(1, criticalChance + (statusModifiers.criticalChance || 0))),
    criticalDamage: Math.max(1, criticalDamage + (statusModifiers.criticalDamage || 0))
  };
};

/**
 * Get player stats from Redux state
 * @param state - Root Redux state
 * @returns Computed player statistics
 */
export const getPlayerStatsFromState = (state: RootState): PlayerStats => {
  return getPlayerStats(state.player);
};