export const RELATIONSHIP_TYPES = {
    FRIEND: 'friend',
    ENEMY: 'enemy',
    NEUTRAL: 'neutral',
};

export const RELATIONSHIP_EFFECTS = {
    FRIEND: {
        description: 'Increases cooperation and support.',
        benefits: ['Shared resources', 'Increased morale'],
    },
    ENEMY: {
        description: 'Leads to conflict and competition.',
        drawbacks: ['Reduced trust', 'Increased hostility'],
    },
    NEUTRAL: {
        description: 'No significant impact on interactions.',
        benefits: ['Stable interactions', 'No conflicts'],
    },
};

export const MAX_RELATIONSHIP_LEVEL = 100;