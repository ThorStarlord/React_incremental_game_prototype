import { useState, useEffect, useCallback } from 'react';
import { useGameState, useGameDispatch } from '../../../context/GameStateContext';
import { Minion, MinionTask, MinionAssignment, MinionUpgrade } from '../../../context/initialStates/minionsInitialState';

/**
 * Interface for the return value from useMinionSystem hook
 */
interface UseMinionSystemReturn {
  /** All available minions */
  minions: Record<string, Minion>;
  /** Unlocked minion tasks */
  availableTasks: MinionTask[];
  /** Minion system upgrades */
  upgrades: Record<string, MinionUpgrade>;
  /** Maximum number of minion slots */
  maxMinionSlots: number;
  /** Number of currently unlocked minion slots */
  unlockedMinionSlots: number;
  /** Cost to unlock the next minion slot */
  nextSlotCost: number;
  /** System configuration */
  config: {
    autoAssign: boolean;
    notifyOnCompletion: boolean;
    defaultAssignment: string;
  };
  /** Handlers */
  assignTask: (minionId: string, taskId: string) => boolean;
  recallMinion: (minionId: string) => void;
  upgradeMinion: (minionId: string, attributeToUpgrade: string) => boolean;
  purchaseUpgrade: (upgradeId: string) => boolean;
  trainMinion: (minionId: string, skillToTrain: string) => boolean;
  unlockNewMinionSlot: () => boolean;
  unlockMinion: (minionId: string) => boolean;
  updateConfig: (newConfig: Partial<{
    autoAssign: boolean;
    notifyOnCompletion: boolean;
    defaultAssignment: string;
  }>) => void;
  getMinionsOnTask: (taskType: string) => Minion[];
  getIdleMinions: () => Minion[];
  getTopMinionsForTask: (taskId: string, count?: number) => Minion[];
  calculateTaskSuccess: (minionId: string, taskId: string) => number;
  getTaskStatus: (minionId: string) => {
    inProgress: boolean;
    timeRemaining: number;
    percentComplete: number;
  };
}

/**
 * Custom hook for managing minion system functionality
 * 
 * @returns {UseMinionSystemReturn} Object with minion data and functions
 */
const useMinionSystem = (): UseMinionSystemReturn => {
  const { minions: gameMinions = {} } = useGameState();
  const dispatch = useGameDispatch();
  
  const [minions, setMinions] = useState<Record<string, Minion>>(gameMinions.minions || {});
  const [availableTasks, setAvailableTasks] = useState<MinionTask[]>(gameMinions.availableTasks || []);
  const [upgrades, setUpgrades] = useState<Record<string, MinionUpgrade>>(gameMinions.upgrades || {});
  const [maxMinionSlots, setMaxMinionSlots] = useState<number>(gameMinions.maxMinionSlots || 10);
  const [unlockedMinionSlots, setUnlockedMinionSlots] = useState<number>(gameMinions.unlockedMinionSlots || 1);
  const [nextSlotCost, setNextSlotCost] = useState<number>(gameMinions.nextSlotCost || 100);
  const [config, setConfig] = useState({
    autoAssign: gameMinions.config?.autoAssign || false,
    notifyOnCompletion: gameMinions.config?.notifyOnCompletion || true,
    defaultAssignment: gameMinions.config?.defaultAssignment || 'idle'
  });
  
  /**
   * Synchronize local state with game state when it changes
   */
  useEffect(() => {
    if (gameMinions) {
      setMinions(gameMinions.minions || {});
      setAvailableTasks(gameMinions.availableTasks || []);
      setUpgrades(gameMinions.upgrades || {});
      setMaxMinionSlots(gameMinions.maxMinionSlots || 10);
      setUnlockedMinionSlots(gameMinions.unlockedMinionSlots || 1);
      setNextSlotCost(gameMinions.nextSlotCost || 100);
      setConfig({
        autoAssign: gameMinions.config?.autoAssign || false,
        notifyOnCompletion: gameMinions.config?.notifyOnCompletion || true,
        defaultAssignment: gameMinions.config?.defaultAssignment || 'idle'
      });
    }
  }, [gameMinions]);
  
  /**
   * Assign a task to a minion
   * 
   * @param {string} minionId - ID of the minion to assign
   * @param {string} taskId - ID of the task to assign
   * @returns {boolean} Whether the assignment was successful
   */
  const assignTask = useCallback((minionId: string, taskId: string): boolean => {
    const minion = minions[minionId];
    const task = availableTasks.find(t => t.id === taskId);
    
    // Validate minion and task exist
    if (!minion || !task) return false;
    
    // Check if minion meets task requirements
    if (minion.level < task.requiredLevel) return false;
    
    // Create assignment
    const assignment: MinionAssignment = {
      id: `${minionId}-${taskId}-${Date.now()}`,
      type: task.id.includes('gather') ? 'gathering' : task.id.includes('craft') ? 'crafting' : 'exploration',
      taskId,
      startTime: Date.now(),
      duration: task.duration,
      completed: false
    };
    
    // Update minion with new assignment
    const updatedMinion: Minion = {
      ...minion,
      assignment
    };
    
    // Dispatch update to game state
    dispatch({
      type: 'UPDATE_MINION',
      payload: updatedMinion
    });
    
    return true;
  }, [minions, availableTasks, dispatch]);
  
  /**
   * Recall a minion from its current task
   * 
   * @param {string} minionId - ID of the minion to recall
   */
  const recallMinion = useCallback((minionId: string): void => {
    const minion = minions[minionId];
    if (!minion || !minion.assignment) return;
    
    const updatedMinion: Minion = {
      ...minion,
      assignment: null
    };
    
    dispatch({
      type: 'UPDATE_MINION',
      payload: updatedMinion
    });
  }, [minions, dispatch]);
  
  /**
   * Upgrade a minion's attribute
   * 
   * @param {string} minionId - ID of the minion to upgrade
   * @param {string} attributeToUpgrade - The attribute to upgrade (strength, intelligence, etc.)
   * @returns {boolean} Whether the upgrade was successful
   */
  const upgradeMinion = useCallback((minionId: string, attributeToUpgrade: string): boolean => {
    const minion = minions[minionId];
    if (!minion) return false;
    
    // Check cost based on current attribute level and calculate cost
    // This is a placeholder - real implementation would check player resources
    const hasEnoughResources = true;
    
    if (!hasEnoughResources) return false;
    
    // Update the minion's stats
    const updatedMinion: Minion = {
      ...minion,
      stats: {
        ...minion.stats,
        [attributeToUpgrade]: minion.stats[attributeToUpgrade as keyof typeof minion.stats] + 1
      }
    };
    
    dispatch({
      type: 'UPDATE_MINION',
      payload: updatedMinion
    });
    
    return true;
  }, [minions, dispatch]);
  
  /**
   * Purchase a minion system upgrade
   * 
   * @param {string} upgradeId - ID of the upgrade to purchase
   * @returns {boolean} Whether the purchase was successful
   */
  const purchaseUpgrade = useCallback((upgradeId: string): boolean => {
    const upgrade = upgrades[upgradeId];
    if (!upgrade || upgrade.purchased) return false;
    
    // Check if player has enough resources
    // This is a placeholder - real implementation would check player resources
    const hasEnoughResources = true;
    
    if (!hasEnoughResources) return false;
    
    // Update the upgrade
    const updatedUpgrade: MinionUpgrade = {
      ...upgrade,
      purchased: true
    };
    
    dispatch({
      type: 'PURCHASE_MINION_UPGRADE',
      payload: updatedUpgrade
    });
    
    // Apply upgrade effects
    // This is simplified - real implementation would handle various upgrade types
    if (upgrade.effect.type === 'unlock_slot') {
      dispatch({
        type: 'UNLOCK_MINION_SLOT',
        payload: null
      });
    }
    
    return true;
  }, [upgrades, dispatch]);
  
  /**
   * Train a minion in a specific skill
   * 
   * @param {string} minionId - ID of the minion to train
   * @param {string} skillToTrain - Skill to improve
   * @returns {boolean} Whether the training was successful
   */
  const trainMinion = useCallback((minionId: string, skillToTrain: string): boolean => {
    // Training logic would be implemented here
    return true;
  }, []);
  
  /**
   * Unlock a new minion slot
   * 
   * @returns {boolean} Whether the slot was unlocked successfully
   */
  const unlockNewMinionSlot = useCallback((): boolean => {
    if (unlockedMinionSlots >= maxMinionSlots) return false;
    
    // Check if player has enough resources
    // This is a placeholder - real implementation would check player resources
    const hasEnoughResources = true;
    
    if (!hasEnoughResources) return false;
    
    dispatch({
      type: 'UNLOCK_MINION_SLOT',
      payload: null
    });
    
    return true;
  }, [unlockedMinionSlots, maxMinionSlots, dispatch]);
  
  /**
   * Unlock a new minion
   * 
   * @param {string} minionId - ID of the minion to unlock
   * @returns {boolean} Whether the minion was unlocked successfully
   */
  const unlockMinion = useCallback((minionId: string): boolean => {
    if (!minions[minionId] || minions[minionId].unlocked) return false;
    
    // Check if there's an available slot
    if (Object.values(minions).filter(m => m.unlocked).length >= unlockedMinionSlots) {
      return false;
    }
    
    const updatedMinion: Minion = {
      ...minions[minionId],
      unlocked: true
    };
    
    dispatch({
      type: 'UPDATE_MINION',
      payload: updatedMinion
    });
    
    return true;
  }, [minions, unlockedMinionSlots, dispatch]);
  
  /**
   * Update minion system config
   * 
   * @param {Partial<{autoAssign: boolean, notifyOnCompletion: boolean, defaultAssignment: string}>} newConfig - New config values
   */
  const updateConfig = useCallback((newConfig: Partial<{
    autoAssign: boolean;
    notifyOnCompletion: boolean;
    defaultAssignment: string;
  }>) => {
    const updatedConfig = {
      ...config,
      ...newConfig
    };
    
    dispatch({
      type: 'UPDATE_MINION_CONFIG',
      payload: updatedConfig
    });
    
    setConfig(updatedConfig);
  }, [config, dispatch]);
  
  /**
   * Get minions assigned to a specific task type
   * 
   * @param {string} taskType - Task type to filter by
   * @returns {Minion[]} Array of minions on the specified task type
   */
  const getMinionsOnTask = useCallback((taskType: string): Minion[] => {
    return Object.values(minions).filter(
      minion => minion.assignment?.type === taskType
    );
  }, [minions]);
  
  /**
   * Get all idle minions
   * 
   * @returns {Minion[]} Array of idle minions
   */
  const getIdleMinions = useCallback((): Minion[] => {
    return Object.values(minions).filter(
      minion => !minion.assignment && minion.unlocked
    );
  }, [minions]);
  
  /**
   * Get the top N minions best suited for a task
   * 
   * @param {string} taskId - ID of the task
   * @param {number} [count=3] - Number of minions to return
   * @returns {Minion[]} Array of the top minions for the task
   */
  const getTopMinionsForTask = useCallback((taskId: string, count: number = 3): Minion[] => {
    const task = availableTasks.find(t => t.id === taskId);
    if (!task) return [];
    
    return Object.values(minions)
      .filter(minion => minion.unlocked && minion.level >= task.requiredLevel)
      .map(minion => ({
        minion,
        score: calculateTaskSuccess(minion.id, taskId)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.minion);
  }, [minions, availableTasks]);
  
  /**
   * Calculate a minion's chance of success for a task
   * 
   * @param {string} minionId - ID of the minion
   * @param {string} taskId - ID of the task
   * @returns {number} Success chance (0-100)
   */
  const calculateTaskSuccess = useCallback((minionId: string, taskId: string): number => {
    const minion = minions[minionId];
    const task = availableTasks.find(t => t.id === taskId);
    
    if (!minion || !task) return 0;
    
    // Basic calculation based on minion stats and task requirements
    let successChance = 50; // Base 50% chance
    
    // Factor in level difference
    const levelDifference = minion.level - task.requiredLevel;
    successChance += levelDifference * 5;
    
    // Factor in relevant stats
    if (task.requirements.stats) {
      if (task.requirements.stats.strength && minion.stats.strength) {
        successChance += (minion.stats.strength - (task.requirements.stats.strength || 0)) * 2;
      }
      if (task.requirements.stats.intelligence && minion.stats.intelligence) {
        successChance += (minion.stats.intelligence - (task.requirements.stats.intelligence || 0)) * 2;
      }
      if (task.requirements.stats.dexterity && minion.stats.dexterity) {
        successChance += (minion.stats.dexterity - (task.requirements.stats.dexterity || 0)) * 2;
      }
      if (task.requirements.stats.stamina && minion.stats.stamina) {
        successChance += (minion.stats.stamina - (task.requirements.stats.stamina || 0)) * 2;
      }
    }
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, successChance));
  }, [minions, availableTasks]);
  
  /**
   * Get the status of a minion's current task
   * 
   * @param {string} minionId - ID of the minion
   * @returns {object} Task status information
   */
  const getTaskStatus = useCallback((minionId: string) => {
    const minion = minions[minionId];
    
    if (!minion || !minion.assignment) {
      return {
        inProgress: false,
        timeRemaining: 0,
        percentComplete: 0
      };
    }
    
    const { startTime, duration } = minion.assignment;
    const elapsedTime = Date.now() - startTime;
    const timeRemaining = Math.max(0, duration - elapsedTime);
    const percentComplete = Math.min(100, (elapsedTime / duration) * 100);
    
    return {
      inProgress: timeRemaining > 0,
      timeRemaining,
      percentComplete
    };
  }, [minions]);
  
  return {
    minions,
    availableTasks,
    upgrades,
    maxMinionSlots,
    unlockedMinionSlots,
    nextSlotCost,
    config,
    assignTask,
    recallMinion,
    upgradeMinion,
    purchaseUpgrade,
    trainMinion,
    unlockNewMinionSlot,
    unlockMinion,
    updateConfig,
    getMinionsOnTask,
    getIdleMinions,
    getTopMinionsForTask,
    calculateTaskSuccess,
    getTaskStatus
  };
};

export default useMinionSystem;
