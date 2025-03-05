import { GameState } from './types';
import { combatReducer } from './combatReducer';
import { craftingReducer } from './craftingReducer';
import { discoveryReducer } from './discoveryReducer';
import { essenceReducer } from './essenceReducer';
import factionReducer from './factionReducer';
import { gameTimeReducer } from './gameTimeReducer';
import { inventoryReducer } from './inventoryReducer';
import { npcReducer } from './npcReducer';
import resourcesReducer from './resourcesReducer';
import minionsReducer from './minionsReducer';
import { traitReducer } from './traitReducer';
import { worldReducer } from './worldReducer';
import { questReducer } from './questReducer';
import { playerReducer } from './playerReducer';
import locationReducer from './locationReducer';

// Map of action type prefixes to their corresponding reducers
const REDUCER_MAP: Record<string, Function> = {
  'combat': combatReducer,
  'crafting': craftingReducer,
  'discovery': (s: any, a: any) => ({ ...s, discovery: discoveryReducer(s.discovery, a) }),
  'essence': essenceReducer,
  'faction': (s: any, a: any) => ({ ...s, factions: factionReducer(s.factions, a) }),
  'gameTime': gameTimeReducer,
  'inventory': inventoryReducer,
  'npc': npcReducer,
  'resources': (s: any, a: any) => ({ ...s, resources: resourcesReducer(s.resources, a) }),
  'minions': (s: any, a: any) => ({ ...s, minions: minionsReducer(s.minions, a) }),
  'traits': traitReducer,
  'world': worldReducer,
  'quest': questReducer,
  'player': playerReducer,
  'location': (s: any, a: any) => ({ ...s, location: locationReducer(s.location, a) })
};

/**
 * Root reducer that combines all game state reducers
 * Processes actions through appropriate sub-reducers based on action type
 */
export const rootReducer = (state: GameState, action: { type: string; payload: any }): GameState => {
  // Extract action domain from type (e.g., "combat/attack" → "combat")
  const actionDomain = action.type.includes('/') ? action.type.split('/')[0] : '';
  
  // Find the appropriate reducer for this action domain
  const reducer = REDUCER_MAP[actionDomain];
  
  // If we have a specific reducer for this domain, use it
  if (reducer) {
    return reducer(state, action);
  }
  
  // For global actions, run through multiple reducers
  if (actionDomain === 'global') {
    return Object.values(REDUCER_MAP).reduce(
      (currentState, reducerFn) => reducerFn(currentState, action),
      state
    );
  }
  
  // Default case - no changes to state
  return state;
};
