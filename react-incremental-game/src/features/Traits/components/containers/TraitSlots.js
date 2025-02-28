import React from 'react';
import TraitButton from '../ui/TraitButton';
import TraitCard from '../ui/TraitCard';
import { useTraitEffects } from '../../hooks/useTraitEffects';
import { useTraitShortcuts } from '../../hooks/useTraitShortcuts';
import './traits.module.css';

const TraitSlots = ({ traits, onTraitSelect }) => {
    const { applyTraitEffects } = useTraitEffects();
    const { handleShortcuts } = useTraitShortcuts();

    const handleTraitClick = (trait) => {
        applyTraitEffects(trait);
        onTraitSelect(trait);
    };

    return (
        <div className="trait-slots">
            {traits.map((trait) => (
                <TraitCard 
                    key={trait.id} 
                    trait={trait} 
                    onClick={() => handleTraitClick(trait)} 
                />
            ))}
            <TraitButton onClick={handleShortcuts} />
        </div>
    );
};

export default TraitSlots;