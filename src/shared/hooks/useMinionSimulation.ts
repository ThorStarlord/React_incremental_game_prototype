import { useState, useEffect, useCallback } from 'react';
import { useGameState, useGameDispatch } from '../../context';

interface Minion {
  id: string;
  name: string;
  level: number;
  task?: string;
  efficiency?: number;
}

interface UseMinionSimulationReturn {
  simulationRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  toggleSimulation: () => void;
}

// Extended game state with minions property
interface ExtendedGameState {
  minions?: Minion[];
}

/**
 * Hook to handle minion simulation over time
 * Manages automatic activities performed by minions
 */
const useMinionSimulation = (interval = 10000): UseMinionSimulationReturn => {
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  // Cast to ExtendedGameState to resolve the TypeScript error
  const gameState = useGameState() as unknown as ExtendedGameState;
  const { minions = [] } = gameState;
  const dispatch = useGameDispatch();

  // Process minion activities
  const processMinionActivities = useCallback(() => {
    if (!Array.isArray(minions)) return;
    
    minions.forEach((minion: Minion) => {
      if (!minion || !minion.task) return;
      
      // Calculate resource generation based on minion level and efficiency
      const baseAmount = minion.level || 1;
      const efficiency = minion.efficiency || 1.0;
      const generatedAmount = Math.floor(baseAmount * efficiency);
      
      // Dispatch appropriate actions based on minion task
      switch (minion.task) {
        case 'gather_essence':
          dispatch({
            type: 'GAIN_ESSENCE',
            payload: {
              amount: generatedAmount,
              source: `minion_${minion.id}`
            }
          });
          break;
          
        case 'explore':
          dispatch({
            type: 'PROGRESS_EXPLORATION',
            payload: {
              minionId: minion.id,
              progress: generatedAmount
            }
          });
          break;
          
        case 'craft':
          dispatch({
            type: 'PROGRESS_CRAFTING',
            payload: {
              minionId: minion.id,
              progress: generatedAmount
            }
          });
          break;
          
        default:
          // No task or idle
          break;
      }
    });
  }, [minions, dispatch]);

  useEffect(() => {
    let simulationTimer: NodeJS.Timeout;
    
    if (simulationRunning) {
      simulationTimer = setInterval(() => {
        processMinionActivities();
      }, interval);
    }
    
    return () => {
      clearInterval(simulationTimer);
    };
  }, [simulationRunning, interval, processMinionActivities]);

  return {
    simulationRunning,
    startSimulation: () => setSimulationRunning(true),
    stopSimulation: () => setSimulationRunning(false),
    toggleSimulation: () => setSimulationRunning(prev => !prev)
  };
};

export default useMinionSimulation;
