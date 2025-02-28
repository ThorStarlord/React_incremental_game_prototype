import React from 'react';
import TraitCard from '../ui/TraitCard';
import TraitButton from '../ui/TraitButton';
import { useTraits } from '../../hooks/useTraitEffects';
import './traits.module.css';

const TraitList = () => {
    const { traits, addTrait } = useTraits();

    return (
        <div className="trait-list">
            {traits.map((trait) => (
                <TraitCard key={trait.id} trait={trait}>
                    <TraitButton onClick={() => addTrait(trait.id)}>
                        Equip
                    </TraitButton>
                </TraitCard>
            ))}
        </div>
    );
};

export default TraitList;