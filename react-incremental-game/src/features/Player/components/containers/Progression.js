import React from 'react';
import { usePlayerStats } from '../../hooks/usePlayerStats';
import StatDisplay from '../ui/StatDisplay';
import './Progression.css';

const Progression = () => {
    const { stats } = usePlayerStats();

    return (
        <div className="progression-container">
            <h2>Player Progression</h2>
            <div className="stats-display">
                {stats.map(stat => (
                    <StatDisplay key={stat.id} stat={stat} />
                ))}
            </div>
        </div>
    );
};

export default Progression;