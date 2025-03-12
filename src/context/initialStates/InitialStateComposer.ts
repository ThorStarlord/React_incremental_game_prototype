/**
 * @file Initial state configuration for the incremental RPG game
 * 
 * This file defines the starting state for a new game including:
 * - Player statistics and attributes (imported from PlayerInitialState)
 * - Resources and currencies
 * - Unlocked features and progression
 * - Skills, abilities and their levels
 * - Equipment slots and initial items
 * - Game settings and configuration
 */

import { 
  GameState, 
  PlayerState, 
  PlayerStats, 
  EquipmentState,
  InventoryItem
} from '../types/GameStateTypes';

// Import player state from the feature module
import { PlayerInitialState, DefaultPlayerAttributes, resetPlayerState } from './PlayerInitialState';

// Import other initial states
import statisticsInitialState from './StatisticsInitialState';
import notificationsInitialState from './NotificationsInitialState';
import settingsInitialState from './SettingsInitialState';
import progressionInitialState from './ProgressionInitialState';
import equipmentInitialState from './EquipmentInitialState';
import inventoryInitialState from './InventoryInitialState';
import metaInitialState from './MetaInitialState';

/**
 * Initial game state for a new player
 * @type {GameState}
 */
export const InitialState: GameState = {
  player: {
    ...PlayerInitialState.player,
    attributes: DefaultPlayerAttributes,
  },
  resources: {
    gold: 50,
    gems: 0,
    materials: {
      wood: 10,
      stone: 5,
      leather: 3,
      metal: 0,
      cloth: 5,
      herbs: 2
    }
  },
  skills: {
    combat: {
      swordplay: 1,
      archery: 0,
      defense: 1,
      dualWielding: 0
    },
    magic: {
      fireMagic: 0,
      iceMagic: 0,
      lightningMagic: 0,
      restoration: 1
    },
    crafting: {
      alchemy: 0,
      blacksmithing: 0,
      leatherworking: 0,
      enchanting: 0
    },
    gathering: {
      mining: 0,
      herbalism: 1,
      woodcutting: 1,
      fishing: 0
    }
  },
  inventory: inventoryInitialState,
  equipment: equipmentInitialState,
  progression: progressionInitialState,
  combat: {
    active: false,
    playerTurn: true, // Player goes first by default
    round: 1,
    log: [],
    rewards: undefined // Initialize as undefined if truly optional
  },
  settings: settingsInitialState,
  statistics: {
    current: statisticsInitialState,
    history: []
  },
  meta: metaInitialState,
  notifications: notificationsInitialState
};

/**
 * Reset the game state to initial values
 * @returns {GameState} A fresh copy of the initial state
 */
export const resetGameState = (): GameState => {
  const freshState = cloneInitialState();
  freshState.player = resetPlayerState(null);
  freshState.meta.playingSince = new Date().toISOString();
  return freshState;
};

/**
 * Reset player state to initial values
 */
export function resetPlayerState(playerState: PlayerState | null): PlayerState {
  if (!playerState) {
    return {
      // ...existing code...
    };
  }
  return playerState;
}

/**
 * Calculate experience required for a specific level
 * @param {number} level - The level to calculate for
 * @returns {number} Experience points required
 */
export const calculateExperienceForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Helper function to recalculate derived stats based on attributes and equipment
 * @param {PlayerState} playerState - Current player state
 * @param {EquipmentState} equipment - Currently equipped items
 * @returns {PlayerState} Updated player state
 */
export const recalculatePlayerStats = (
  playerState: PlayerState, 
  equipment: EquipmentState
): PlayerState => {
  const { attributes } = playerState;
  
  // Base stats from attributes
  const stats: PlayerStats = {
    health: playerState.stats.health,
    maxHealth: 50 + (attributes.vitality * 10),
    healthRegen: 0.5 + (attributes.vitality * 0.1),
    mana: playerState.stats.mana,
    maxMana: 25 + (attributes.intelligence * 5),
    manaRegen: 0.25 + (attributes.intelligence * 0.05),
    physicalDamage: attributes.strength,
    magicalDamage: attributes.intelligence * 0.8,
    critChance: attributes.luck + (attributes.dexterity * 0.2),
    critMultiplier: 1.5 + (attributes.luck * 0.05)
  };
  
  // Add equipment bonuses (would be implemented based on equipped items)
  const equipmentBonuses = calculateEquipmentBonuses(equipment);

  return {
    ...playerState,
    stats: {
      ...stats,
      ...equipmentBonuses
    }
  };
};

/**
 * Calculate equipment bonuses
 * @todo Implement actual equipment bonus calculations
 */
function calculateEquipmentBonuses(equippedItems: Record<string, string>): Partial<PlayerState['stats']> {
  // Implementation pending
  return {};
}

/**
 * Deep clone the initial state
 */
export function cloneInitialState(): GameState {
  // For better compatibility
  try {
    return structuredClone(InitialState);
  } catch (e) {
    // Fallback for environments without structuredClone
    return JSON.parse(JSON.stringify(InitialState));
  }
}

// Export types directly from their source instead of re-exporting
export type { GameState, PlayerState, PlayerStats, EquipmentState } from '../types/GameStateTypes;
