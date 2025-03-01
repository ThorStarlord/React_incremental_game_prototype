import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Combat Reducer
 * 
 * Purpose: Manages all combat-related state and interactions in the game
 * - Initializes combat encounters with enemies
 * - Handles turn-based combat mechanics
 * - Processes attack actions, damage calculations, and effects
 * - Manages combat status effects and conditions
 * - Handles victory/defeat conditions and rewards
 * - Tracks combat statistics for achievements and progression
 * 
 * Combat is a core gameplay element that integrates with player progression,
 * inventory management, and quest systems.
 * 
 * Actions:
 * - START_COMBAT: Initializes a combat encounter
 * - ATTACK_ACTION: Processes an attack from player or enemy
 * - USE_COMBAT_SKILL: Applies a special combat ability
 * - END_TURN: Advances to the next turn in combat
 * - APPLY_STATUS_EFFECT: Adds a status effect to a combatant
 * - FLEE_COMBAT: Attempts to escape from combat
 * - END_COMBAT: Concludes combat and processes results
 * - COLLECT_LOOT: Processes item and resource rewards
 */
export const combatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.START_COMBAT: {
      const { enemies, location, ambush = false } = action.payload;
      
      if (!enemies || enemies.length === 0) {
        return addNotification(state, {
          message: "No enemies to fight!",
          type: "error"
        });
      }
      
      // Process enemies to ensure they have proper stats
      const processedEnemies = enemies.map(enemy => ({
        ...enemy,
        currentHealth: enemy.maxHealth || 10,
        statusEffects: [],
        // Calculate initiative if not provided
        initiative: enemy.initiative || Math.floor(Math.random() * 5) + 1
      }));
      
      // Calculate player initiative
      const playerDexterity = state.player.attributes?.dexterity || 0;
      const playerInitiative = Math.floor(Math.random() * 6) + 1 + Math.floor(playerDexterity / 3);
      
      // Determine who goes first
      const firstTurn = ambush ? 'enemy' : (playerInitiative >= processedEnemies[0].initiative ? 'player' : 'enemy');
      
      // Initialize combat state
      const combatState = {
        ...state,
        combat: {
          active: true,
          turns: 0,
          currentTurn: firstTurn,
          location: location || 'wilderness',
          startTime: Date.now(),
          player: {
            initiative: playerInitiative,
            statusEffects: []
          },
          enemies: processedEnemies,
          log: [{
            type: 'start',
            message: `Combat begins! ${ambush ? 'You were ambushed!' : ''}`,
            timestamp: Date.now()
          }]
        }
      };
      
      return addNotification(combatState, {
        message: ambush ? "You've been ambushed by enemies!" : "Combat has begun!",
        type: "danger",
        duration: 3000
      });
    }
    
    case ACTION_TYPES.ATTACK_ACTION: {
      const { targetId, skillId } = action.payload;
      
      // Ensure combat is active
      if (!state.combat || !state.combat.active) {
        return state;
      }
      
      // Handle player or enemy turn
      if (state.combat.currentTurn === 'player') {
        // Find target enemy
        const targetIndex = state.combat.enemies.findIndex(e => e.id === targetId);
        if (targetIndex === -1) {
          return addNotification(state, {
            message: "Invalid target!",
            type: "error"
          });
        }
        
        // Get player stats
        const strength = state.player.attributes?.strength || 1;
        const weaponDamage = 5; // Base weapon damage (this would come from equipped weapon)
        
        // Calculate damage (simple formula, can be expanded)
        const baseDamage = weaponDamage + Math.floor(strength / 2);
        const criticalChance = (state.player.attributes?.luck || 0) * 0.01 + 0.05; // 5% base + luck
        const isCritical = Math.random() < criticalChance;
        
        // Apply critical multiplier
        const finalDamage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;
        
        // Apply damage to target enemy
        const updatedEnemies = state.combat.enemies.map((enemy, index) => {
          if (index !== targetIndex) return enemy;
          
          const newHealth = Math.max(0, enemy.currentHealth - finalDamage);
          return {
            ...enemy,
            currentHealth: newHealth
          };
        });
        
        // Check if enemy died
        const targetEnemy = updatedEnemies[targetIndex];
        const enemyDefeated = targetEnemy.currentHealth === 0;
        
        // Create combat log entry
        const logEntry = {
          type: 'playerAttack',
          message: isCritical 
            ? `You land a critical hit on ${targetEnemy.name} for ${finalDamage} damage!`
            : `You attack ${targetEnemy.name} for ${finalDamage} damage.`,
          damage: finalDamage,
          critical: isCritical,
          targetId,
          timestamp: Date.now()
        };
        
        if (enemyDefeated) {
          logEntry.message += ` ${targetEnemy.name} is defeated!`;
        }
        
        // Check if all enemies are defeated
        const allEnemiesDefeated = updatedEnemies.every(e => e.currentHealth === 0);
        
        if (allEnemiesDefeated) {
          return endCombat(state, {
            ...state.combat,
            enemies: updatedEnemies,
            log: [...state.combat.log, logEntry],
            result: 'victory'
          });
        }
        
        // Update state and switch to enemy turn
        return {
          ...state,
          combat: {
            ...state.combat,
            enemies: updatedEnemies,
            currentTurn: 'enemy',
            turns: state.combat.turns + 1,
            log: [...state.combat.log, logEntry]
          }
        };
        
      } else {
        // Enemy turn logic - each active enemy attacks
        const activeEnemies = state.combat.enemies.filter(e => e.currentHealth > 0);
        let newHealth = state.player.health;
        const logEntries = [];
        
        // Process each enemy attack
        activeEnemies.forEach(enemy => {
          const enemyDamage = enemy.damage || Math.floor(Math.random() * 3) + 1;
          const playerDefense = state.player.attributes?.constitution || 0;
          
          // Apply defense reduction 
          const damageReduction = Math.floor(playerDefense / 4);
          const finalDamage = Math.max(1, enemyDamage - damageReduction);
          
          newHealth = Math.max(0, newHealth - finalDamage);
          
          logEntries.push({
            type: 'enemyAttack',
            message: `${enemy.name} attacks you for ${finalDamage} damage.`,
            damage: finalDamage,
            enemyId: enemy.id,
            timestamp: Date.now()
          });
        });
        
        // Check if player is defeated
        if (newHealth === 0) {
          const defeatState = {
            ...state,
            player: {
              ...state.player,
              health: newHealth,
              deathCount: (state.player.deathCount || 0) + 1,
              lastDeath: {
                cause: 'combat',
                location: state.combat.location,
                timestamp: Date.now()
              }
            },
            combat: {
              ...state.combat,
              log: [...state.combat.log, ...logEntries, {
                type: 'defeat',
                message: 'You have been defeated in combat!',
                timestamp: Date.now()
              }],
              result: 'defeat',
              active: false,
              endTime: Date.now()
            }
          };
          
          return addNotification(defeatState, {
            message: "You have been defeated in combat!",
            type: "danger",
            duration: 5000
          });
        }
        
        // Update state and switch to player turn
        return {
          ...state,
          player: {
            ...state.player,
            health: newHealth
          },
          combat: {
            ...state.combat,
            currentTurn: 'player',
            turns: state.combat.turns + 1,
            log: [...state.combat.log, ...logEntries]
          }
        };
      }
    }
    
    case ACTION_TYPES.USE_COMBAT_SKILL: {
      const { skillId, targetIds } = action.payload;
      
      // Ensure combat is active
      if (!state.combat || !state.combat.active) {
        return state;
      }
      
      // Check if it's player's turn
      if (state.combat.currentTurn !== 'player') {
        return addNotification(state, {
          message: "It's not your turn!",
          type: "warning"
        });
      }
      
      // Find skill data
      const skill = state.player.skills?.find(s => s.id === skillId);
      if (!skill) {
        return addNotification(state, {
          message: "You don't have that skill!",
          type: "error"
        });
      }
      
      // Check energy cost
      if (state.player.energy < skill.energyCost) {
        return addNotification(state, {
          message: "Not enough energy to use this skill!",
          type: "warning"
        });
      }
      
      // Process different skill types
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          energy: state.player.energy - skill.energyCost
        }
      };
      
      const logEntry = {
        type: 'skill',
        skillId,
        skillName: skill.name,
        message: `You use ${skill.name}!`,
        timestamp: Date.now()
      };
      
      // Handle different skill types
      switch (skill.type) {
        case 'aoe': {
          // AOE damage to all enemies
          const updatedEnemies = state.combat.enemies.map(enemy => {
            if (enemy.currentHealth === 0) return enemy; // Skip dead enemies
            
            const damage = skill.baseDamage + Math.floor((state.player.attributes?.intelligence || 0) / 2);
            const newHealth = Math.max(0, enemy.currentHealth - damage);
            
            return {
              ...enemy,
              currentHealth: newHealth
            };
          });
          
          logEntry.message += ` Deals ${skill.baseDamage} damage to all enemies!`;
          
          // Check if all enemies are defeated
          const allEnemiesDefeated = updatedEnemies.every(e => e.currentHealth === 0);
          
          if (allEnemiesDefeated) {
            return endCombat(updatedState, {
              ...updatedState.combat,
              enemies: updatedEnemies,
              log: [...updatedState.combat.log, logEntry],
              result: 'victory'
            });
          }
          
          updatedState.combat = {
            ...updatedState.combat,
            enemies: updatedEnemies,
            log: [...updatedState.combat.log, logEntry]
          };
          break;
        }
        
        case 'healing': {
          // Healing skill
          const healAmount = skill.baseHealing + Math.floor((state.player.attributes?.wisdom || 0) / 2);
          const newHealth = Math.min(
            updatedState.player.health + healAmount,
            updatedState.player.maxHealth
          );
          
          updatedState.player.health = newHealth;
          logEntry.message += ` Restores ${healAmount} health!`;
          
          updatedState.combat = {
            ...updatedState.combat,
            log: [...updatedState.combat.log, logEntry]
          };
          break;
        }
        
        case 'buff': {
          // Buff skill (add status effect to player)
          updatedState.combat = {
            ...updatedState.combat,
            player: {
              ...updatedState.combat.player,
              statusEffects: [
                ...updatedState.combat.player.statusEffects,
                {
                  id: skill.effectId,
                  name: skill.effectName,
                  duration: skill.duration,
                  strength: skill.effectStrength
                }
              ]
            },
            log: [...updatedState.combat.log, logEntry]
          };
          break;
        }
        
        case 'debuff': {
          // Debuff skill (add negative status to enemies)
          const updatedEnemies = state.combat.enemies.map(enemy => {
            if (!targetIds.includes(enemy.id)) return enemy;
            
            return {
              ...enemy,
              statusEffects: [
                ...enemy.statusEffects,
                {
                  id: skill.effectId,
                  name: skill.effectName,
                  duration: skill.duration,
                  strength: skill.effectStrength
                }
              ]
            };
          });
          
          updatedState.combat = {
            ...updatedState.combat,
            enemies: updatedEnemies,
            log: [...updatedState.combat.log, logEntry]
          };
          break;
        }
      }
      
      // Switch to enemy turn
      updatedState.combat = {
        ...updatedState.combat,
        currentTurn: 'enemy',
        turns: updatedState.combat.turns + 1
      };
      
      return updatedState;
    }
    
    case ACTION_TYPES.END_TURN: {
      // Ensure combat is active
      if (!state.combat || !state.combat.active) {
        return state;
      }
      
      // Process status effects durations
      let updatedState = { ...state };
      
      // Process player status effects
      const updatedPlayerEffects = updatedState.combat.player.statusEffects.map(effect => ({
        ...effect,
        duration: effect.duration - 1
      })).filter(effect => effect.duration > 0);
      
      updatedState.combat.player.statusEffects = updatedPlayerEffects;
      
      // Process enemy status effects
      updatedState.combat.enemies = updatedState.combat.enemies.map(enemy => ({
        ...enemy,
        statusEffects: enemy.statusEffects.map(effect => ({
          ...effect,
          duration: effect.duration - 1
        })).filter(effect => effect.duration > 0)
      }));
      
      // Toggle turn
      updatedState.combat.currentTurn = updatedState.combat.currentTurn === 'player' ? 'enemy' : 'player';
      updatedState.combat.turns += 1;
      
      return updatedState;
    }
    
    case ACTION_TYPES.FLEE_COMBAT: {
      // Ensure combat is active
      if (!state.combat || !state.combat.active) {
        return state;
      }
      
      // Calculate escape chance
      const playerDexterity = state.player.attributes?.dexterity || 0;
      const escapeChance = 0.3 + (playerDexterity * 0.02); // Base 30% + 2% per dexterity
      
      if (Math.random() < escapeChance) {
        // Successful escape
        const escapeState = {
          ...state,
          combat: {
            ...state.combat,
            active: false,
            result: 'fled',
            endTime: Date.now(),
            log: [...state.combat.log, {
              type: 'flee',
              message: 'You successfully fled from combat!',
              timestamp: Date.now()
            }]
          }
        };
        
        return addNotification(escapeState, {
          message: "You successfully fled from combat!",
          type: "success"
        });
      } else {
        // Failed escape - enemies get a free attack
        let newHealth = state.player.health;
        const logEntries = [{
          type: 'fleeAttempt',
          message: 'You tried to flee but failed!',
          timestamp: Date.now()
        }];
        
        // Each enemy gets an attack
        state.combat.enemies.forEach(enemy => {
          if (enemy.currentHealth <= 0) return; // Skip dead enemies
          
          const enemyDamage = enemy.damage || Math.floor(Math.random() * 3) + 1;
          newHealth = Math.max(0, newHealth - enemyDamage);
          
          logEntries.push({
            type: 'enemyAttack',
            message: `${enemy.name} attacks you for ${enemyDamage} damage.`,
            damage: enemyDamage,
            enemyId: enemy.id,
            timestamp: Date.now()
          });
        });
        
        // Check if player is defeated
        if (newHealth === 0) {
          const defeatState = {
            ...state,
            player: {
              ...state.player,
              health: newHealth
            },
            combat: {
              ...state.combat,
              result: 'defeat',
              active: false,
              endTime: Date.now(),
              log: [...state.combat.log, ...logEntries, {
                type: 'defeat',
                message: 'You have been defeated in combat!',
                timestamp: Date.now()
              }]
            }
          };
          
          return addNotification(defeatState, {
            message: "You have been defeated while attempting to flee!",
            type: "danger",
            duration: 5000
          });
        }
        
        // Update state - still in combat
        return addNotification({
          ...state,
          player: {
            ...state.player,
            health: newHealth
          },
          combat: {
            ...state.combat,
            turns: state.combat.turns + 1,
            log: [...state.combat.log, ...logEntries]
          }
        }, {
          message: "Failed to escape!",
          type: "warning"
        });
      }
    }
    
    case ACTION_TYPES.COLLECT_LOOT: {
      // Ensure combat is over and player won
      if (!state.combat || state.combat.active || state.combat.result !== 'victory') {
        return state;
      }
      
      // Check if loot was already collected
      if (state.combat.lootCollected) {
        return addNotification(state, {
          message: "You've already collected the loot!",
          type: "warning"
        });
      }
      
      // Generate loot based on defeated enemies
      let essenceGain = 0;
      let experienceGain = 0;
      const lootItems = [];
      
      state.combat.enemies.forEach(enemy => {
        // Base essence and XP from enemy
        essenceGain += enemy.essenceReward || Math.floor(Math.random() * 5) + 1;
        experienceGain += enemy.experienceReward || Math.floor(Math.random() * 10) + 5;
        
        // Item drops based on enemy loot table
        if (enemy.lootTable && Math.random() < (enemy.dropChance || 0.3)) {
          const possibleDrops = enemy.lootTable;
          const selectedDrop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
          
          if (selectedDrop) {
            lootItems.push({
              id: selectedDrop.id,
              quantity: selectedDrop.quantity || 1,
              name: selectedDrop.name,
              source: `combat_${state.combat.location}`
            });
          }
        }
      });
      
      // Update state with rewards
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          experience: state.player.experience + experienceGain
        },
        essence: {
          ...state.essence,
          amount: state.essence.amount + essenceGain
        },
        combat: {
          ...state.combat,
          lootCollected: true,
          rewards: {
            essence: essenceGain,
            experience: experienceGain,
            items: lootItems
          }
        },
        stats: {
          ...state.stats,
          combatsWon: (state.stats?.combatsWon || 0) + 1,
          totalEssenceFromCombat: (state.stats?.totalEssenceFromCombat || 0) + essenceGain
        }
      };
      
      // Add items to inventory
      lootItems.forEach(item => {
        // Check if item already exists in inventory
        const existingItemIndex = updatedState.player.inventory.findIndex(i => i.id === item.id);
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          updatedState.player.inventory = updatedState.player.inventory.map((invItem, idx) => 
            idx === existingItemIndex
              ? { ...invItem, quantity: invItem.quantity + item.quantity }
              : invItem
          );
        } else {
          // Add new item to inventory
          updatedState.player.inventory = [
            ...updatedState.player.inventory,
            {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              acquired: {
                timestamp: Date.now(),
                source: item.source
              }
            }
          ];
        }
      });
      
      // Create notification message
      let rewardMessage = `Rewards: ${essenceGain} essence, ${experienceGain} XP`;
      if (lootItems.length > 0) {
        rewardMessage += ', Items: ' + lootItems.map(item => 
          `${item.quantity}x ${item.name}`
        ).join(', ');
      }
      
      return addNotification(updatedState, {
        message: rewardMessage,
        type: "success",
        duration: 5000
      });
    }
    
    case ACTION_TYPES.END_COMBAT: {
      const { result } = action.payload;
      
      // Ensure combat is active
      if (!state.combat || !state.combat.active) {
        return state;
      }
      
      return endCombat(state, {
        ...state.combat,
        result: result || 'unknown',
        active: false,
        endTime: Date.now()
      });
    }
    
    default:
      return state;
  }
};

/**
 * Helper function to handle common end-of-combat logic
 * 
 * @param {Object} state - Current game state
 * @param {Object} combatResult - Updated combat object with result
 * @returns {Object} New state with updated combat status
 */
function endCombat(state, combatResult) {
  // Update player stats based on outcome
  const updatedStats = {
    ...state.stats,
    totalCombats: (state.stats?.totalCombats || 0) + 1
  };
  
  if (combatResult.result === 'victory') {
    updatedStats.combatsWon = (updatedStats.combatsWon || 0) + 1;
    
    // Add victory log entry if not present
    if (!combatResult.log.some(entry => entry.type === 'victory')) {
      combatResult.log = [
        ...combatResult.log,
        {
          type: 'victory',
          message: 'You are victorious!',
          timestamp: Date.now()
        }
      ];
    }
    
    return addNotification({
      ...state,
      combat: combatResult,
      stats: updatedStats
    }, {
      message: "Victory! You defeated all enemies.",
      type: "success",
      duration: 3000
    });
  } else if (combatResult.result === 'defeat') {
    updatedStats.combatsLost = (updatedStats.combatsLost || 0) + 1;
  } else if (combatResult.result === 'fled') {
    updatedStats.combatsFled = (updatedStats.combatsFled || 0) + 1;
  }
  
  return {
    ...state,
    combat: combatResult,
    stats: updatedStats
  };
}
