import React from 'react';
import { useNPCRelations } from '../../hooks/useNPCRelations';
import RelationshipDisplay from '../layout/RelationshipDisplay';

const NPCRelationships = () => {
    const { relationships } = useNPCRelations();

    return (
        <div className="npc-relationships">
            <h2>NPC Relationships</h2>
            {relationships.length > 0 ? (
                relationships.map((relationship) => (
                    <RelationshipDisplay key={relationship.id} relationship={relationship} />
                ))
            ) : (
                <p>No relationships found.</p>
            )}
        </div>
    );
};

export default NPCRelationships;