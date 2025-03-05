import { RegionModelInterface } from './dataModels';

/**
 * Interface for map coordinates
 * 
 * @interface MapCoordinates
 * @property {number} x - X position on the world map
 * @property {number} y - Y position on the world map
 * @property {number} width - Width of the region on the map
 * @property {number} height - Height of the region on the map
 */
interface MapCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Extended RegionModelInterface with map coordinates
 * 
 * @interface RegionData
 * @extends RegionModelInterface
 * @property {MapCoordinates} mapCoordinates - Positioning data for the region on the world map
 */
interface RegionData extends RegionModelInterface {
  mapCoordinates: MapCoordinates;
}

/**
 * Array of region data objects that define the game world
 * 
 * @type {RegionData[]}
 */
export const regions: RegionData[] = [
    {
        id: 'whisperingWoods',
        name: 'Whispering Woods',
        description: 'A vast, ancient forest where the trees themselves seem to murmur ancient secrets. The woods are home to mysterious creatures and hold countless hidden treasures.',
        features: [
            'Giant ancient trees reaching into the clouds',
            'Mystical glades filled with luminescent plants',
            'Winding paths that seem to shift and change',
            'Sacred groves tended by forest spirits'
        ],
        dangers: [
            'Wild beasts and magical creatures',
            'Mischievous forest spirits',
            'Bandits hiding in the deep woods',
            'Getting lost in the ever-changing paths'
        ],
        resources: [
            'Ancient timber',
            'Rare medicinal herbs',
            'Magical fungi',
            'Crystal-clear spring water'
        ],
        townIds: ['oakhaven'],
        dungeonIds: ['whisperingCaves'],
        mapCoordinates: { x: 50, y: 50, width: 200, height: 150 }
    },
    {
        id: 'craggedPeaks',
        name: 'Cragged Peaks',
        description: 'Towering mountains that pierce the clouds, rich with precious minerals and ancient dwarven ruins. The harsh climate and treacherous terrain test even the hardiest adventurers.',
        features: [
            'Snow-capped mountain peaks',
            'Deep ravines and valleys',
            'Ancient dwarven ruins',
            'Rich mineral veins'
        ],
        dangers: [
            'Treacherous cliffs and unstable ground',
            'Fierce mountain creatures',
            'Harsh weather conditions',
            'Cave-ins in the mines'
        ],
        resources: [
            'Precious metals',
            'Rare gems',
            'Ancient dwarven artifacts',
            'Mountain herbs'
        ],
        townIds: ['stonefangHold'],
        dungeonIds: ['cragheartMine'],
        mapCoordinates: { x: 300, y: 100, width: 250, height: 100 }
    },
    {
        id: 'sunkenCoast',
        name: 'Sunken Coast',
        description: 'A mysterious coastline dotted with ancient ruins that rise from and sink beneath the waves with the tides. The area is rich in history and marine resources.',
        features: [
            'Tidal ruins that appear and disappear',
            'Rocky cliffs overlooking the sea',
            'Hidden coves and beaches',
            'Coral reefs teeming with life'
        ],
        dangers: [
            'Unpredictable tides',
            'Sea monsters and pirates',
            'Treacherous underwater currents',
            'Storm surges'
        ],
        resources: [
            'Fresh seafood',
            'Pearls and coral',
            'Salvaged artifacts',
            'Sea salt'
        ],
        townIds: ['saltyWharf'],
        dungeonIds: ['drownedGrotto'],
        mapCoordinates: { x: 100, y: 250, width: 200, height: 180 }
    },
    {
        id: 'emeraldPlains',
        name: 'Emerald Plains',
        description: 'Vast grasslands stretching to the horizon, home to nomadic tribes and mysterious ancient monuments. The plains change character dramatically with the seasons.',
        features: [
            'Rolling hills of tall grass',
            'Ancient stone monuments',
            'Seasonal wildflower blooms',
            'Wandering herds of creatures'
        ],
        dangers: [
            'Sudden storms and tornados',
            'Aggressive wildlife',
            'Raiders and bandits',
            'Getting lost in the endless grass'
        ],
        resources: [
            'Rich soil for farming',
            'Wild game',
            'Medicinal plants',
            'Wind energy'
        ],
        townIds: ['windriderCamp'],
        dungeonIds: ['plainMonolith'],
        mapCoordinates: { x: 400, y: 250, width: 300, height: 200 }
    }
];

/**
 * Export MapCoordinates and RegionData interfaces for use in other files
 */
export type { MapCoordinates, RegionData };
