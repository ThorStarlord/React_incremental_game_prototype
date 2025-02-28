import React from 'react';
import NPCCard from '../ui/NPCCard';
import { useNPCRelations } from '../../hooks/useNPCRelations';
import './NPCList.css';

const NPCList = () => {
    const { npcs } = useNPCRelations();

    return (
        <div className="npc-list">
            {npcs.map(npc => (
                <NPCCard key={npc.id} npc={npc} />
            ))}
        </div>
    );
};

export default NPCList;