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
  EquipmentState,
  InventoryItem
} from '../types/GameStateTypes';

// Import all initial states from their respective modules
import { PlayerInitialState, resetPlayerState as resetPlayer, DefaultPlayerAttributes } from './PlayerInitialState';
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
import resourceInitialState from './ResourceInitialState';
import combatInitialState from './CombatInitialState';
import worldInitialState from './WorldInitialState';

/**
 * Initial game state composed of all module states
 * @type {GameState}
 */
export const InitialState: GameState = {
  player: {
    ...PlayerInitialState.player,
    attributes: {
      ...PlayerInitialState.player.attributes,
      ...DefaultPlayerAttributes
    }
  },
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
  combat: combatInitialState,
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
  // Removed the 'items: itemsInitialState' property as it's not in the GameState interface
  world: worldInitialState,
  // Keep any other valid properties
  quests: { 
    activeQuests: [], 
    completedQuests: [], 
    failedQuests: [], 
    availableQuests: [], 
    questLog: [],
    dailyReset: 0,
    weeklyReset: 0
  }
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
 * @todo Consider moving this to src/features/player/utils/experienceUtils.ts
 */
export const calculateExperienceForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Helper function to recalculate derived stats based on attributes and equipment
 * @param {PlayerState} playerState - Current player state
 * @param {EquipmentState} equipment - Currently equipped items
 * @returns {PlayerState} Updated player state
 * @todo Consider moving this to src/features/player/utils/playerUtils.ts
 */
export const recalculatePlayerStats = (player: PlayerState): PlayerStats => {
  // Calculate derived stats from player attributes
  const derivedStats: Partial<PlayerStats> = {
    maxHealth: 100 + (player.attributes.vitality * 10),
    healthRegen: 0.5 + (player.attributes.vitality * 0.1),
    maxMana: 50 + (player.attributes.intelligence * 10),
    manaRegen: 0.5 + (player.attributes.intelligence * 0.1),
    physicalDamage: 5 + (player.attributes.strength * 0.5),
    magicalDamage: 2 + (player.attributes.intelligence * 0.5),
    critChance: 5 + (player.attributes.luck * 0.5),
    critMultiplier: 1.5 + (player.attributes.luck * 0.05),
  };
  
  return {
    ...player.stats,
    ...derivedStats
  };
};

/**
 * Calculate equipment bonuses
 * @param {EquipmentState} equipment - Currently equipped items
 * @returns {PlayerStats} Stat bonuses from equipment
 */
export const calculateEquipmentBonuses = (equipment: EquipmentState): Partial<PlayerStats> => {
  // Initialize empty stat bonuses
  const bonuses: Partial<PlayerStats> = {
    maxHealth: 0,
    healthRegen: 0,
    maxMana: 0,
    manaRegen: 0,
    physicalDamage: 0,
    magicalDamage: 0,
    critChance: 0,
    critMultiplier: 0
  };
  
  // Iterate through each equipment slot
  Object.values(equipment).forEach(item => {
    if (item && item.stats) {
      // Add each stat bonus from the item
      Object.entries(item.stats).forEach(([key, value]) => {
        if (key in bonuses && typeof value === 'number') {
          bonuses[key as keyof PlayerStats] = 
            (bonuses[key as keyof PlayerStats] as number) + value;
        }
      });
    }
  });
  
  return bonuses;
};

// Export types directly from their source
export type { GameState, PlayerState, PlayerStats, EquipmentState, InventoryItem } from '../types/GameStateTypes';
