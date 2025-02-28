import React from 'react';
import NPCCard from '../ui/NPCCard';
import './npcPanel.module.css';

const NPCPanel = ({ npcs, onNPCSelect }) => {
    return (
        <div className="npc-panel">
            <h2>NPCs</h2>
            <div className="npc-list">
                {npcs.map(npc => (
                    <NPCCard key={npc.id} npc={npc} onSelect={() => onNPCSelect(npc)} />
                ))}
            </div>
        </div>
    );
};

export default NPCPanel;