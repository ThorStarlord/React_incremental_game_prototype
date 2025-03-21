/**
 * Central initial state composition for the incremental RPG game.
 * 
 * This file composes all module-specific initial states into a unified GameState
 * that serves as the single source of truth for the game.
 */

import { GameState } from '../types/GameStateTypes';
import { createImmutableState, validateInitialState } from '../utils/stateUtils';

// Import all initial states - using explicit imports for better readability and control
import { PlayerInitialState } from './PlayerInitialState';
import statisticsInitialState from './StatisticsInitialState';
import notificationsInitialState from './NotificationsInitialState';
import settingsInitialState from './SettingsInitialState';
import progressionInitialState from './ProgressionInitialState';
import equipmentInitialState from './EquipmentInitialState';
import inventoryInitialState from './InventoryInitialState';
import metaInitialState from './MetaInitialState';
import factionsInitialState from './FactionInitialState';
import essenceInitialState from './EssenceInitialState';
import traitsInitialState from './TraitsInitialState';
import resourceInitialState from './ResourceInitialState';
import combatInitialState from './CombatInitialState';
import worldInitialState from './WorldInitialState';
import skillsInitialState from './SkillsInitialState';
import questsInitialState from './QuestsInitialState';

/**
 * State module definition with key and validation function
 */
interface StateModule {
  key: keyof GameState;
  state: any;
}

/**
 * Array of all state modules to be composed into the initial state
 */
const stateModules: StateModule[] = [
  { key: 'player', state: PlayerInitialState },
  { key: 'statistics', state: { current: statisticsInitialState, history: [] } },
  { key: 'notifications', state: notificationsInitialState },
  { key: 'settings', state: settingsInitialState },
  { key: 'progression', state: progressionInitialState },
  { key: 'equipment', state: equipmentInitialState },
  { key: 'inventory', state: inventoryInitialState },
  { key: 'meta', state: metaInitialState },
  { key: 'factions', state: factionsInitialState },
  { key: 'essence', state: essenceInitialState },
  { key: 'traits', state: traitsInitialState },
  { key: 'resources', state: resourceInitialState },
  { key: 'combat', state: combatInitialState },
  { key: 'world', state: worldInitialState },
  { key: 'skills', state: skillsInitialState },
  { key: 'quests', state: questsInitialState }
];

/**
 * Validate all initial state modules
 */
const validateAllModules = () => {
  console.log('Validating initial state modules...');
  
  for (const module of stateModules) {
    try {
      // Validate individual module
      validateInitialState(module.state, module.key.toString());
    } catch (error) {
      console.error(`Error validating ${module.key} state:`, error);
      throw new Error(`Invalid initial state for ${module.key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log('All initial state modules validated successfully');
};

// Run validation during development but not in production
if (process.env.NODE_ENV !== 'production') {
  validateAllModules();
}

/**
 * Compose all state modules into a complete GameState
 */
const composeInitialState = (): GameState => {
  const state: Partial<GameState> = {};
  
  // Combine all modules into a single state object
  for (const module of stateModules) {
    state[module.key] = module.state;
  }
  
  return state as GameState;
};

/**
 * The composed initial game state - frozen to prevent unintended modifications
 * This is the single source of truth for the game's initial state.
 */
export const InitialState: Readonly<GameState> = createImmutableState(composeInitialState());

export default InitialState;
