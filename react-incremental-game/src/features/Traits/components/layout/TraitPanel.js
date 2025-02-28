import React from 'react';
import './traits.module.css';

const TraitPanel = ({ traits, onTraitSelect }) => {
    return (
        <div className="trait-panel">
            <h2>Traits</h2>
            <div className="trait-list">
                {traits.map((trait) => (
                    <div key={trait.id} className="trait-item" onClick={() => onTraitSelect(trait)}>
                        <h3>{trait.name}</h3>
                        <p>{trait.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TraitPanel;