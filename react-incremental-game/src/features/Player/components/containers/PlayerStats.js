import React from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats';
import StatDisplay from '../components/ui/StatDisplay';
import './PlayerStats.css';

const PlayerStats = () => {
    const { stats } = usePlayerStats();

    return (
        <div className="player-stats">
            <h2>Player Stats</h2>
            <div className="stats-container">
                {stats.map(stat => (
                    <StatDisplay key={stat.id} stat={stat} />
                ))}
            </div>
        </div>
    );
};

export default PlayerStats;