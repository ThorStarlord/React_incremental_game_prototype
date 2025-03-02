/**
 * @file factionsInitialState.js
 * @description Defines the initial state for all factions in the game.
 * 
 * Factions represent different groups in the game world that the player can interact with.
 * Players can gain or lose reputation with factions through various actions such as:
 * - Completing faction-specific quests
 * - Donating valuable items
 * - Defeating enemies associated with the faction or rival factions
 * - Making choices in dialogues and events
 * 
 * Each faction has reputation tiers that unlock various benefits as the player progresses:
 * - Access to unique vendors and merchandise
 * - Special quests and storylines
 * - Unique abilities or bonuses
 * - Access to restricted areas
 * - Discounts on goods and services
 * 
 * @typedef {Object} ReputationTier
 * @property {string} name - Name of the reputation tier (e.g., "Hostile", "Neutral", "Friendly")
 * @property {number} threshold - Minimum reputation required to reach this tier
 * @property {string[]} benefits - List of benefits unlocked at this tier
 * 
 * @typedef {Object} FactionUnlockRequirement
 * @property {number} [playerLevel] - Minimum player level required
 * @property {string} [questCompleted] - ID of a quest that must be completed
 * @property {number} [combatVictories] - Number of combat victories required
 * @property {number} [stealthMissions] - Number of stealth missions completed
 * @property {string[]} [otherFactions] - IDs of other factions that must be at certain levels
 * 
 * @typedef {Object} Faction
 * @property {string} id - Unique identifier for the faction
 * @property {string} name - Display name of the faction
 * @property {string} description - Brief lore description and background
 * @property {number} reputation - Current reputation level with the faction (0-100)
 * @property {boolean} unlocked - Whether the faction is discovered by the player
 * @property {FactionUnlockRequirement} unlockRequirements - Requirements to unlock this faction
 * @property {ReputationTier[]} reputationTiers - Available reputation tiers with thresholds and benefits
 * @property {string[]} allies - IDs of allied factions (reputation gains can affect allies positively)
 * @property {string[]} enemies - IDs of enemy factions (reputation gains can affect enemies negatively)
 * @property {string} specialCurrency - Name of faction-specific currency (if applicable)
 * @property {number} specialCurrencyAmount - Amount of faction-specific currency the player has
 * @property {Object} [perks] - Passive perks that apply when at certain reputation levels
 */

const factionsInitialState = {
  // Configuration for the faction system
  config: {
    reputationDecayEnabled: false,
    reputationDecayRate: 1, // Points per day
    maxReputation: 100,
    minReputation: -100,
    allyReputationTransferRate: 0.2, // 20% of reputation changes affect allies
    enemyReputationTransferRate: -0.1 // 10% of reputation changes negatively affect enemies
  },
  
  // Active faction-related effects
  activeEffects: [],
  
  // Individual factions
  factions: {
    merchants_guild: {
      id: "merchants_guild",
      name: "Merchants Guild",
      description: "A powerful coalition of traders and merchants who control much of the realm's commerce. They value profit, fair trade, and economic growth above all else.",
      reputation: 0,
      unlocked: true, // Starting faction that's unlocked by default
      unlockRequirements: {},
      reputationTiers: [
        {
          name: "Unknown",
          threshold: 0,
          benefits: []
        },
        {
          name: "Acquaintance",
          threshold: 10,
          benefits: ["5% discount at guild shops"]
        },
        {
          name: "Associate",
          threshold: 25,
          benefits: ["10% discount at guild shops", "Access to basic trade contracts"]
        },
        {
          name: "Partner",
          threshold: 50,
          benefits: ["15% discount at guild shops", "Access to advanced trade contracts", "Daily gold delivery"]
        },
        {
          name: "Benefactor",
          threshold: 75,
          benefits: ["25% discount at guild shops", "Access to exclusive merchandise", "Merchant summon ability"]
        }
      ],
      allies: ["crafters_union"],
      enemies: ["thieves_den"],
      specialCurrency: "Trade Tokens",
      specialCurrencyAmount: 0,
      perks: {
        goldGain: {
          value: 0.05,
          minReputation: 25
        }
      }
    },
    
    mages_conclave: {
      id: "mages_conclave",
      name: "Mages Conclave",
      description: "An ancient organization of spellcasters dedicated to the study and regulation of magic. They seek to expand magical knowledge while ensuring its responsible use.",
      reputation: 0,
      unlocked: false,
      unlockRequirements: {
        playerLevel: 5,
        questCompleted: "strange_energies"
      },
      reputationTiers: [
        {
          name: "Outsider",
          threshold: 0,
          benefits: []
        },
        {
          name: "Initiate",
          threshold: 10,
          benefits: ["Access to basic spell scrolls"]
        },
        {
          name: "Apprentice",
          threshold: 25,
          benefits: ["Access to intermediate spell scrolls", "Minor mana regeneration boost"]
        },
        {
          name: "Adept",
          threshold: 50,
          benefits: ["Access to advanced spell scrolls", "Moderate mana regeneration boost", "Daily mana potion"]
        },
        {
          name: "Archmage",
          threshold: 75,
          benefits: ["Access to master spell scrolls", "Major mana regeneration boost", "Portal network access"]
        }
      ],
      allies: ["scholars_archive"],
      enemies: ["wild_hunters"],
      specialCurrency: "Arcane Shards",
      specialCurrencyAmount: 0,
      perks: {
        spellPower: {
          value: 0.05,
          minReputation: 25
        }
      }
    },
    
    warriors_guild: {
      id: "warriors_guild",
      name: "Warriors Guild",
      description: "A brotherhood of fighters, soldiers and mercenaries who offer their martial services. They value strength, honor, and martial prowess above all else.",
      reputation: 0,
      unlocked: false,
      unlockRequirements: {
        playerLevel: 3,
        combatVictories: 10
      },
      reputationTiers: [
        {
          name: "Stranger",
          threshold: 0,
          benefits: []
        },
        {
          name: "Recruit",
          threshold: 10,
          benefits: ["Access to basic combat training", "5% damage boost"]
        },
        {
          name: "Soldier",
          threshold: 25,
          benefits: ["Access to advanced combat training", "10% damage boost", "Basic armor upgrades"]
        },
        {
          name: "Veteran",
          threshold: 50,
          benefits: ["Access to expert combat training", "15% damage boost", "Advanced armor upgrades", "Combat ally summon"]
        },
        {
          name: "Champion",
          threshold: 75,
          benefits: ["Access to master combat training", "25% damage boost", "Elite armor upgrades", "Battlefield advantage abilities"]
        }
      ],
      allies: ["royal_vanguard"],
      enemies: ["shadow_syndicate"],
      specialCurrency: "Valor Marks",
      specialCurrencyAmount: 0,
      perks: {
        physicalDamage: {
          value: 0.1,
          minReputation: 25
        }
      }
    },
    
    thieves_den: {
      id: "thieves_den",
      name: "Thieves Den",
      description: "A secretive network of rogues, cutpurses, and shadowy figures operating in the realm's underbelly. They value cunning, wealth, and freedom from authority.",
      reputation: 0,
      unlocked: false,
      unlockRequirements: {
        questCompleted: "shadows_in_the_night",
        stealthMissions: 5
      },
      reputationTiers: [
        {
          name: "Mark",
          threshold: 0,
          benefits: []
        },
        {
          name: "Footpad",
          threshold: 10,
          benefits: ["Fence access for stolen goods", "5% critical strike chance"]
        },
        {
          name: "Prowler",
          threshold: 25,
          benefits: ["Improved fence rates", "10% critical strike chance", "Basic stealth techniques"]
        },
        {
          name: "Shadow",
          threshold: 50,
          benefits: ["Premium fence rates", "15% critical strike chance", "Advanced stealth techniques", "Lockpicking ability"]
        },
        {
          name: "Nightmaster",
          threshold: 75,
          benefits: ["Elite fence rates", "20% critical strike chance", "Master stealth techniques", "Safe house access"]
        }
      ],
      allies: ["shadow_syndicate"],
      enemies: ["royal_vanguard", "merchants_guild"],
      specialCurrency: "Shadow Marks",
      specialCurrencyAmount: 0,
      perks: {
        stealthBonus: {
          value: 0.15,
          minReputation: 25
        }
      }
    },
    
    wild_hunters: {
      id: "wild_hunters",
      name: "Wild Hunters",
      description: "A tribe of hunters and druids who worship the old ways and protect the natural world. They value harmony with nature and the preservation of ancient traditions.",
      reputation: 0,
      unlocked: false,
      unlockRequirements: {
        playerLevel: 5,
        questCompleted: "forest_whispers"
      },
      reputationTiers: [
        {
          name: "Outsider",
          threshold: 0,
          benefits: []
        },
        {
          name: "Visitor",
          threshold: 10,
          benefits: ["Access to basic natural remedies", "Forest path shortcuts"]
        },
        {
          name: "Friend",
          threshold: 25,
          benefits: ["Access to uncommon herbs", "Animal companion services", "Hunting ground access"]
        },
        {
          name: "Kin",
          threshold: 50,
          benefits: ["Access to rare herbs", "Advanced animal companions", "Druidic rituals"]
        },
        {
          name: "Elder",
          threshold: 75,
          benefits: ["Access to legendary herbs", "Shapeshifting abilities", "Nature's blessing (resource boost)"]
        }
      ],
      allies: ["ancient_grove"],
      enemies: ["mages_conclave", "royal_vanguard"],
      specialCurrency: "Spirit Totems",
      specialCurrencyAmount: 0,
      perks: {
        resourceGathering: {
          value: 0.2,
          minReputation: 25
        }
      }
    }
  }
};

export default factionsInitialState;
