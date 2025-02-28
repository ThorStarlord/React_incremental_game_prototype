import { useEffect, useState } from 'react';
import { useNPCRelations } from '../hooks/useNPCRelations';

const useEssenceGeneration = () => {
    const [essence, setEssence] = useState(0);
    const { npcRelations } = useNPCRelations();

    useEffect(() => {
        const calculateEssence = () => {
            // Example logic for essence generation based on NPC relations
            const baseEssence = 10;
            const relationFactor = npcRelations.length; // Simplified for demonstration
            setEssence(baseEssence * relationFactor);
        };

        calculateEssence();
    }, [npcRelations]);

    return essence;
};

export default useEssenceGeneration;