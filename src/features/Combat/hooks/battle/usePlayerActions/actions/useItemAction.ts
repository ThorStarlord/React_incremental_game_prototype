import { useCallback } from 'react';
import { PlayerActionProps } from '../types';

export const useItemAction = ({
  combatState,
  setCombatState,
  processEndOfTurnEffects,
  addLogEntry
}: PlayerActionProps) => {
  const handleUseItem = useCallback((itemId: string) => {
    if (!combatState.playerTurn) return;
    
    const item = combatState.items?.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) {
      return;
    }
    
    // Apply item effects
    addLogEntry(`You use ${item.name}!`, 'item');
    
    // Update item quantity
    setCombatState(prev => {
      const updatedItems = prev.items?.map(i => 
        i.id === itemId 
          ? { ...i, quantity: i.quantity - 1 } 
          : i
      ).filter(i => i.quantity > 0);
      
      return {
        ...prev,
        items: updatedItems,
        playerTurn: false
      };
    });
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [
    combatState.playerTurn, 
    combatState.items,
    addLogEntry, 
    processEndOfTurnEffects,
    setCombatState
  ]);

  return { handleUseItem };
};
