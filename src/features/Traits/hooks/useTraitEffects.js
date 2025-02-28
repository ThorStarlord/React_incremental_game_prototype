import { useEffect } from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { applyTraitEffects } from '../utils/traitUtils';

const useTraitEffects = () => {
    const { traits, playerStats } = useGameState();

    useEffect(() => {
        if (traits.length > 0) {
            applyTraitEffects(traits, playerStats);
        }
    }, [traits, playerStats]);

    return null; // This hook does not need to return anything
}; 

export default useTraitEffects;