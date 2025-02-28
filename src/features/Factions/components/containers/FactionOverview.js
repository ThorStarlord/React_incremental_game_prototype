import React from 'react';
import { useSelector } from 'react-redux';
import FactionCard from '../ui/FactionCard';
import './FactionOverview.css';

const FactionOverview = () => {
    const factions = useSelector(state => state.factions);

    return (
        <div className="faction-overview">
            <h2>Faction Overview</h2>
            <div className="faction-list">
                {factions.map(faction => (
                    <FactionCard key={faction.id} faction={faction} />
                ))}
            </div>
        </div>
    );
};

export default FactionOverview;