import { DungeonModel } from './dataModels';

export const dungeons = [
    {
        id: 'whisperingCaves',
        name: 'The Whispering Caves',
        type: 'Cave System',
        description: 'A vast network of caves beneath the Whispering Woods, where echoes of ancient magic still resonate. The caves are known for their unique fungi and mysterious crystals.',
        regionId: 'whisperingWoods',
        dangers: [
            'Poisonous fungi',
            'Cave-dwelling beasts',
            'Magical anomalies',
            'Unstable crystal formations'
        ],
        rewards: [
            'Luminous crystals',
            'Rare magical fungi',
            'Ancient artifacts',
            'Magical essence deposits'
        ]
    },
    {
        id: 'cragheartMine',
        name: 'Cragheart Mine',
        type: 'Ancient Mine',
        description: 'An abandoned dwarven mine deep within the Cragged Peaks. The mine holds valuable minerals and remnants of dwarven ingenuity, but also deadly traps.',
        regionId: 'craggedPeaks',
        dangers: [
            'Collapsing tunnels',
            'Ancient defense mechanisms',
            'Territorial rock creatures',
            'Toxic gas pockets'
        ],
        rewards: [
            'Precious gems',
            'Rare metals',
            'Dwarven artifacts',
            'Ancient technology'
        ]
    },
    {
        id: 'drownedGrotto',
        name: 'The Drowned Grotto',
        type: 'Sea Grotto',
        description: 'A partially submerged cave system along the Sunken Coast. Ancient ruins suggest it was once a temple or palace, now claimed by the sea.',
        regionId: 'sunkenCoast',
        dangers: [
            'Flooding chambers',
            'Aggressive sea creatures',
            'Sharp coral formations',
            'Ancient curses'
        ],
        rewards: [
            'Lost treasures',
            'Rare pearls',
            'Ancient scrolls',
            'Magical coral'
        ]
    },
    {
        id: 'plainMonolith',
        name: 'Monolith of the Plains',
        type: 'Ancient Monument',
        description: 'A towering stone structure of unknown origin standing amid the Emerald Plains. Its surfaces are covered in mysterious runes that seem to shift and change.',
        regionId: 'emeraldPlains',
        dangers: [
            'Reality distortions',
            'Time anomalies',
            'Energy surges',
            'Memory loss'
        ],
        rewards: [
            'Ancient knowledge',
            'Mysterious artifacts',
            'Powerful runes',
            'Forgotten magic'
        ]
    }
];