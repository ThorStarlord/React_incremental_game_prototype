import { useEffect, useCallback, useRef } from 'react';
import { useGameState, useGameDispatch } from '../../../context/GameStateContext';
import { Minion, MinionTask } from '../../../context/initialStates/MinionsInitialState';

/**
 * Type for task completion result
 */
interface TaskCompletionResult {
  success: boolean;
  rewards: {
    resources: Record<string, number>;
    items: Record<string, number>;
    experience: number;
  };
  message: string;
}

/**
 * Type for simulation options
 */
interface SimulationOptions {
  simulationInterval: number;
  enableNotifications: boolean;
  autoAssignIdleMinions: boolean;
}

/**
 * Interface for hook return value
 */
interface UseMinionSimulationReturn {
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  isPaused: boolean;
  lastUpdateTime: number;
  updateSimulationOptions: (options: Partial<SimulationOptions>) => void;
  simulationOptions: SimulationOptions;
  forceSimulationUpdate: () => void;
}

/**
 * Custom hook for simulating minion activities over time
 * 
 * @returns {UseMinionSimulationReturn} Simulation controls and state
 */
const useMinionSimulation = (): UseMinionSimulationReturn => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Get minion-related state
  const minions = gameState?.minions?.minions || {};
  const availableTasks = gameState?.minions?.availableTasks || [];
  const config = gameState?.minions?.config || {};
  
  // Track simulation state
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Default simulation options
  const simOptionsRef = useRef<SimulationOptions>({
    simulationInterval: 5000, // Run simulation every 5 seconds
    enableNotifications: true,
    autoAssignIdleMinions: config.autoAssign || false
  });
  
  /**
   * Process task completion for a minion
   * 
   * @param {Minion} minion - The minion completing a task
   * @param {MinionTask} task - The task being completed
   * @returns {TaskCompletionResult} Result of the task completion
   */
  const processTaskCompletion = (minion: Minion, task: MinionTask): TaskCompletionResult => {
    // Calculate success chance
    const baseSuccessChance = 0.7; // 70% base chance
    
    // Adjust based on minion stats and task requirements
    let successModifier = 0;
    
    // Consider level difference
    const levelDifference = minion.level - task.requiredLevel;
    successModifier += levelDifference * 0.05; // +5% per level above requirement
    
    // Consider stats match
    if (task.requirements.stats) {
      if (task.requirements.stats.strength) {
        successModifier += (minion.stats.strength - task.requirements.stats.strength) * 0.02;
      }
      if (task.requirements.stats.intelligence) {
        successModifier += (minion.stats.intelligence - task.requirements.stats.intelligence) * 0.02;
      }
      if (task.requirements.stats.dexterity) {
        successModifier += (minion.stats.dexterity - task.requirements.stats.dexterity) * 0.02;
      }
      if (task.requirements.stats.stamina) {
        successModifier += (minion.stats.stamina - task.requirements.stats.stamina) * 0.02;
      }
    }
    
    // Calculate final success chance
    const finalSuccessChance = Math.max(0.1, Math.min(0.95, baseSuccessChance + successModifier));
    
    // Determine success or failure
    const isSuccess = Math.random() < finalSuccessChance;
    
    // Prepare result object
    const result: TaskCompletionResult = {
      success: isSuccess,
      rewards: {
        resources: {},
        items: {},
        experience: isSuccess ? task.rewards.experience : Math.floor(task.rewards.experience * 0.2)
      },
      message: isSuccess 
        ? `${minion.name} successfully completed ${task.name}!`
        : `${minion.name} failed to complete ${task.name}.`
    };
    
    // Add rewards if task was successful
    if (isSuccess && task.rewards.resources) {
      result.rewards.resources = { ...task.rewards.resources };
    }
    
    if (isSuccess && task.rewards.items) {
      result.rewards.items = { ...task.rewards.items };
    }
    
    return result;
  };
  
  /**
   * Check for and complete any finished minion tasks
   */
  const checkTaskCompletions = useCallback(() => {
    const now = Date.now();
    let updatedMinions: Minion[] = [];
    let notifications: string[] = [];
    
    // Check each minion for completed tasks
    Object.values(minions).forEach((minion: Minion) => {
      if (!minion.assignment || minion.assignment.completed) return;
      
      const { startTime, duration, taskId } = minion.assignment;
      const endTime = startTime + duration;
      
      // Check if task is now complete
      if (now >= endTime) {
        const task = availableTasks.find(t => t.id === taskId);
        
        if (task) {
          // Process task completion
          const result = processTaskCompletion(minion, task);
          
          // Store notification
          if (simOptionsRef.current.enableNotifications) {
            notifications.push(result.message);
          }
          
          // Update minion
          const updatedMinion: Minion = {
            ...minion,
            assignment: {
              ...minion.assignment,
              completed: true
            },
            experience: minion.experience + result.rewards.experience,
            // Check if minion leveled up
            level: checkLevelUp(minion.experience + result.rewards.experience, minion.level)
          };
          
          updatedMinions.push(updatedMinion);
          
          // Add rewards to player inventory
          if (result.success) {
            // Add resources
            if (Object.keys(result.rewards.resources).length > 0) {
              dispatch({
                type: 'ADD_RESOURCES',
                payload: result.rewards.resources
              });
            }
            
            // Add items
            if (Object.keys(result.rewards.items).length > 0) {
              dispatch({
                type: 'ADD_ITEMS',
                payload: result.rewards.items
              });
            }
          }
        }
      }
    });
    
    // Update minions in game state
    if (updatedMinions.length > 0) {
      updatedMinions.forEach(minion => {
        dispatch({
          type: 'UPDATE_MINION',
          payload: minion
        });
      });
    }
    
    // Show notifications
    if (notifications.length > 0) {
      notifications.forEach(message => {
        dispatch({
          type: 'SHOW_NOTIFICATION',
          payload: {
            message,
            type: 'minion',
            duration: 5000
          }
        });
      });
    }
    
    // Auto-assign idle minions if enabled
    if (simOptionsRef.current.autoAssignIdleMinions) {
      autoAssignIdleMinions();
    }
    
    // Update last check time
    lastUpdateTimeRef.current = now;
  }, [minions, availableTasks, dispatch]);
  
  /**
   * Check if a minion should level up based on experience
   * 
   * @param {number} experience - Current experience amount
   * @param {number} currentLevel - Current minion level
   * @returns {number} New level
   */
  const checkLevelUp = (experience: number, currentLevel: number): number => {
    // Simple exponential formula: 100 * level^2 experience needed for next level
    const expForNextLevel = 100 * Math.pow(currentLevel, 2);
    
    if (experience >= expForNextLevel) {
      return currentLevel + 1;
    }
    
    return currentLevel;
  };
  
  /**
   * Automatically assign idle minions to tasks
   */
  const autoAssignIdleMinions = useCallback(() => {
    const idleMinions = Object.values(minions).filter(
      minion => minion.unlocked && !minion.assignment
    );
    
    if (idleMinions.length === 0) return;
    
    idleMinions.forEach(minion => {
      // Find suitable tasks for this minion
      const suitableTasks = availableTasks.filter(
        task => task.unlocked && minion.level >= task.requiredLevel
      );
      
      if (suitableTasks.length === 0) return;
      
      // Randomly select one of the suitable tasks
      const randomTask = suitableTasks[Math.floor(Math.random() * suitableTasks.length)];
      
      // Create assignment
      const assignment = {
        id: `${minion.id}-${randomTask.id}-${Date.now()}`,
        type: randomTask.id.includes('gather') ? 'gathering' : 
              randomTask.id.includes('craft') ? 'crafting' : 'exploration',
        taskId: randomTask.id,
        startTime: Date.now(),
        duration: randomTask.duration,
        completed: false
      };
      
      // Update minion
      const updatedMinion: Minion = {
        ...minion,
        assignment
      };
      
      dispatch({
        type: 'UPDATE_MINION',
        payload: updatedMinion
      });
    });
  }, [minions, availableTasks, dispatch]);
  
  /**
   * Start the simulation interval
   */
  const startSimulation = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    
    simulationRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        checkTaskCompletions();
      }
    }, simOptionsRef.current.simulationInterval);
  }, [checkTaskCompletions]);
  
  /**
   * Pause simulation
   */
  const pauseSimulation = useCallback(() => {
    isPausedRef.current = true;
  }, []);
  
  /**
   * Resume simulation
   */
  const resumeSimulation = useCallback(() => {
    isPausedRef.current = false;
  }, []);
  
  /**
   * Update simulation options
   * 
   * @param {Partial<SimulationOptions>} options - New simulation options
   */
  const updateSimulationOptions = useCallback((options: Partial<SimulationOptions>) => {
    simOptionsRef.current = {
      ...simOptionsRef.current,
      ...options
    };
    
    // Restart simulation if interval changed
    if (options.simulationInterval && simulationRef.current) {
      startSimulation();
    }
  }, [startSimulation]);
  
  /**
   * Force simulation to update now
   */
  const forceSimulationUpdate = useCallback(() => {
    checkTaskCompletions();
  }, [checkTaskCompletions]);
  
  // Set up simulation on mount and clean up on unmount
  useEffect(() => {
    startSimulation();
    
    // Check for any task completions that occurred while the game was closed
    checkTaskCompletions();
    
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [startSimulation, checkTaskCompletions]);
  
  return {
    pauseSimulation,
    resumeSimulation,
    isPaused: isPausedRef.current,
    lastUpdateTime: lastUpdateTimeRef.current,
    updateSimulationOptions,
    simulationOptions: simOptionsRef.current,
    forceSimulationUpdate
  };
};

export default useMinionSimulation;
