import React from 'react';
import Battle from '../components/Battle';
import CombatPanel from '../components/layout/CombatPanel';
import useCombatLogic from '../hooks/useCombatLogic';

const Combat = () => {
    const { combatState, startCombat, endCombat } = useCombatLogic();

    return (
        <CombatPanel>
            <Battle 
                combatState={combatState} 
                onStart={startCombat} 
                onEnd={endCombat} 
            />
        </CombatPanel>
    );
};

export default Combat;