import React from 'react';
import NPCCard from '../ui/NPCCard';
import DialogueHistory from '../layout/DialogueHistory';
import { useNPCRelations } from '../../hooks/useNPCRelations';
import './NPCEncounter.css';

const NPCEncounter = () => {
    const { npc, dialogueOptions } = useNPCRelations();

    return (
        <div className="npc-encounter">
            <NPCCard npc={npc} />
            <DialogueHistory dialogueOptions={dialogueOptions} />
        </div>
    );
};

export default NPCEncounter;