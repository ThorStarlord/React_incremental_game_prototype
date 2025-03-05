/**
 * Interface for dungeon enemy
 * 
 * @interface Enemy
 * @property {string} id - Unique identifier for the enemy
 * @property {string} name - Name of the enemy
 * @property {number} hp - Hit points/health of the enemy
 * @property {number} attack - Attack power of the enemy
 * @property {number} defense - Defense value of the enemy
 * @property {number} essenceDrop - Amount of essence dropped when defeated
 * @property {number} goldDrop - Amount of gold dropped when defeated
 * @property {string} portrait - Asset name for the enemy portrait
 * @property {string[]} traits - Special traits/abilities of the enemy
 */
interface Enemy {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  essenceDrop: number;
  goldDrop: number;
  portrait: string;
  traits: string[];
}

/**
 * Mapping of dungeon IDs to their enemy lists
 * 
 * @type {Record<string, Enemy[]>}
 */
export const dungeonEnemies: Record<string, Enemy[]> = {
    'whisperingCaves': [
        {
            id: 'wc_1',
            name: "Cave Mushroom Guardian",
            hp: 40,
            attack: 5,
            defense: 3,
            essenceDrop: 8,
            goldDrop: 15,
            portrait: "mushroom_guardian_portrait",
            traits: ["PoisonSpores"]
        },
        {
            id: 'wc_2',
            name: "Crystal Golem",
            hp: 60,
            attack: 7,
            defense: 6,
            essenceDrop: 12,
            goldDrop: 20,
            portrait: "crystal_golem_portrait",
            traits: ["CrystallineBody"]
        }
    ],
    'cragheartMine': [
        {
            id: 'cm_1',
            name: "Automated Defender",
            hp: 50,
            attack: 8,
            defense: 5,
            essenceDrop: 10,
            goldDrop: 18,
            portrait: "defender_portrait",
            traits: ["DwarvenTech"]
        },
        {
            id: 'cm_2',
            name: "Rock Wraith",
            hp: 70,
            attack: 6,
            defense: 8,
            essenceDrop: 15,
            goldDrop: 25,
            portrait: "wraith_portrait",
            traits: ["StonePhasing"]
        }
    ],
    'drownedGrotto': [
        {
            id: 'dg_1',
            name: "Coral Sentinel",
            hp: 45,
            attack: 6,
            defense: 4,
            essenceDrop: 9,
            goldDrop: 16,
            portrait: "coral_sentinel_portrait",
            traits: ["CoralArmor"]
        },
        {
            id: 'dg_2',
            name: "Tide Elemental",
            hp: 55,
            attack: 7,
            defense: 5,
            essenceDrop: 11,
            goldDrop: 22,
            portrait: "elemental_portrait",
            traits: ["WaterForm"]
        }
    ],
    'plainMonolith': [
        {
            id: 'pm_1',
            name: "Time Phantom",
            hp: 40,
            attack: 9,
            defense: 3,
            essenceDrop: 13,
            goldDrop: 21,
            portrait: "phantom_portrait",
            traits: ["TimeShift"]
        },
        {
            id: 'pm_2',
            name: "Rune Construct",
            hp: 65,
            attack: 6,
            defense: 7,
            essenceDrop: 14,
            goldDrop: 23,
            portrait: "construct_portrait",
            traits: ["RuneShield"]
        }
    ]
};

/**
 * Export the Enemy interface for use in other files
 */
export type { Enemy };
