import { useCallback } from 'react';
import { 
  StatusEffect, 
  CombatActionType,
  CombatActionResult
} from '../../../../context/types/combat';
import { 
  ExtendedCombatState, 
  BattleResult 
} from '../../../../context/types/BattleGameStateTypes';

/**
 * Hook for player combat actions
 */
export const usePlayerActions = (
  combatState: ExtendedCombatState,
  setCombatState: React.Dispatch<React.SetStateAction<ExtendedCombatState>>,
  calculatedStats: any,
  onComplete: (result: BattleResult) => void,
  onVictory: () => void,
  processEndOfTurnEffects: () => void,
  addLogEntry: (message: string, type: string) => void
) => {
  /**
   * Handle player's basic attack
   */
  const handlePlayerAttack = useCallback(() => {
    if (!combatState.playerTurn || !combatState.enemyStats) return;
    
    // Calculate damage based on player stats
    const baseDamage = calculatedStats?.attack || 5;
    const critChance = calculatedStats?.critChance || 0.05;
    const isCritical = Math.random() < critChance;
    
    let finalDamage = baseDamage;
    if (isCritical) {
      finalDamage = Math.floor(baseDamage * 1.5);
    }
    
    // Apply damage reduction from enemy defense
    finalDamage = Math.max(1, finalDamage - Math.floor((combatState.enemyStats.defense || 0) / 3));
    
    setCombatState(prev => {
      // Early return if enemyStats is undefined
      if (!prev.enemyStats) return prev;
      
      // Calculate enemy's new health
      const newHealth = Math.max(0, prev.enemyStats.currentHealth - finalDamage);
      
      // Add log entry with proper literal type assertions
      const newLog = [
        ...prev.log,
        {
          timestamp: Date.now(),
          message: isCritical 
            ? `You land a critical hit for ${finalDamage} damage!` 
            : `You attack for ${finalDamage} damage.`,
          type: isCritical ? 'critical' : 'damage',
          importance: isCritical ? 'high' as const : 'normal' as const  // Add type assertions
        }
      ];
      
      // Record turn history - fix the types here
      const newHistory = [
        ...(prev.turnHistory || []),
        {
          actor: 'player' as const, // Use const assertion to ensure it's a literal type
          action: CombatActionType.Attack,
          result: isCritical ? CombatActionResult.Critical : CombatActionResult.Hit, // Use enum values
          timestamp: Date.now()
        }
      ];
      
      // Check for victory
      if (newHealth <= 0) {
        // Enemy is defeated
        newLog.push({
          timestamp: Date.now(),
          message: `You have defeated ${prev.enemyStats.name}!`,
          type: 'victory',
          importance: 'high' as const  // Add type assertion
        });
        
        // Generate rewards with experience property
        const gold = 25; // Fixed gold reward
        const experience = 0; // No experience given since levels were removed
        
        // Trigger victory callback after a delay
        setTimeout(() => {
          onVictory();
          onComplete({
            victory: true,
            rewards: {
              experience, // Add required experience property
              gold,
              items: []
            },
            retreat: false
          });
        }, 1500);
        
        return {
          ...prev,
          active: false,
          enemyStats: {
            ...prev.enemyStats,
            currentHealth: 0
          },
          log: newLog,
          turnHistory: newHistory,
          rewards: {
            experience, // Add required experience property
            gold,
            items: []
          }
        };
      }
      
      // Continue battle - update enemy health and end player turn
      return {
        ...prev,
        playerTurn: false,
        enemyStats: {
          ...prev.enemyStats,
          currentHealth: newHealth
        },
        log: newLog,
        turnHistory: newHistory
      };
    });
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [
    combatState.playerTurn, 
    combatState.enemyStats, 
    calculatedStats, 
    onComplete, 
    onVictory, 
    processEndOfTurnEffects,
    setCombatState
  ]);

  /**
   * Handle player using a skill
   */
  const handleUseSkill = useCallback((skillId: string) => {
    if (!combatState.playerTurn) return;
    
    const skill = combatState.skills?.find(s => s.id === skillId);
    if (!skill || skill.currentCooldown > 0 || (skill.manaCost ?? 0) > combatState.playerStats.currentMana) {
      return;
    }
    
    // Apply skill effects 
    // Implementation depends on your game's skill system
    addLogEntry(`You use ${skill.name}!`, 'skill');
    
    // Update skill cooldown and mana
    setCombatState(prev => {
      const updatedSkills = prev.skills?.map(s => 
        s.id === skillId 
          ? { ...s, currentCooldown: s.cooldown } 
          : s
      );
      
      return {
        ...prev,
        skills: updatedSkills,
        playerStats: {
          ...prev.playerStats,
          currentMana: prev.playerStats.currentMana - (skill.manaCost ?? 0)
        },
        playerTurn: false
      };
    });
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [
    combatState.playerTurn, 
    combatState.skills, 
    combatState.playerStats.currentMana, 
    addLogEntry, 
    processEndOfTurnEffects,
    setCombatState
  ]);

  /**
   * Handle player using an item
   */
  const handleUseItem = useCallback((itemId: string) => {
    if (!combatState.playerTurn) return;
    
    const item = combatState.items?.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) {
      return;
    }
    
    // Apply item effects
    // Implementation depends on your game's item system
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

  /**
   * Handle player defending (reduces damage next turn)
   */
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
        {
          actor: 'player',
          action: CombatActionType.Defend,
          result: CombatActionResult.Block, // Changed from 'success' to a valid enum value
          timestamp: Date.now()
        }
      ],
      log: [
        ...prev.log,
        {
          timestamp: Date.now(),
          message: 'You take a defensive stance.',
          type: 'defend',
          importance: 'normal' as const  // Add type assertion
        }
      ]
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState.playerTurn, processEndOfTurnEffects, setCombatState]);

  /**
   * Handle player fleeing from battle
   */
  const handleFlee = useCallback(() => {
    // 50% chance to flee successfully
    const fleeSuccessful = Math.random() > 0.5;
    
    if (fleeSuccessful) {
      addLogEntry('You successfully fled from battle!', 'flee');
      
      setTimeout(() => {
        onComplete({
          victory: false,
          rewards: {
            experience: 0, // Add required experience property with 0 value
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
          {
            actor: 'player' as const, // Use const assertion to ensure it's the literal type
            action: CombatActionType.Flee,
            result: CombatActionResult.Miss, // Use a valid enum value instead of string
            timestamp: Date.now()
          }
        ]
      }));
      
      // Process end of turn effects
      processEndOfTurnEffects();
    }
  }, [addLogEntry, onComplete, processEndOfTurnEffects, setCombatState]);

  /**
   * Handle ending player turn manually
   */
  const handlePlayerTurnEnd = useCallback(() => {
    if (!combatState.playerTurn) return;
    
    setCombatState(prev => ({
      ...prev,
      playerTurn: false
    }));
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [combatState.playerTurn, processEndOfTurnEffects, setCombatState]);

  return {
    handlePlayerAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd
  };
};
