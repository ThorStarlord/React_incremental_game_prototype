import { useCallback } from 'react';
import { StatusEffect, CombatActionType, CombatActionResult } from '../../../../../../context/types/combat';
import { PlayerActionProps } from '../types';
import { createLogEntry } from '../utils/logEntryFormatters';
import { createTurnHistoryEntry } from '../utils/turnHistoryHelpers';

export const useDefendAction = ({
  combatState,
  setCombatState,
  processEndOfTurnEffects
}: PlayerActionProps) => {
  const handleDefend = useCallback(() => {
    if (!combatState.playerTurn) return;
    
    // Apply defend effect (simple implementation)
    const defendEffect: StatusEffect = {
      id: 'defend',
      name: 'Defend',
      description: 'Reduces damage taken',
      duration: 1,
      strength: 0.5,
      type: 'buff'
    };
    
    setCombatState(prev => ({
      ...prev,
      effects: [...(prev.effects || []), defendEffect],
      playerTurn: false,
      turnHistory: [
        ...(prev.turnHistory || []),
        createTurnHistoryEntry(
          'player',
          CombatActionType.Defend,
          CombatActionResult.Block
        )
      ],
      log: [
        ...prev.log,
        createLogEntry('You take a defensive stance.', 'defend', 'normal')
      ]
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState.playerTurn, processEndOfTurnEffects, setCombatState]);

  return { handleDefend };
};
