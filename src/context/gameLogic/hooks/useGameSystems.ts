import { useRelationshipSystem } from '../systems/relationshipSystem';
import { useResourceSystem } from '../systems/resourceSystem';
import { useTimeSystem } from '../systems/timeSystem';
import { useStatsSystem } from '../systems/statsSystem';
import { useEncounterSystem } from '../systems/encounterSystem';
import { useQuestSystem } from '../systems/questSystem';
import { useEnvironmentSystem } from '../systems/environmentSystem';
import { ExtendedGameState } from '../../types/gameStates/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook that combines all game systems
 * This provides a single entry point for all the game's background systems
 */
export const useGameSystems = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  // Initialize all systems
  useRelationshipSystem(gameState, dispatch);
  useResourceSystem(gameState, dispatch);
  useTimeSystem(gameState, dispatch);
  useStatsSystem(gameState, dispatch);
  useEncounterSystem(gameState, dispatch);
  useQuestSystem(gameState, dispatch);
  useEnvironmentSystem(gameState, dispatch);

  // Return nothing - all systems are managed internally via effects
};
