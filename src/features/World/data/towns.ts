import { TownModelInterface } from './dataModels';

/**
 * Interface for town map coordinates
 * 
 * @interface TownMapCoordinates
 * @property {number} x - X position on the world map
 * @property {number} y - Y position on the world map
 */
interface TownMapCoordinates {
  x: number;
  y: number;
}

/**
 * Extended TownModelInterface with map coordinates
 * 
 * @interface TownData
 * @extends TownModelInterface
 * @property {TownMapCoordinates} mapCoordinates - Positioning data for the town on the world map
 * @property {string[] | number[]} npcIds - IDs of NPCs that can be found in this town
 */
interface TownData extends Omit<TownModelInterface, 'npcIds'> {
  mapCoordinates: TownMapCoordinates;
  npcIds: (string | number)[];
}

/**
 * Array of town data objects that define all villages and settlements in the game
 * 
 * @type {TownData[]}
 */
export const towns: TownData[] = [
    {
        id: 'oakhaven',
        name: 'Oakhaven',
        type: 'Lumber Town',
        description: 'A small, rustic town surrounded by the Whispering Woods. Known for its lumber mill and friendly inhabitants.',
        regionId: 'whisperingWoods',
        npcIds: ['elara', 'borin', 'willa'], // Elder Willow and Scholar Elara
        mapCoordinates: { x: 100, y: 100 } // Position within Whispering Woods region
    },
    {
        id: 'stonefangHold',
        name: 'Stonefang Hold',
        type: 'Mining Settlement',
        description: 'A hardy settlement carved into the face of the Cragged Peaks. Its intricate network of tunnels and chambers serves both as living space and mining operations.',
        regionId: 'craggedPeaks',
        npcIds: [2], // Grimbold the Trader
        mapCoordinates: { x: 400, y: 150 } // Position within Cragged Peaks region
    },
    {
        id: 'saltyWharf',
        name: 'Salty Wharf',
        type: 'Fishing Port',
        description: 'A lively port town built on stilts along the Sunken Coast. Markets filled with fresh seafood and salvaged treasures attract traders from all over.',
        regionId: 'sunkenCoast',
        npcIds: [], // Will add more NPCs later
        mapCoordinates: { x: 150, y: 350 } // Position within Sunken Coast region
    },
    {
        id: 'windriderCamp',
        name: 'Windrider Camp',
        type: 'Nomadic Settlement',
        description: 'A mobile settlement of the plains folk, following ancient migration routes across the Emerald Plains. Known for their skilled beast tamers and wind magic.',
        regionId: 'emeraldPlains',
        npcIds: [], // Will add more NPCs later
        mapCoordinates: { x: 500, y: 300 } // Position within Emerald Plains region
    }
];

/**
 * Get a town by its ID
 * 
 * @param {string} id - The ID of the town to retrieve
 * @returns {TownData | undefined} The town object or undefined if not found
 */
export const getTownById = (id: string): TownData | undefined => {
    return towns.find(town => town.id === id);
};

/**
 * Get all towns in a specific region
 * 
 * @param {string} regionId - The ID of the region
 * @returns {TownData[]} Array of towns in the specified region
 */
export const getTownsByRegion = (regionId: string): TownData[] => {
    return towns.filter(town => town.regionId === regionId);
};

/**
 * Export TownMapCoordinates and TownData interfaces for use in other files
 */
export type { TownMapCoordinates, TownData };
