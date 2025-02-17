import { RegionModel } from './dataModels';

export const regions = [
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
        dungeonIds: ['whisperingCaves']
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
        dungeonIds: ['cragheartMine']
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
        dungeonIds: ['drownedGrotto']
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
        dungeonIds: ['plainMonolith']
    }
];