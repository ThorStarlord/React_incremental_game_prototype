import { useState, useEffect } from 'react';
import { 
  ExtendedCombatState 
} from '../../../../context/types/gameStates/BattleGameStateTypes';

/**
 * Initial combat state
 */
export const initialCombatState: ExtendedCombatState = {
  active: true,
  playerTurn: true,
  round: 1,
  playerStats: {
    currentHealth: 0,
    maxHealth: 0,
    currentMana: 0,
    maxMana: 0
  },
  log: [],
  effects: [],
  turnHistory: [],
  skills: [],
  items: []
};

/**
 * Hook for managing the battle state
 */
export const useBattleState = (player: any, calculatedStats: any) => {
  // Initialize combat state with player stats
  const [combatState, setCombatState] = useState<ExtendedCombatState>({
    ...initialCombatState,
    playerStats: {
      currentHealth: player.health,
      maxHealth: player.maxHealth || calculatedStats?.maxHealth || 100,
      currentMana: player.mana || calculatedStats?.mana || 50,
      maxMana: player.maxMana || calculatedStats?.maxMana || 100
    }
  });

  return {
    combatState,
    setCombatState
  };
};
