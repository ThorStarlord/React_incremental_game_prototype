import React from 'react';
import { usePlayerTraits } from '../../hooks/usePlayerStats';
import StatDisplay from '../ui/StatDisplay';
import './PlayerTraits.css';

const PlayerTraits = () => {
    const { traits } = usePlayerTraits();

    return (
        <div className="player-traits">
            <h2>Player Traits</h2>
            <div className="traits-list">
                {traits.map((trait, index) => (
                    <StatDisplay key={index} trait={trait} />
                ))}
            </div>
        </div>
    );
};

export default PlayerTraits;