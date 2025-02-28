import { useEffect, useContext } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';

const useMinionSimulation = () => {
  const { minions } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // Simulation for minion task progression
  useEffect(() => {
    const progressInterval = setInterval(() => {
      minions.forEach(minion => {
        // Skip minions that are idle or assisting
        if (minion.task === 'idle' || minion.task === 'assist') return;
        
        // Calculate progress increment based on minion stats
        const progressIncrement = 5 + (minion.intelligence * 0.5);
        
        dispatch({
          type: 'MINION_TASK_PROGRESS',
          payload: { 
            minionId: minion.id, 
            progressAmount: progressIncrement 
          }
        });
      });
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(progressInterval);
  }, [minions, dispatch]);
  
  // Simulation for independent minion decision making
  useEffect(() => {
    const decisionInterval = setInterval(() => {
      minions.forEach(minion => {
        if (!minion.isIndependent) return;
        
        // Occasionally change tasks based on intelligence and personality
        if (Math.random() < 0.2) { // 20% chance each minute
          const tasks = ['gather', 'explore', 'train'];
          
          // Higher intelligence minions favor more complex tasks
          let taskWeights;
          if (minion.intelligence > 5) {
            taskWeights = [0.2, 0.5, 0.3]; // Prefer exploration
          } else {
            taskWeights = [0.6, 0.2, 0.2]; // Prefer gathering
          }
          
          // Select task based on weights
          const randomValue = Math.random();
          let cumulativeWeight = 0;
          let selectedTask = 'gather'; // Default
          
          for (let i = 0; i < tasks.length; i++) {
            cumulativeWeight += taskWeights[i];
            if (randomValue <= cumulativeWeight) {
              selectedTask = tasks[i];
              break;
            }
          }
          
          dispatch({
            type: 'SET_MINION_TASK',
            payload: { minionId: minion.id, task: selectedTask }
          });
          
          // Notify player about the decision
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
    }, 60000); // Check decisions every minute
    
    return () => clearInterval(decisionInterval);
  }, [minions, dispatch]);
  
  // Simulation for assistance bonuses
  useEffect(() => {
    const assistInterval = setInterval(() => {
      // Calculate total assistance bonus from all assisting minions
      const assistingMinions = minions.filter(m => m.task === 'assist');
      
      if (assistingMinions.length > 0) {
        // Sum up assistance bonus based on minion stats
        const totalAssistBonus = assistingMinions.reduce((total, minion) => {
          return total + (
            (minion.strength + minion.intelligence) / 20 * 
            (minion.relationship / 100)
          );
        }, 0);
        
        // Apply assistance bonus (e.g., essence generation)
        if (totalAssistBonus > 0) {
          dispatch({
            type: 'GAIN_ESSENCE',
            payload: Math.ceil(totalAssistBonus)
          });
        }
      }
    }, 30000); // Apply assistance bonus every 30 seconds
    
    return () => clearInterval(assistInterval);
  }, [minions, dispatch]);
  
  return null; // This hook doesn't need to return anything
};

export default useMinionSimulation;