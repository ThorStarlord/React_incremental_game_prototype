import React from 'react';
import MinionCard from '../ui/MinionCard';
import { useMinionSystem } from '../../hooks/useMinionSystem';
import './MinionPanel.css';

const MinionPanel = () => {
    const { minions, addMinion, removeMinion } = useMinionSystem();

    return (
        <div className="minion-panel">
            <h2>Minion Management</h2>
            <div className="minion-list">
                {minions.map(minion => (
                    <MinionCard 
                        key={minion.id} 
                        minion={minion} 
                        onRemove={() => removeMinion(minion.id)} 
                    />
                ))}
            </div>
            <button onClick={addMinion}>Add Minion</button>
        </div>
    );
};

export default MinionPanel;