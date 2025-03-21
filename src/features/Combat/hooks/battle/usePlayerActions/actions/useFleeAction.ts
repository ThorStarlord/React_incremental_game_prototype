import { useCallback } from 'react';
import { CombatActionType, CombatActionResult } from '../../../../../../context/types/combat';
import { PlayerActionProps } from '../types';
import { createTurnHistoryEntry } from '../utils/turnHistoryHelpers';

export const useFleeAction = ({
  combatState,
  setCombatState,
  processEndOfTurnEffects,
  onComplete,
  addLogEntry
}: PlayerActionProps) => {
  const handleFlee = useCallback(() => {
    // 50% chance to flee successfully
    const fleeSuccessful = Math.random() > 0.5;
    
    if (fleeSuccessful) {
      addLogEntry('You successfully fled from battle!', 'flee');
      
      setTimeout(() => {
        onComplete({
          victory: false,
          rewards: {
            experience: 0,
            gold: 0,
            items: []
          },
          retreat: true
        });
      }, 1000);
      
      setCombatState(prev => ({
        ...prev,
        active: false
      }));
    } else {
      addLogEntry('You failed to flee!', 'flee');
      
      setCombatState(prev => ({
        ...prev,
        playerTurn: false,
        turnHistory: [
          ...(prev.turnHistory || []),
          createTurnHistoryEntry('player', CombatActionType.Flee, CombatActionResult.Miss)
        ]
      }));
      
      // Process end of turn effects
      processEndOfTurnEffects();
    }
  }, [addLogEntry, onComplete, processEndOfTurnEffects, setCombatState]);

  const handlePlayerTurnEnd = useCallback(() => {
    if (!combatState.playerTurn) return;
    
    setCombatState(prev => ({
      ...prev,
      playerTurn: false
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState.playerTurn, processEndOfTurnEffects, setCombatState]);

  return { handleFlee, handlePlayerTurnEnd };
};
