import React from 'react';
import './MinionCard.css'; // Assuming you have a CSS file for styling

const MinionCard = ({ minion, onSelect }) => {
    return (
        <div className="minion-card" onClick={() => onSelect(minion)}>
            <h3 className="minion-name">{minion.name}</h3>
            <p className="minion-description">{minion.description}</p>
            <div className="minion-stats">
                <span>Health: {minion.health}</span>
                <span>Attack: {minion.attack}</span>
                <span>Defense: {minion.defense}</span>
            </div>
        </div>
    );
};

export default MinionCard;