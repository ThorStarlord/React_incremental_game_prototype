import React from 'react';
import StatDisplay from '../ui/StatDisplay';
import PlayerTraits from '../containers/PlayerTraits';
import Progression from '../containers/Progression';
import './CharacterPanel.css';

const CharacterPanel = () => {
    return (
        <div className="character-panel">
            <h2>Character Overview</h2>
            <StatDisplay />
            <PlayerTraits />
            <Progression />
        </div>
    );
};

export default CharacterPanel;