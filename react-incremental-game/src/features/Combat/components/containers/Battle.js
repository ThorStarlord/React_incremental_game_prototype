import React from 'react';
import BattleLog from '../ui/BattleLog';
import useCombatLogic from '../../hooks/useCombatLogic';
import './Battle.css';

const Battle = () => {
    const { combatState, startBattle, endBattle } = useCombatLogic();

    return (
        <div className="battle-container">
            <h2>Battle</h2>
            <BattleLog combatState={combatState} />
            <button onClick={startBattle}>Start Battle</button>
            <button onClick={endBattle}>End Battle</button>
        </div>
    );
};

export default Battle;