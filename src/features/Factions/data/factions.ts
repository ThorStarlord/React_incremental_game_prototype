// Import FactionType from the correct location instead of Faction
import { FactionType } from '../../../context/types/gameStates/FactionGameStateTypes';

/**
 * Interface for faction member
 */
interface FactionMember {
    name: string;
    role: string;
}

/**
 * Interface for faction resources
 */
interface FactionResources {
    gold: number;
    food: number;
    supplies: number;
    [key: string]: number;
}

/**
 * Extended faction interface for our data
 */
interface ExtendedFaction {
    id: string; // Add this property to match the usage below
    name: string;
    description: string;
    members: FactionMember[];
    resources: FactionResources;
    reputation: number;
    unlocked: boolean;
    unlockRequirements: Record<string, any>;
    reputationTiers: Array<{
        threshold: number;
        name: string;
        benefits: string[];
    }>;
    allies: string[];
    enemies: string[];
}

const factions: ExtendedFaction[] = [
    {
        id: '1',
        name: "The Guardians",
        description: "A faction dedicated to protecting the realm and its inhabitants.",
        members: [
            { name: "Eldrin", role: "Leader" },
            { name: "Thalia", role: "Warrior" },
            { name: "Garrick", role: "Mage" }
        ],
        resources: {
            gold: 1000,
            food: 500,
            supplies: 300
        },
        reputation: 0,
        unlocked: false,
        unlockRequirements: {},
        reputationTiers: [],
        allies: [],
        enemies: []
    },
    {
        id: '2',
        name: "The Shadows",
        description: "A secretive faction that operates in the dark, gathering information and influence.",
        members: [
            { name: "Kira", role: "Assassin" },
            { name: "Ronan", role: "Spy" },
            { name: "Zara", role: "Thief" }
        ],
        resources: {
            gold: 800,
            food: 200,
            supplies: 150
        },
        reputation: 0,
        unlocked: false,
        unlockRequirements: {},
        reputationTiers: [],
        allies: [],
        enemies: []
    },
    {
        id: '3',
        name: "The Scholars",
        description: "A faction focused on knowledge, magic, and the pursuit of wisdom.",
        members: [
            { name: "Alaric", role: "Archmage" },
            { name: "Lyra", role: "Researcher" },
            { name: "Fenwick", role: "Alchemist" }
        ],
        resources: {
            gold: 600,
            food: 300,
            supplies: 500
        },
        reputation: 0,
        unlocked: false,
        unlockRequirements: {},
        reputationTiers: [],
        allies: [],
        enemies: []
    }
];

export default factions;
export type { ExtendedFaction, FactionMember, FactionResources };
