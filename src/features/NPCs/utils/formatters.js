// This file contains utility functions for formatting NPC-related data.

export const formatNPCName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatNPCDialogue = (dialogue) => {
    return dialogue.trim().replace(/\s+/g, ' ');
};

export const formatNPCRelationshipStatus = (status) => {
    switch (status) {
        case 'friendly':
            return '🤝 Friendly';
        case 'neutral':
            return '😐 Neutral';
        case 'hostile':
            return '⚔️ Hostile';
        default:
            return 'Unknown Status';
    }
};