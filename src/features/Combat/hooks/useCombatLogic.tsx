import { useCallback } from 'react';
import { ACTION_TYPES } from '../../../context/GameStateExports';
import { ExtendedCombatState, UseCombatLogicProps } from '../../../context/types/gameStates/CombatGameStateTypes';
import { SimpleLogEntry } from '../../../context/types/combat/logging';
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
        playerTurn: false // End player turn
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
      
      // Schedule enemy turn
      setTimeout(() => {
        enemyTurn();
      }, 1000);
    }
  }, [combatState, calculatedStats, modifiers, addLogEntry, setCombatState, onVictory, showTraitEffect]);

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
      round: prevState.round + 1 // Now this will work since we added round to ExtendedCombatState
    }));
    
    // Add log entry for enemy attack
    addLogEntry(
      `Enemy attacks for ${enemyDamage} damage.`, 
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
  const handleUseSkill = useCallback((skill: { name: string }) => {
    addLogEntry(`You use ${skill.name}, but it's not fully implemented yet.`, 'skill', 'normal');
  }, [addLogEntry]);

  // Handle item usage
  const handleUseItem = useCallback((item: { name: string }) => {
    addLogEntry(`You use ${item.name}, but items aren't fully implemented yet.`, 'item', 'normal');
  }, [addLogEntry]);

  return {
    handleAttack,
    handleUseSkill,
    handleUseItem,
    addLogEntry
  };
};
