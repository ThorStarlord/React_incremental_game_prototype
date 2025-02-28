import React from 'react';
import './TraitAndNPCListDrawer.css'; // Assuming you have a CSS file for styles

const TraitAndNPCListDrawer = ({ traits, npcs, onTraitSelect, onNPCSelect }) => {
    return (
        <div className="trait-npc-list-drawer">
            <div className="traits-section">
                <h2>Traits</h2>
                <ul>
                    {traits.map(trait => (
                        <li key={trait.id} onClick={() => onTraitSelect(trait)}>
                            {trait.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="npcs-section">
                <h2>NPCs</h2>
                <ul>
                    {npcs.map(npc => (
                        <li key={npc.id} onClick={() => onNPCSelect(npc)}>
                            {npc.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TraitAndNPCListDrawer;