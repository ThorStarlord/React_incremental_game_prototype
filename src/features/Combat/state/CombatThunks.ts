/**
 * Redux Thunks for Combat-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../../app/store';
import { 
  addNotification 
} from '../../Notifications/state/NotificationsSlice';
import { 
  CombatState,
  StartCombatPayload,
  CombatActionPayload,
  EndCombatPayload,
  CombatResult,
  CombatEnemy,
  StatusEffect
} from './CombatTypes';
import { adaptToCombatEnemy } from '../utils/enemyAdapter';
import { createLogEntry } from '../hooks/battle/usePlayerActions/utils/logEntryFormatters';
import { calculateDamage } from '../hooks/battle/usePlayerActions/utils/combatCalculations';

/**
 * Generate a random enemy for combat
 */
const generateEnemy = (dungeonId: string, playerLevel: number): CombatEnemy => {
  const enemyTypes = ['Wolf', 'Bandit', 'Skeleton', 'Goblin', 'Troll'];
  const randomEnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  const dungeonPrefix = dungeonId.charAt(0).toUpperCase() + dungeonId.slice(1);
  
  const level = Math.max(1, playerLevel);
  const baseHealth = 30 + (level * 10);
  const baseAttack = 5 + (level * 2);
  const baseDefense = 2 + Math.floor(level / 2);
  
  return {
    id: `${dungeonId}-${Date.now()}`,
    name: `${dungeonPrefix} ${randomEnemyType}`,
    level,
    currentHealth: baseHealth,
    maxHealth: baseHealth,
    attack: baseAttack,
    defense: baseDefense,
    rewards: {
      experience: level * 10,
      gold: level * 5,
      essence: level * 2,
      items: []
    }
  };
};

/**
 * Start a new combat encounter
 */
export const startCombat = createAsyncThunk<
  Partial<CombatState>,
  StartCombatPayload,
  { state: RootState }
>(
  'combat/startCombat',
  async (payload, { getState, dispatch }) => {
    const state = getState();
    const { player } = state;
    
    // Calculate player level (approximately)
    const playerLevel = player?.attributes ? 
      Math.floor(Object.values(player.attributes).reduce((sum, value) => sum + value, 0) / 5) : 1;
    
    // Generate enemy based on dungeon and difficulty
    let enemyLevel = playerLevel;
    if (payload.difficulty === 'easy') enemyLevel = Math.max(1, playerLevel - 1);
    if (payload.difficulty === 'hard') enemyLevel = playerLevel + 1;
    if (payload.difficulty === 'nightmare') enemyLevel = playerLevel + 2;
    
    const finalEnemyLevel = payload.enemyLevel || enemyLevel;
    const enemy = generateEnemy(payload.dungeonId, finalEnemyLevel);
    
    // Calculate initiative to determine first turn
    const playerDexterity = player?.attributes?.dexterity || 1;
    const playerInitiative = Math.floor(Math.random() * 10) + playerDexterity;
    const enemyInitiative = Math.floor(Math.random() * 10) + (enemy.level || 1);
    const playerFirstTurn = playerInitiative >= enemyInitiative;
    
    // Create initial combat log
    const initialLog = [
      createLogEntry(
        `A ${enemy.name} (Level ${enemy.level}) appears!`,
        'encounter',
        'high'
      ),
      createLogEntry(
        playerFirstTurn ? 
          "You'll strike first!" : 
          `The ${enemy.name} has the initiative!`,
        'initiative',
        'normal'
      )
    ];
    
    // Create player stats for combat
    const playerStats = {
      currentHealth: player?.stats?.health || 100,
      maxHealth: player?.stats?.maxHealth || 100,
      currentMana: player?.stats?.mana || 50,
      maxMana: player?.stats?.maxMana || 50,
      attack: player?.stats?.attack || 10,
      defense: player?.stats?.defense || 5,
      speed: player?.stats?.speed || 5
    };
    
    // Get player skills for combat
    const playerSkills = (player?.skills || []).map((skill: any) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description || '',
      cooldown: skill.cooldown || 3,
      currentCooldown: 0,
      manaCost: skill.manaCost || 10,
      damage: skill.damage || playerStats.attack || 10,
      targeting: skill.targeting || 'single',
      effects: skill.effects || []
    }));
    
    // Get player items for combat
    const playerItems = (player?.inventory?.items || [])
      .filter((item: any) => item.uses === 'combat' || item.uses === 'both')
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        quantity: item.quantity || 1,
        uses: item.uses || 'both',
        effect: item.effect,
        power: item.power
      }));
    
    // Notify player
    dispatch(addNotification(
      `Combat started against ${enemy.name}!`,
      'warning',
      {
        duration: 3000,
        category: 'combat'
      }
    ));
    
    return {
      active: true,
      playerTurn: playerFirstTurn,
      round: 1,
      playerStats,
      enemyStats: enemy,
      skills: playerSkills,
      items: playerItems,
      effects: [],
      dungeonId: payload.dungeonId,
      difficulty: payload.difficulty,
      encounter: payload.encounter || 0,
      totalEncounters: payload.totalEncounters || 1,
      log: initialLog,
      result: null
    };
  }
);

/**
 * Execute a combat action
 */
export const executeCombatAction = createAsyncThunk<
  { combatEnded: boolean; result?: CombatResult },
  CombatActionPayload,
  { state: RootState }
>(
  'combat/executeAction',
  async (payload, { getState, dispatch }) => {
    const state = getState();
    const { combat } = state;
    
    // Handle different action types
    switch (payload.actionType) {
      case 'attack':
        return await handleAttackAction(combat, dispatch);
        
      case 'defend':
        return await handleDefendAction(combat, dispatch);
        
      case 'skill':
        return await handleSkillAction(payload.skillId, combat, dispatch);
        
      case 'item':
        return await handleItemAction(payload.itemId, combat, dispatch);
        
      case 'flee':
        return await handleFleeAction(combat, dispatch);
        
      default:
        return { combatEnded: false };
    }
  }
);

/**
 * Handle player attack action
 */
async function handleAttackAction(combat: CombatState, dispatch: any) {
  if (!combat.active || !combat.playerTurn || !combat.enemyStats) {
    return { combatEnded: false };
  }
  
  // Calculate damage
  const { finalDamage, isCritical } = calculateDamage(
    combat.playerStats.attack || 10,
    0.05, // Base crit chance
    combat.enemyStats.defense || 0
  );
  
  // Apply damage to enemy
  const newEnemyHealth = Math.max(0, combat.enemyStats.currentHealth - finalDamage);
  
  // Update enemy health
  dispatch({
    type: 'combat/updateEnemyHealth',
    payload: newEnemyHealth
  });
  
  // Add log entry
  dispatch({
    type: 'combat/addLogEntry',
    payload: {
      message: isCritical
        ? `You land a critical hit for ${finalDamage} damage!`
        : `You attack for ${finalDamage} damage.`,
      type: isCritical ? 'critical' : 'attack',
      importance: isCritical ? 'high' : 'normal'
    }
  });
  
  // Check if enemy is defeated
  if (newEnemyHealth <= 0) {
    // Enemy defeated
    dispatch({
      type: 'combat/addLogEntry',
      payload: {
        message: `You defeated the ${combat.enemyStats.name}!`,
        type: 'victory',
        importance: 'high'
      }
    });
    
    // Return victory result
    return {
      combatEnded: true,
      result: {
        victory: true,
        rewards: combat.enemyStats.rewards
      }
    };
  }
  
  // End player turn
  dispatch({ type: 'combat/changeTurn' });
  
  return { combatEnded: false };
}

/**
 * Handle player defend action
 */
async function handleDefendAction(combat: CombatState, dispatch: any) {
  if (!combat.active || !combat.playerTurn) {
    return { combatEnded: false };
  }
  
  // Create defend effect
  const defendEffect: StatusEffect = {
    id: `defend-${Date.now()}`,
    name: 'Defending',
    description: 'Reduces damage taken by 50%',
    duration: 1,
    strength: 0.5,
    type: 'buff'
  };
  
  // Add defend effect
  dispatch({
    type: 'combat/addStatusEffect',
    payload: defendEffect
  });
  
  // Add log entry
  dispatch({
    type: 'combat/addLogEntry',
    payload: {
      message: 'You take a defensive stance.',
      type: 'defend',
      importance: 'normal'
    }
  });
  
  // End player turn
  dispatch({ type: 'combat/changeTurn' });
  
  return { combatEnded: false };
}

/**
 * Handle player skill action
 */
async function handleSkillAction(skillId: string | undefined, combat: CombatState, dispatch: any) {
  if (!combat.active || !combat.playerTurn || !skillId) {
    return { combatEnded: false };
  }
  
  // Find the skill
  const skill = combat.skills.find(s => s.id === skillId);
  if (!skill || skill.currentCooldown > 0 || (skill.manaCost > (combat.playerStats.currentMana || 0))) {
    return { combatEnded: false };
  }
  
  // Calculate damage
  const baseDamage = skill.damage || combat.playerStats.attack || 10;
  const { finalDamage, isCritical } = calculateDamage(
    baseDamage,
    0.05, // Base crit chance
    combat.enemyStats?.defense || 0
  );
  
  // Update enemy health
  if (combat.enemyStats) {
    const newEnemyHealth = Math.max(0, combat.enemyStats.currentHealth - finalDamage);
    dispatch({
      type: 'combat/updateEnemyHealth',
      payload: newEnemyHealth
    });
    
    // Check if enemy is defeated
    if (newEnemyHealth <= 0) {
      // Enemy defeated
      dispatch({
        type: 'combat/addLogEntry',
        payload: {
          message: `You defeated the ${combat.enemyStats.name} with ${skill.name}!`,
          type: 'victory',
          importance: 'high'
        }
      });
      
      // Return victory result
      return {
        combatEnded: true,
        result: {
          victory: true,
          rewards: combat.enemyStats.rewards
        }
      };
    }
  }
  
  // Update skill cooldown
  dispatch({
    type: 'combat/updateSkillCooldown',
    payload: { skillId, cooldown: skill.cooldown }
  });
  
  // Update player mana
  dispatch({
    type: 'combat/setPlayerStats',
    payload: {
      currentMana: (combat.playerStats.currentMana || 0) - skill.manaCost
    }
  });
  
  // Add log entry
  dispatch({
    type: 'combat/addLogEntry',
    payload: {
      message: `You use ${skill.name} for ${finalDamage} damage!`,
      type: 'skill',
      importance: 'normal'
    }
  });
  
  // Apply skill effects if any
  if (skill.effects && skill.effects.length > 0) {
    skill.effects.forEach(effect => {
      dispatch({
        type: 'combat/addStatusEffect',
        payload: effect
      });
    });
  }
  
  // End player turn
  dispatch({ type: 'combat/changeTurn' });
  
  return { combatEnded: false };
}

/**
 * Handle player item action
 */
async function handleItemAction(itemId: string | undefined, combat: CombatState, dispatch: any) {
  if (!combat.active || !combat.playerTurn || !itemId) {
    return { combatEnded: false };
  }
  
  // Find the item
  const item = combat.items.find(i => i.id === itemId);
  if (!item || item.quantity <= 0) {
    return { combatEnded: false };
  }
  
  // Use the item
  dispatch({ 
    type: 'combat/useItem', 
    payload: itemId 
  });
  
  // Apply item effects based on item.effect
  if (item.effect === 'heal') {
    const healAmount = item.power || 20;
    const newHealth = Math.min(
      combat.playerStats.maxHealth,
      combat.playerStats.currentHealth + healAmount
    );
    
    dispatch({
      type: 'combat/updatePlayerHealth',
      payload: newHealth
    });
    
    dispatch({
      type: 'combat/addLogEntry',
      payload: {
        message: `You use ${item.name} and heal for ${healAmount} health.`,
        type: 'heal',
        importance: 'normal'
      }
    });
  } else if (item.effect === 'damage') {
    const damageAmount = item.power || 15;
    
    if (combat.enemyStats) {
      const newEnemyHealth = Math.max(0, combat.enemyStats.currentHealth - damageAmount);
      
      dispatch({
        type: 'combat/updateEnemyHealth',
        payload: newEnemyHealth
      });
      
      dispatch({
        type: 'combat/addLogEntry',
        payload: {
          message: `You use ${item.name} and deal ${damageAmount} damage.`,
          type: 'item',
          importance: 'normal'
        }
      });
      
      // Check if enemy is defeated
      if (newEnemyHealth <= 0) {
        dispatch({
          type: 'combat/addLogEntry',
          payload: {
            message: `You defeated the ${combat.enemyStats.name} with ${item.name}!`,
            type: 'victory',
            importance: 'high'
          }
        });
        
        return {
          combatEnded: true,
          result: {
            victory: true,
            rewards: combat.enemyStats.rewards
          }
        };
      }
    }
  } else if (item.effect === 'mana') {
    const manaAmount = item.power || 15;
    const newMana = Math.min(
      combat.playerStats.maxMana || 0,
      (combat.playerStats.currentMana || 0) + manaAmount
    );
    
    dispatch({
      type: 'combat/setPlayerStats',
      payload: {
        currentMana: newMana
      }
    });
    
    dispatch({
      type: 'combat/addLogEntry',
      payload: {
        message: `You use ${item.name} and restore ${manaAmount} mana.`,
        type: 'mana',
        importance: 'normal'
      }
    });
  }
  
  // End player turn
  dispatch({ type: 'combat/changeTurn' });
  
  return { combatEnded: false };
}

/**
 * Handle player flee action
 */
async function handleFleeAction(combat: CombatState, dispatch: any) {
  if (!combat.active || !combat.playerTurn) {
    return { combatEnded: false };
  }
  
  // Calculate flee chance (50% base)
  const playerSpeed = combat.playerStats.speed || 5;
  const enemySpeed = combat.enemyStats?.speed || 5;
  const speedDifference = playerSpeed - enemySpeed;
  const fleeChance = 0.5 + (speedDifference * 0.05);
  const fleeSuccessful = Math.random() < Math.min(0.9, Math.max(0.1, fleeChance));
  
  if (fleeSuccessful) {
    // Successfully fled
    dispatch({
      type: 'combat/addLogEntry',
      payload: {
        message: 'You successfully fled from battle!',
        type: 'flee',
        importance: 'high'
      }
    });
    
    return {
      combatEnded: true,
      result: {
        victory: false,
        retreat: true
      }
    };
  } else {
    // Failed to flee
    dispatch({
      type: 'combat/addLogEntry',
      payload: {
        message: 'You failed to flee!',
        type: 'flee',
        importance: 'normal'
      }
    });
    
    // End player turn
    dispatch({ type: 'combat/changeTurn' });
    
    return { combatEnded: false };
  }
}

/**
 * End combat and process results
 */
export const endCombat = createAsyncThunk<
  CombatResult,
  EndCombatPayload,
  { state: RootState }
>(
  'combat/endCombat',
  async (payload, { dispatch }) => {
    // Notify player of combat end
    dispatch(addNotification(
      payload.result.victory
        ? 'Victory! Combat completed successfully.'
        : payload.result.retreat
          ? 'You have retreated from combat.'
          : 'Defeat! You have been defeated in combat.',
      payload.result.victory ? 'success' : 'error',
      {
        duration: 5000,
        category: 'combat'
      }
    ));
    
    return payload.result;
  }
);

/**
 * Process enemy turn
 */
export const processEnemyTurn = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'combat/processEnemyTurn',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { combat } = state;
    
    if (!combat.active || combat.playerTurn || !combat.enemyStats) {
      return;
    }
    
    // Get player and enemy stats
    const enemyAttack = combat.enemyStats.attack || 5;
    const playerDefense = combat.playerStats.defense || 0;
    
    // Check for defend effect
    const defendEffect = combat.effects.find(effect => effect.name === 'Defending');
    const damageReduction = defendEffect ? defendEffect.strength || 0 : 0;
    
    // Calculate damage
    const { finalDamage, isCritical } = calculateDamage(
      enemyAttack,
      0.05, // Base crit chance
      playerDefense
    );
    
    // Apply damage reduction from defend
    const reducedDamage = Math.floor(finalDamage * (1 - damageReduction));
    
    // Apply damage to player
    const newPlayerHealth = Math.max(0, combat.playerStats.currentHealth - reducedDamage);
    
    dispatch({
      type: 'combat/updatePlayerHealth',
      payload: newPlayerHealth
    });
    
    // Add log entry
    dispatch({
      type: 'combat/addLogEntry',
      payload: {
        message: isCritical
          ? `${combat.enemyStats.name} lands a critical hit for ${reducedDamage} damage!`
          : `${combat.enemyStats.name} attacks for ${reducedDamage} damage.`,
        type: isCritical ? 'critical' : 'damage',
        importance: isCritical ? 'high' : 'normal'
      }
    });
    
    // Check if player is defeated
    if (newPlayerHealth <= 0) {
      // Player defeated
      dispatch({
        type: 'combat/addLogEntry',
        payload: {
          message: 'You have been defeated!',
          type: 'defeat',
          importance: 'high'
        }
      });
      
      // End combat with defeat
      dispatch(endCombat({
        result: {
          victory: false,
          retreat: false
        }
      }));
      
      return;
    }
    
    // End enemy turn
    dispatch({ type: 'combat/changeTurn' });
    
    // Process status effects
    combat.effects.forEach(effect => {
      if (effect.duration <= 1) {
        // Remove effect if duration is up
        dispatch({
          type: 'combat/removeStatusEffect',
          payload: effect.id
        });
        
        // Add log entry
        dispatch({
          type: 'combat/addLogEntry',
          payload: {
            message: `${effect.name} has worn off.`,
            type: 'effect',
            importance: 'normal'
          }
        });
      } else {
        // Reduce effect duration
        dispatch({
          type: 'combat/addStatusEffect',
          payload: {
            ...effect,
            duration: effect.duration - 1
          }
        });
      }
    });
    
    // Reduce skill cooldowns
    combat.skills.forEach(skill => {
      if (skill.currentCooldown > 0) {
        dispatch({
          type: 'combat/updateSkillCooldown',
          payload: {
            skillId: skill.id,
            cooldown: skill.currentCooldown - 1
          }
        });
      }
    });
  }
);
