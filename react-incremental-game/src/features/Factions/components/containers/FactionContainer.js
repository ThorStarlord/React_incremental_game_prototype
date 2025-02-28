import React from 'react';
import { useSelector } from 'react-redux';
import FactionOverview from '../FactionOverview';
import './FactionContainer.css';

const FactionContainer = () => {
    const factions = useSelector(state => state.factions);

    return (
        <div className="faction-container">
            <h2>Factions</h2>
            {factions.map(faction => (
                <FactionOverview key={faction.id} faction={faction} />
            ))}
        </div>
    );
};

export default FactionContainer;