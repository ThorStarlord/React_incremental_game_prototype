/**
 * @file Central initial state configuration for the incremental RPG game
 * 
 * This file serves as the single source of truth for all initial states in the game.
 * It imports and re-exports all initial states and composes them into a unified GameState.
 */

import { 
  GameState, 
  PlayerState, 
  PlayerStats, 
  EquipmentState
} from '../types/GameStateTypes';

// Import all initial states from their respective modules
import { PlayerInitialState, resetPlayerState as resetPlayer } from './PlayerInitialState';
import statisticsInitialState from './StatisticsInitialState';
import notificationsInitialState from './NotificationsInitialState';
import settingsInitialState from './SettingsInitialState';
import progressionInitialState from './ProgressionInitialState';
import equipmentInitialState from './EquipmentInitialState';
import inventoryInitialState from './InventoryInitialState';
import metaInitialState from './MetaInitialState';
import factionsInitialState from './FactionInitialState';
import essenceInitialState from './EssenceInitialState';
import traitsInitialState from './traitsInitialState';
import itemsInitialState from './itemsInitialState';
import resourceInitialState from './ResourceInitialState';


/**
 * Initial game state composed of all module states
 * @type {GameState}
 */
export const InitialState: GameState = {
  player: PlayerInitialState.player,
  resources: resourceInitialState,
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
  notifications: notificationsInitialState,
  factions: factionsInitialState,
  essence: essenceInitialState,
  traits: traitsInitialState,
  items: itemsInitialState
};

/**
 * Reset the game state to initial values
 * @returns {GameState} A fresh copy of the initial state
 */
export const resetGameState = (): GameState => {
  return structuredClone(InitialState);
};

/**
 * Reset player state to initial values
 */
export const resetPlayerState = (): PlayerState => {
  return resetPlayer(); // Use the function from PlayerInitialState
};

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
export const recalculatePlayerStats = (player: PlayerState): PlayerStats => {
  // Placeholder for actual stat calculation logic
  return {
    ...player.stats,
    // Add derived stats here
  };
};

/**
 * Calculate equipment bonuses
 * @todo Implement actual equipment bonus calculations with priority
 */
export const calculateEquipmentBonuses = (equipment: EquipmentState): PlayerStats => {
  // Placeholder for actual equipment bonus calculation
  return {
    // Add equipment bonuses here
  };
};

/**
 * Deep clone the initial state
 */
export function cloneInitialState(): GameState {
  return structuredClone(InitialState);
}

// Re-export all individual initial states for direct access when needed
export { 
  PlayerInitialState,
  statisticsInitialState,
  notificationsInitialState,
  settingsInitialState,
  progressionInitialState,
  equipmentInitialState,
  inventoryInitialState,
  metaInitialState,
  factionsInitialState,
  essenceInitialState,
  traitsInitialState,
  itemsInitialState,
  resourceInitialState
};

// Export types directly from their source
export type { GameState, PlayerState, PlayerStats, EquipmentState } from '../types/GameStateTypes;
