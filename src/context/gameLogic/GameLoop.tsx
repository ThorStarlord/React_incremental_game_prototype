import React, { ReactNode } from 'react';
import { useGameState } from '../GameStateContext';
import { useGameDispatch } from '../GameDispatchContext';
import { useGameSystems } from './hooks/useGameSystems';
import { ExtendedGameState } from '../types/gameLoopStateTypes';

/**
 * Props for GameLoop component
 */
interface GameLoopProps {
  children: ReactNode;
}

/**
 * GameLoop Component
 * 
 * Manages recurring game mechanics and time-based events using
 * modular system hooks for better organization and maintainability.
 * 
 * Each game system is isolated in its own module:
 * - Relationship system: NPC interactions and relationship changes
 * - Resource system: Passive resource generation
 * - Time system: Game time progression and time-based events
 * - Stats system: Player stats and skills progression
 * - Encounter system: Random combat encounters
 * - Quest system: Quest progress updates
 * - Environment system: Weather changes and world events
 */
const GameLoop: React.FC<GameLoopProps> = ({ children }) => {
  const gameState = useGameState() as ExtendedGameState;
  const dispatch = useGameDispatch();

  // Initialize all game systems 
  useGameSystems(gameState, dispatch);

  // Render children without any wrapper
  return <>{children}</>;
};

export default GameLoop;
