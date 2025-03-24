import { useCallback, useEffect } from 'react';
import { ACTION_TYPES } from '../../../context/GameStateExports';
import { ExtendedCombatState, UseCombatLogicProps } from '../../../context/types/gameStates/CombatGameStateTypes';
import { SimpleLogEntry } from '../../../context/types/combat/simpleLogging';
import { createLogEntry } from './battle/usePlayerActions/utils/logEntryFormatters';

/**
 * Hook to handle combat logic
 */
export const useCombatLogic = ({
  combatState,
  setCombatState,
  player,
  dispatch,
  calculatedStats,
  modifiers,
  showTraitEffect,
  onVictory,
  onDefeat
}: UseCombatLogicProps) => {
  // Ensure we have playerStats to avoid undefined errors
  if (!combatState.playerStats) {
    combatState.playerStats = {
      currentHealth: player?.stats?.health || 100,
      maxHealth: player?.stats?.maxHealth || 100,
      currentMana: player?.stats?.mana || 50,
      maxMana: player?.stats?.maxMana || 50
    };
  }

  // Add log entry helper function
  const addLogEntry = useCallback((message: string, type: string = 'info', importance: 'normal' | 'high' = 'normal') => {
    setCombatState((prevState: ExtendedCombatState) => ({
      ...prevState,
      log: [
        ...prevState.log,
        createLogEntry(message, type, importance)
      ]
    }));
  }, [setCombatState]);

  // Process end of turn effects
  const processEndOfTurnEffects = useCallback(() => {
    // Implement effect processing logic here, e.g.:
    // - Decrease effect durations
    // - Apply effects like DoT or HoT
    // - Remove expired effects
    
    // This is a simplified version, in real implementation you'd want to handle
    // more sophisticated effect processing
    if (combatState.effects && combatState.effects.length > 0) {
      setCombatState(prevState => {
        // Process and update effects here
        const updatedEffects = prevState.effects?.map(effect => ({
          ...effect,
          duration: effect.duration > 0 ? effect.duration - 1 : 0
        })).filter(effect => effect.duration > 0);

        return {
          ...prevState,
          effects: updatedEffects
        };
      });
    }
    
    // If player's turn is over, trigger enemy turn
    if (!combatState.playerTurn) {
      // Schedule enemy turn after effects are processed
      setTimeout(() => {
        enemyTurn();
      }, 1000);
    }
  }, [combatState.effects, combatState.playerTurn]);

  // Handle attack action
  const handleAttack = useCallback(() => {
    // Only allow actions on player's turn when combat is active
    if (!combatState.active || !combatState.playerTurn) return;

    // Get player and enemy stats
    const playerAttack = calculatedStats.attack || 10;
    const enemyDefense = combatState.enemyStats?.defense || 5;
    
    // Calculate damage with modifiers
    const baseDamage = Math.max(1, playerAttack - enemyDefense);
    const critChance = (modifiers.criticalChance || 0) + 0.05; // Base 5% + modifiers
    const isCritical = Math.random() < critChance;
    const damageMultiplier = isCritical ? (modifiers.criticalDamage || 0) + 1.5 : 1;
    const finalDamage = Math.floor(baseDamage * damageMultiplier);
    
    // Show trait effect if critical hit
    if (isCritical && modifiers.criticalChance > 0) {
      // Pass the required parameters to showTraitEffect based on its real signature
      showTraitEffect('critical', 50, 50);
    }
    
    // Apply damage to enemy
    if (combatState.enemyStats) {
      const newEnemyHealth = Math.max(0, combatState.enemyStats.currentHealth - finalDamage);
      
      // Update combat state with new enemy health
      setCombatState((prevState: ExtendedCombatState) => ({
        ...prevState,
        enemyStats: {
          ...prevState.enemyStats!,
          currentHealth: newEnemyHealth
        },
        playerTurn: false, // End player turn
        turnHistory: [
          ...(prevState.turnHistory || []),
          {
            actor: 'player',
            action: 'attack',
            result: isCritical ? 'critical' : 'hit',
            damage: finalDamage,
            timestamp: Date.now()
          }
        ]
      }));
      
      // Add log entry for the attack
      addLogEntry(
        isCritical 
          ? `You land a critical hit for ${finalDamage} damage!` 
          : `You attack for ${finalDamage} damage.`,
        isCritical ? 'critical' : 'attack',
        isCritical ? 'high' : 'normal'
      );
      
      // Check if enemy is defeated
      if (newEnemyHealth <= 0) {
        setCombatState((prevState: ExtendedCombatState) => ({
          ...prevState,
          active: false
        }));
        addLogEntry(`You defeated the ${combatState.enemyStats?.name || 'enemy'}!`, 'victory', 'high');
        onVictory();
        return;
      }
      
      // Process end of turn effects
      processEndOfTurnEffects();
    }
  }, [combatState, calculatedStats, modifiers, addLogEntry, setCombatState, onVictory, showTraitEffect, processEndOfTurnEffects]);

  // Handle enemy turn logic
  const enemyTurn = useCallback(() => {
    if (!combatState.active || combatState.playerTurn) return;
    
    // Get enemy attack power
    const enemyAttack = combatState.enemyStats?.attack || 5;
    const playerDefense = calculatedStats.defense || 5;
    
    // Calculate damage
    const enemyDamage = Math.max(1, enemyAttack - playerDefense);
    
    // Apply damage to player
    const newPlayerHealth = Math.max(0, combatState.playerStats.currentHealth - enemyDamage);
    
    // Update combat state
    setCombatState((prevState: ExtendedCombatState) => ({
      ...prevState,
      playerStats: {
        ...prevState.playerStats,
        currentHealth: newPlayerHealth
      },
      playerTurn: true, // Return to player turn
      round: prevState.round + 1, // Increment round counter
      turnHistory: [
        ...(prevState.turnHistory || []),
        {
          actor: 'enemy',
          action: 'attack',
          result: 'hit',
          damage: enemyDamage,
          timestamp: Date.now()
        }
      ]
    }));
    
    // Add log entry for enemy attack
    addLogEntry(
      `${combatState.enemyStats?.name || 'Enemy'} attacks for ${enemyDamage} damage.`, 
      'damage', 
      'normal'
    );
    
    // Check if player is defeated
    if (newPlayerHealth <= 0) {
      setCombatState((prevState: ExtendedCombatState) => ({
        ...prevState,
        active: false
      }));
      addLogEntry('You have been defeated!', 'defeat', 'high');
      onDefeat();
    }
  }, [combatState, calculatedStats, addLogEntry, setCombatState, onDefeat]);

  // Handle skill usage
  const handleUseSkill = useCallback((skill: { name: string, id: string }) => {
    if (!combatState.active || !combatState.playerTurn) return;
    
    addLogEntry(`You use ${skill.name}, but it's not fully implemented yet.`, 'skill', 'normal');
    
    setCombatState(prevState => ({
      ...prevState,
      playerTurn: false, // End player turn
      turnHistory: [
        ...(prevState.turnHistory || []),
        {
          actor: 'player',
          action: 'skill',
          skillId: skill.id,
          result: 'used',
          timestamp: Date.now()
        }
      ]
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState, addLogEntry, setCombatState, processEndOfTurnEffects]);

  // Handle item usage
  const handleUseItem = useCallback((item: { name: string, id: string }) => {
    if (!combatState.active || !combatState.playerTurn) return;
    
    addLogEntry(`You use ${item.name}, but items aren't fully implemented yet.`, 'item', 'normal');
    
    setCombatState(prevState => ({
      ...prevState,
      playerTurn: false, // End player turn
      turnHistory: [
        ...(prevState.turnHistory || []),
        {
          actor: 'player',
          action: 'item',
          itemId: item.id,
          result: 'used',
          timestamp: Date.now()
        }
      ]
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState, addLogEntry, setCombatState, processEndOfTurnEffects]);

  // Handle defend action
  const handleDefend = useCallback(() => {
    if (!combatState.active || !combatState.playerTurn) return;
    
    // Apply defense buff for next enemy turn
    const defenseEffect = {
      id: 'defend',
      name: 'Defending',
      description: 'Increased defense for one turn',
      duration: 1,
      strength: 0.5, // Reduce damage by 50%
      type: 'buff'
    };
    
    setCombatState(prevState => ({
      ...prevState,
      playerTurn: false, // End player turn
      effects: [...(prevState.effects || []), defenseEffect],
      turnHistory: [
        ...(prevState.turnHistory || []),
        {
          actor: 'player',
          action: 'defend',
          result: 'applied',
          timestamp: Date.now()
        }
      ]
    }));
    
    addLogEntry('You take a defensive stance.', 'defend', 'normal');
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState, addLogEntry, setCombatState, processEndOfTurnEffects]);

  // Handle flee action
  const handleFlee = useCallback(() => {
    if (!combatState.active || !combatState.playerTurn) return;
    
    // Implement flee chance calculation
    const fleeChance = 0.5; // 50% chance to flee
    const isSuccessful = Math.random() < fleeChance;
    
    if (isSuccessful) {
      setCombatState(prevState => ({
        ...prevState,
        active: false // End combat
      }));
      
      addLogEntry('You successfully fled from combat!', 'flee', 'high');
      // You might want to call a specific onFlee callback here
    } else {
      setCombatState(prevState => ({
        ...prevState,
        playerTurn: false, // End player turn but stay in combat
        turnHistory: [
          ...(prevState.turnHistory || []),
          {
            actor: 'player',
            action: 'flee',
            result: 'failed',
            timestamp: Date.now()
          }
        ]
      }));
      
      addLogEntry('You failed to flee!', 'flee', 'normal');
      
      // Process end of turn effects
      processEndOfTurnEffects();
    }
  }, [combatState, addLogEntry, setCombatState, processEndOfTurnEffects]);

  // Handle end of player turn
  const handlePlayerTurnEnd = useCallback(() => {
    if (!combatState.active || !combatState.playerTurn) return;
    
    setCombatState(prevState => ({
      ...prevState,
      playerTurn: false
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState, setCombatState, processEndOfTurnEffects]);

  return {
    handleAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd,
    addLogEntry,
    processEndOfTurnEffects
  };
};
