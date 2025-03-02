/**
 * @file Initial state configuration for the Minions feature
 * @description Defines the starting state of all minion-related data in the game,
 *              including available minion types, their properties, and player's owned minions.
 */

/**
 * Initial state for the minions feature
 * @typedef {Object} MinionsState
 * @property {Object} playerMinions - Minions currently owned by the player
 * @property {Array} availableMinions - All possible minion types that can be acquired
 * @property {Object} upgrades - Global and specific upgrades for minions
 * @property {Object} stats - Statistics tracking for minions
 */
const minionsInitialState = {
  /**
   * Minions currently owned by the player
   * @type {Object.<string, number>}
   */
  playerMinions: {
    // No minions owned at the beginning
  },

  /**
   * All available minion types that can be acquired in the game
   * @type {Array.<Object>}
   */
  availableMinions: [
    {
      id: 'peasant',
      name: 'Peasant',
      description: 'A humble worker that generates a small amount of gold.',
      baseProduction: {
        gold: 1,
      },
      baseCost: {
        gold: 10,
      },
      costScaling: 1.15, // Each new minion costs 15% more
      unlocked: true, // Available from the start
      tier: 1,
      maxLevel: 1000,
      icon: 'peasant-icon',
    },
    {
      id: 'miner',
      name: 'Miner',
      description: 'Extracts minerals from the earth, generating stone and occasionally gems.',
      baseProduction: {
        stone: 1,
        gems: 0.02,
      },
      baseCost: {
        gold: 50,
      },
      costScaling: 1.18,
      unlocked: false,
      unlockRequirement: {
        gold: 100,
        peasants: 5,
      },
      tier: 1,
      maxLevel: 800,
      icon: 'miner-icon',
    },
    {
      id: 'warrior',
      name: 'Warrior',
      description: 'Protects your kingdom and brings in combat experience points.',
      baseProduction: {
        experience: 1,
      },
      baseCost: {
        gold: 120,
        stone: 30,
      },
      costScaling: 1.2,
      unlocked: false,
      unlockRequirement: {
        gold: 250,
      },
      tier: 2,
      maxLevel: 500,
      icon: 'warrior-icon',
    },
    {
      id: 'wizard',
      name: 'Wizard',
      description: 'Studies the arcane arts and produces mana for spells.',
      baseProduction: {
        mana: 2,
      },
      baseCost: {
        gold: 500,
        gems: 5,
      },
      costScaling: 1.25,
      unlocked: false,
      unlockRequirement: {
        experience: 100,
        warriors: 10,
      },
      tier: 3,
      maxLevel: 300,
      icon: 'wizard-icon',
    },
  ],

  /**
   * Upgrades that affect minion productivity and other attributes
   * @type {Object}
   */
  upgrades: {
    global: [
      {
        id: 'better_tools',
        name: 'Better Tools',
        description: 'Increases all minion production by 25%',
        cost: { gold: 500 },
        multiplier: { production: 1.25 },
        purchased: false,
        unlocked: false,
        unlockRequirement: {
          totalMinions: 20
        },
      }
    ],
    specific: {
      peasant: [
        {
          id: 'peasant_training',
          name: 'Basic Training',
          description: 'Peasants produce 50% more gold',
          cost: { gold: 250 },
          multiplier: { production: 1.5 },
          purchased: false,
          unlocked: true,
        }
      ],
      // Add more minion-specific upgrades as needed
    }
  },

  /**
   * Statistics for tracking minion-related metrics
   * @type {Object}
   */
  stats: {
    totalMinionsEverOwned: 0,
    totalProduction: {
      gold: 0,
      stone: 0,
      gems: 0,
      mana: 0,
      experience: 0,
    },
    highestMinion: {
      type: null,
      count: 0
    },
  },
};

export default minionsInitialState;
