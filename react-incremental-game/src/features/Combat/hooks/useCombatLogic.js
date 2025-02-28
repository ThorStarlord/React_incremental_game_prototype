import { useState, useEffect } from 'react';
import { calculateCombatOutcome } from '../data/combatLogic'; // Assuming this function exists in your data folder

const useCombatLogic = (playerStats, enemyStats) => {
    const [combatResult, setCombatResult] = useState(null);
    const [isCombatActive, setIsCombatActive] = useState(false);

    const startCombat = () => {
        setIsCombatActive(true);
    };

    const endCombat = () => {
        setIsCombatActive(false);
        setCombatResult(null);
    };

    useEffect(() => {
        if (isCombatActive) {
            const result = calculateCombatOutcome(playerStats, enemyStats);
            setCombatResult(result);
        }
    }, [isCombatActive, playerStats, enemyStats]);

    return {
        combatResult,
        isCombatActive,
        startCombat,
        endCombat,
    };
};

export default useCombatLogic;