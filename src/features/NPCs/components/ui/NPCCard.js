import React from 'react';
import './NPCCard.css'; // Assuming you have a CSS file for styling

const NPCCard = ({ npc, onClick }) => {
    return (
        <div className="npc-card" onClick={() => onClick(npc.id)}>
            <h3 className="npc-name">{npc.name}</h3>
            <p className="npc-description">{npc.description}</p>
            <div className="npc-relationship">
                <span>Relationship: {npc.relationshipLevel}</span>
            </div>
        </div>
    );
};

export default NPCCard;