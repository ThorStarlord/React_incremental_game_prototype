import { useEffect, useContext } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';

/**
 * Interface for minion object
 */
interface Minion {
  id: string;
  name: string;
  task: string;
  lastActionTime: number;
  taskCompletionTime: number;
  isIndependent: boolean;
  intelligence: number;
  strength: number;
  relationship: number;
  [key: string]: any; // Additional minion properties
}

/**
 * Type for task names
 */
type MinionTask = 'idle' | 'gather' | 'explore' | 'train' | 'assist';

/**
 * Interface for dispatch actions
 */
interface MinionAction {
  type: string;
  payload: Record<string, any>;
}

/**
 * Interface for game state context
 */
interface GameState {
  minions: Minion[];
  [key: string]: any; // Additional state properties
}

/**
 * Interface for hook return value
 */
interface UseMinionSystemReturn {
  setMinionTask: (minionId: string, task: MinionTask) => void;
  toggleMinionIndependence: (minionId: string, isIndependent: boolean) => void;
  getTaskDescriptionForMinion: (task: MinionTask) => string;
  getAssistBonusFromMinions: () => number;
}

/**
 * Hook to manage minion system behavior and interactions
 * 
 * @returns Object with functions for managing minions
 */
const useMinionSystem = (): UseMinionSystemReturn => {
  const { minions } = useContext(GameStateContext) as GameState;
  const dispatch = useContext(GameDispatchContext);
  
  // Set up task for a minion
  const setMinionTask = (minionId: string, task: MinionTask): void => {
    dispatch({
      type: 'SET_MINION_TASK',
      payload: { minionId, task }
    });
  };
  
  // Toggle independence for a minion
  const toggleMinionIndependence = (minionId: string, isIndependent: boolean): void => {
    dispatch({
      type: 'SET_MINION_INDEPENDENCE',
      payload: { minionId, isIndependent }
    });
    
    // If becoming independent, select a random task
    if (isIndependent) {
      const tasks: MinionTask[] = ['gather', 'explore', 'train'];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      setMinionTask(minionId, randomTask);
    } else {
      // If no longer independent, set to idle
      setMinionTask(minionId, 'idle');
    }
  };
  
  // Simulate minion progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      minions.forEach(minion => {
        // Skip minions that are idle or assisting
        if (minion.task === 'idle' || minion.task === 'assist') return;
        
        // Calculate progress based on time passed
        const now = Date.now();
        const timePassed = now - minion.lastActionTime;
        const progressPercentage = (timePassed / minion.taskCompletionTime) * 100;
        
        dispatch({
          type: 'MINION_TASK_PROGRESS',
          payload: {
            minionId: minion.id,
            progressAmount: progressPercentage
          }
        });
      });
    }, 10000); // Check progress every 10 seconds
    
    return () => clearInterval(progressInterval);
  }, [minions, dispatch]);
  
  // Independent minion decision making
  useEffect(() => {
    const independentThinkingInterval = setInterval(() => {
      minions.forEach(minion => {
        if (!minion.isIndependent) return;
        
        // Independent minions occasionally change tasks based on their personality
        // Intelligence affects decision making
        if (Math.random() < 0.1) { // 10% chance each check
          const possibleTasks: MinionTask[] = ['gather', 'explore', 'train'];
          
          // Smarter minions prefer more complex tasks
          let taskWeights: number[];
          if (minion.intelligence > 5) {
            taskWeights = [0.2, 0.5, 0.3]; // Prefer exploration
          } else {
            taskWeights = [0.6, 0.3, 0.1]; // Prefer gathering
          }
          
          // Select task based on weights
          const randomValue = Math.random();
          let cumulativeWeight = 0;
          let selectedTask: MinionTask = 'gather'; // Default
          
          for (let i = 0; i < possibleTasks.length; i++) {
            cumulativeWeight += taskWeights[i];
            if (randomValue <= cumulativeWeight) {
              selectedTask = possibleTasks[i];
              break;
            }
          }
          
          // Set new task
          setMinionTask(minion.id, selectedTask);
          
          // Notify about minion decision
          dispatch({
            type: 'SHOW_NOTIFICATION',
            payload: {
              message: `${minion.name} decided to ${selectedTask} on their own!`,
              severity: 'info',
              duration: 3000
            }
          });
        }
      });
    }, 120000); // Think every 2 minutes
    
    return () => clearInterval(independentThinkingInterval);
  }, [minions, dispatch]);
  
  // Other useful functions
  const getTaskDescriptionForMinion = (task: MinionTask): string => {
    switch (task) {
      case 'gather':
        return 'Gathering resources';
      case 'explore':
        return 'Exploring the area';
      case 'train':
        return 'Training skills';
      case 'assist':
        return 'Assisting you';
      case 'idle':
      default:
        return 'Idle';
    }
  };
  
  const getAssistBonusFromMinions = (): number => {
    return minions
      .filter(m => m.task === 'assist')
      .reduce((total, minion) => {
        // Calculate assistance bonus based on minion stats and relationship
        const relationshipFactor = minion.relationship / 100; // 0 to 1
        const statBonus = (minion.strength + minion.intelligence) / 20; // Combined stat bonus
        
        return total + (statBonus * relationshipFactor);
      }, 0);
  };
  
  return {
    setMinionTask,
    toggleMinionIndependence,
    getTaskDescriptionForMinion,
    getAssistBonusFromMinions
  };
};

export default useMinionSystem;
