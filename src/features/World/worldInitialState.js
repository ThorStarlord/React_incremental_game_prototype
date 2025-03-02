/**
 * @file WorldInitialState.js
 * @description Defines the initial state of the game world for the incremental RPG.
 * This file contains all the default values and configurations for world regions,
 * global properties, events and other world-related state.
 */

/**
 * Initial world state for the game
 * 
 * @typedef {Object} WorldState
 * @property {Object} globalProperties - Global properties affecting the entire world
 * @property {number} globalProperties.worldLevel - Current level/tier of the world
 * @property {number} globalProperties.daysPassed - Number of in-game days passed
 * @property {string} globalProperties.currentSeason - Current season in the world
 * @property {boolean} globalProperties.isNight - Whether it's currently night time
 * @property {Object} regions - Collection of world regions
 * @property {Array} activeEvents - Currently active world events
 * @property {Object} discoveryStatus - Tracks what the player has discovered
 */

const worldInitialState = {
  globalProperties: {
    worldLevel: 1,
    daysPassed: 0,
    currentSeason: 'spring',
    isNight: false,
    weatherCondition: 'clear',
    difficultyMultiplier: 1.0,
  },
  
  // Regions organized by area - each with unique properties
  regions: {
    // Starting zone: Forest
    forest: {
      name: 'Whispering Woods',
      description: 'A peaceful forest teeming with wildlife and basic resources.',
      unlocked: true,
      explored: 0.05, // percentage of region explored
      dangerLevel: 1,
      resources: {
        wood: { available: true, abundance: 'high' },
        herbs: { available: true, abundance: 'medium' },
        stones: { available: true, abundance: 'low' },
      },
      monsters: {
        wolf: { level: 1, spawnRate: 0.3 },
        goblin: { level: 2, spawnRate: 0.1 },
      },
      locations: [
        { id: 'clearing', name: 'Forest Clearing', discovered: true },
        { id: 'cave', name: 'Hidden Cave', discovered: false },
      ]
    },
    
    // Second region: Mountains
    mountains: {
      name: 'Craggy Heights',
      description: 'Rugged mountains with valuable minerals and dangerous creatures.',
      unlocked: false,
      explored: 0,
      dangerLevel: 3,
      resources: {
        ore: { available: true, abundance: 'high' },
        gems: { available: true, abundance: 'low' },
        herbs: { available: true, abundance: 'low' },
      },
      monsters: {
        bear: { level: 3, spawnRate: 0.2 },
        harpy: { level: 4, spawnRate: 0.1 },
      },
      locations: [
        { id: 'peak', name: 'Mountain Peak', discovered: false },
        { id: 'mine', name: 'Abandoned Mine', discovered: false },
      ],
      unlockRequirements: {
        playerLevel: 5,
        questCompleted: 'forest_guardian',
      }
    },
    
    // Third region: Swamp
    swamp: {
      name: 'Murky Marshes',
      description: 'A dangerous swamp filled with poisonous creatures and rare alchemical ingredients.',
      unlocked: false,
      explored: 0,
      dangerLevel: 5,
      resources: {
        mushrooms: { available: true, abundance: 'high' },
        poisonGlands: { available: true, abundance: 'medium' },
        rarePlants: { available: true, abundance: 'medium' },
      },
      monsters: {
        alligator: { level: 5, spawnRate: 0.2 },
        poisonFrog: { level: 4, spawnRate: 0.3 },
        bogCreature: { level: 7, spawnRate: 0.05 },
      },
      locations: [
        { id: 'shack', name: 'Witch\'s Shack', discovered: false },
        { id: 'deadTree', name: 'Ancient Dead Tree', discovered: false },
      ],
      unlockRequirements: {
        playerLevel: 10,
        questCompleted: 'mountain_king',
      }
    },
  },
  
  // Currently active world events
  activeEvents: [],
  
  // Event templates that can occur in the world
  possibleEvents: {
    goblinRaid: {
      name: 'Goblin Raid',
      description: 'A band of goblins is attacking nearby settlements.',
      duration: 3, // days
      affectedRegions: ['forest'],
      effects: {
        resourceGeneration: 0.8, // reduced by 20%
        monsterSpawnRate: 1.5, // increased by 50%
      }
    },
    festival: {
      name: 'Harvest Festival',
      description: 'A time of celebration and abundance.',
      duration: 2,
      affectedRegions: ['forest', 'mountains'],
      effects: {
        resourceGeneration: 1.2,
        trading: 1.3 // better prices
      }
    },
  },
  
  // Player's world discovery status
  discoveryStatus: {
    totalDiscovered: 0.01, // percentage of total world discovered
    foundSecrets: 0,
    unlockedLore: [],
  },
  
  // World-building lore fragments
  loreFragments: [
    { 
      id: 'world_origin',
      title: 'The Creation',
      content: 'Long ago, the world was formed from the dreams of ancient beings...',
      discovered: false
    },
    { 
      id: 'forest_spirits',
      title: 'Spirits of the Forest',
      content: 'The whispering woods are home to ancient spirits that guard the trees...',
      discovered: false
    },
  ]
};

export default worldInitialState;
