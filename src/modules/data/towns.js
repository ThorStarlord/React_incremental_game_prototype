import { TownModel } from './dataModels';

export const towns = [
    {
        id: 'oakhaven',
        name: 'Oakhaven',
        type: 'Lumber Town',
        description: 'A small, rustic town surrounded by the Whispering Woods. Known for its lumber mill and friendly inhabitants.',
        regionId: 'whisperingWoods',
        npcIds: ['elara', 'borin', 'willa'], // Elder Willow and Scholar Elara
    },
    {
        id: 'stonefangHold',
        name: 'Stonefang Hold',
        type: 'Mining Settlement',
        description: 'A hardy settlement carved into the face of the Cragged Peaks. Its intricate network of tunnels and chambers serves both as living space and mining operations.',
        regionId: 'craggedPeaks',
        npcIds: [2], // Grimbold the Trader
    },
    {
        id: 'saltyWharf',
        name: 'Salty Wharf',
        type: 'Fishing Port',
        description: 'A lively port town built on stilts along the Sunken Coast. Markets filled with fresh seafood and salvaged treasures attract traders from all over.',
        regionId: 'sunkenCoast',
        npcIds: [], // Will add more NPCs later
    },
    {
        id: 'windriderCamp',
        name: 'Windrider Camp',
        type: 'Nomadic Settlement',
        description: 'A mobile settlement of the plains folk, following ancient migration routes across the Emerald Plains. Known for their skilled beast tamers and wind magic.',
        regionId: 'emeraldPlains',
        npcIds: [], // Will add more NPCs later
    }
];