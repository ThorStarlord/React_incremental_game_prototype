import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { StatusEffect } from '../../../../context/types/combat/basic';
import { createLogEntry } from './usePlayerActions/utils/logEntryFormatters';

/**
 * Hook for managing combat effects
 */
export const useEffects = (
  combatState: UnifiedCombatState,
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>
) => {
  /**
   * Process effects at the start of a turn
   */
  const processStartOfTurnEffects = useCallback(() => {
    if (!combatState.effects || combatState.effects.length === 0) return;

    // Make a copy of the effects array to work with
    const effects = [...combatState.effects];
    const newLogEntries = [];
    
    // Process effects that trigger at the start of a turn
    for (const effect of effects) {
      if (effect.type === 'buff' && effect.triggerTiming === 'start') {
        // Process buff effect
        newLogEntries.push({
          message: `${effect.name} is active.`,
          type: 'buff',
          importance: 'normal'
        });
      } else if (effect.type === 'debuff' && effect.triggerTiming === 'start') {
        // Process debuff effect
        newLogEntries.push({
          message: `${effect.name} is affecting you.`,
          type: 'debuff',
          importance: 'normal'
        });
      }
    }

    // Update state with processed effects
    if (newLogEntries.length > 0) {
      setCombatState(prev => ({
        ...prev,
        log: [
          ...prev.log,
          ...newLogEntries.map(entry => 
            createLogEntry(entry.message, entry.type, entry.importance)
          )
        ]
      }));
    }
  }, [combatState.effects, setCombatState]);

  /**
   * Process effects at the end of a turn
   */
  const processEndOfTurnEffects = useCallback(() => {
    if (!combatState.effects || combatState.effects.length === 0) return;

    // Make a copy of the effects array to work with
    let effects = [...combatState.effects];
    const newLogEntries = [];
    
    // Process each effect
    effects = effects.map(effect => {
      // Decrease duration
      const updatedEffect = {
        ...effect,
        duration: effect.duration - 1
      };

      // Add log entry for expiring effects
      if (updatedEffect.duration === 0) {
        newLogEntries.push({
          message: `${effect.name} has worn off.`,
          type: effect.type,
          importance: 'normal'
        });
      }
      
      return updatedEffect;
    }).filter(effect => effect.duration > 0); // Remove expired effects

    // Update state with processed effects
    setCombatState(prev => ({
      ...prev,
      effects,
      log: [
        ...prev.log,
        ...newLogEntries.map(entry => 
          createLogEntry(entry.message, entry.type, entry.importance)
        )
      ]
    }));
  }, [combatState.effects, setCombatState]);

  /**
   * Apply a new status effect
   */
  const applyStatusEffect = useCallback((effect: StatusEffect) => {
    // Check if effect already exists
    const existingEffectIndex = combatState.effects?.findIndex(e => e.id === effect.id) ?? -1;
    
    setCombatState(prev => {
      const currentEffects = prev.effects || [];
      let updatedEffects;
      
      if (existingEffectIndex >= 0) {
        // Update existing effect
        updatedEffects = [...currentEffects];
        updatedEffects[existingEffectIndex] = {
          ...updatedEffects[existingEffectIndex],
          duration: Math.max(updatedEffects[existingEffectIndex].duration, effect.duration),
          strength: Math.max(updatedEffects[existingEffectIndex].strength, effect.strength || 0)
        };
      } else {
        // Add new effect
        updatedEffects = [...currentEffects, effect];
      }
      
      return {
        ...prev,
        effects: updatedEffects,
        log: [
          ...prev.log,
          createLogEntry(`${effect.name} applied.`, effect.type, 'normal')
        ]
      };
    });
  }, [combatState.effects, setCombatState]);

  return {
    processStartOfTurnEffects,
    processEndOfTurnEffects,
    applyStatusEffect
  };
};
