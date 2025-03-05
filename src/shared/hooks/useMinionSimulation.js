import { useState, useEffect } from 'react';
// Update the import to use the consolidated gameContext
import { useGameState, useGameDispatch } from '../../context/gameContext';

const useMinionSimulation = (settings = {}) => {
  // Add default empty array to prevent undefined.length issues
  const { minions = [] } = useGameState();
  const dispatch = useGameDispatch();
  
  // Three main simulation systems:
  
  // 1. Task progression - runs every 10 seconds
  useEffect(() => {
    // Even with the default value above, add a guard clause for extra safety
    if (!Array.isArray(minions)) return;
    
    const progressInterval = setInterval(() => {
      minions.forEach(minion => {
        // Skip minions that are idle, assisting or invalid
        if (!minion || minion.task === 'idle' || minion.task === 'assist') return;
        
        // Calculate progress increment based on minion stats with safe fallbacks
        const intelligence = minion.intelligence || 0;
        const progressIncrement = 5 + (intelligence * 0.5);
        
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
  
  // 2. Autonomous decision making - runs every minute
  useEffect(() => {
    // Double-check minions is an array
    if (!Array.isArray(minions)) return;
    
    const decisionInterval = setInterval(() => {
      minions.forEach(minion => {
        if (!minion || !minion.isIndependent) return;
        
        // Occasionally change tasks based on intelligence and personality
        if (Math.random() < 0.2) { // 20% chance each minute
          const tasks = ['gather', 'explore', 'train'];
          
          // Higher intelligence minions favor more complex tasks
          const intelligence = minion.intelligence || 0;
          let taskWeights;
          if (intelligence > 5) {
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
  
  // 3. Assistance bonus calculation - runs every 30 seconds
  useEffect(() => {
    // Triple-check minions is an array each time
    if (!Array.isArray(minions)) return;
    
    const assistInterval = setInterval(() => {
      // Calculate total assistance bonus from all assisting minions
      const assistingMinions = minions.filter(m => m && m.task === 'assist');
      
      if (assistingMinions.length > 0) {
        // Sum up assistance bonus based on minion stats
        const totalAssistBonus = assistingMinions.reduce((total, minion) => {
          const strength = minion.strength || 0;
          const intelligence = minion.intelligence || 0;
          const relationship = minion.relationship || 0;
          
          return total + (
            (strength + intelligence) / 20 * 
            (relationship / 100)
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