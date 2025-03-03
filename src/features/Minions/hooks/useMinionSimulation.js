import { useState, useEffect } from 'react';
import { useGameState, useGameDispatch } from '../../../context/GameStateContext';

const useMinionSimulation = (settings = {}) => {
    const [simResults, setSimResults] = useState([]);
    const [isRunning, setIsRunning] = useState(true);
    const { minions = [] } = useGameState();
    const dispatch = useGameDispatch();

    // Safely simulate minion activities (resource generation, exploration, etc.)
    const simulateMinions = () => {
        // Guard clause - ensure minions is an array before attempting to map over it
        if (!Array.isArray(minions)) {
            console.warn('Minion simulation attempted with undefined or non-array minions');
            return [];
        }

        // Process each minion's activities and calculate rewards
        return minions.map(minion => {
            // Guard against undefined minion objects
            if (!minion) return null;

            // Calculate production based on minion stats and task
            const baseProduction = minion.baseProduction || {};
            const task = minion.task || 'idle';
            const taskEfficiency = getTaskEfficiency(task, minion);
            
            // Calculate resources generated
            const generatedResources = {};
            Object.entries(baseProduction).forEach(([resource, amount]) => {
                generatedResources[resource] = Math.floor(amount * taskEfficiency);
            });
            
            // Return simulation result for this minion
            return {
                id: minion.id,
                name: minion.name || 'Unknown Minion',
                task,
                resources: generatedResources,
                experience: Math.floor(1 * taskEfficiency),
                successRate: taskEfficiency
            };
        }).filter(Boolean); // Filter out null results from undefined minions
    };

    // Calculate task efficiency based on minion attributes and task type
    const getTaskEfficiency = (task, minion) => {
        // Default efficiency if minion stats are unavailable
        if (!minion) return 0;
        
        const strength = minion.strength || 1;
        const intelligence = minion.intelligence || 1;
        const agility = minion.agility || 1;
        
        switch(task) {
            case 'gather':
                return (strength * 0.7 + agility * 0.3) / 10;
            case 'explore':
                return (intelligence * 0.6 + agility * 0.4) / 10;
            case 'train':
                return (strength * 0.4 + intelligence * 0.6) / 10;
            case 'assist':
                return (intelligence + strength + agility) / 30;
            case 'idle':
            default:
                return 0;
        }
    };

    // Process minion simulation results on an interval
    useEffect(() => {
        if (!isRunning) return;
        
        const simulationInterval = setInterval(() => {
            // Run simulation
            const results = simulateMinions();
            setSimResults(results);
            
            // Apply results to game state if there are valid results
            if (Array.isArray(results) && results.length > 0) {
                // Sum up all resources generated
                const totalResources = results.reduce((total, result) => {
                    // Guard against undefined results or resources
                    if (!result || !result.resources) return total;
                    
                    Object.entries(result.resources).forEach(([resource, amount]) => {
                        total[resource] = (total[resource] || 0) + amount;
                    });
                    return total;
                }, {});
                
                // Dispatch resource generation action if there are resources to add
                if (Object.keys(totalResources).length > 0) {
                    dispatch({
                        type: 'ADD_RESOURCES',
                        payload: totalResources
                    });
                }
            }
        }, settings.interval || 60000); // Default: run simulation every minute
        
        return () => clearInterval(simulationInterval);
    }, [minions, isRunning, dispatch, settings.interval]);

    // Create a safer API for the hook
    return {
        results: simResults,
        isRunning,
        startSimulation: () => setIsRunning(true),
        stopSimulation: () => setIsRunning(false),
        forceSimulation: simulateMinions
    };
};

export default useMinionSimulation;