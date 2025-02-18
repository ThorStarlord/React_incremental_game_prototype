import React, { createContext, useReducer } from 'react';
import { npcs } from '../modules/data/npcs';

const applyTraitEffects = (player) => {
  let modifiedPlayer = { ...player };
  
  player.acquiredTraits.forEach(traitId => {
    switch(traitId) {
      case 'BargainingMaster':
        // Applied when calculating shop prices
        modifiedPlayer.shopDiscount = 0.05;
        break;
      case 'QuickLearner':
        // Applied when gaining XP
        modifiedPlayer.xpMultiplier = 1.1;
        break;
      case 'MentorsInsight':
        // Applied when gaining stat points
        modifiedPlayer.statPointBonus = 1;
        break;
      default:
        break;
    }
  });

  return modifiedPlayer;
};

const initialState = {
  player: {
    id: 'player1', // Added player ID for member list reference
    name: "Hero",
    hp: 100,
    attack: 10,
    defense: 5,
    statPoints: 0,
    essence: 0,
    gold: 0,
    acquiredTraits: [],
    learnedSkills: [],
    factionId: 1, // Player starts as part of the Mystic Order
    factionRole: 'Member', // Player starts as a regular member
  },
  
  factions: [
    {
      id: 1,
      name: "Mystic Order",
      type: "Knowledge",
      level: 1,
      description: "Seekers of ancient wisdom and forbidden knowledge",
      memberCount: 5, // Starting with some existing members
      buildings: [],
      upgrades: [],
      resources: {
        influence: 100, // Starting with some initial resources
        knowledge: 50,
      },
      members: [
        {
          id: 'npc1',
          name: "Elder Willow",
          role: 'Leader',
          type: 'NPC'
        },
        {
          id: 'npc2',
          name: "Scholar Elara",
          role: 'Senior Member',
          type: 'NPC'
        },
        {
          id: 'npc3',
          name: "Apprentice Jin",
          role: 'Member',
          type: 'NPC'
        },
        {
          id: 'npc4',
          name: "Sage Theron",
          role: 'Senior Member',
          type: 'NPC'
        },
        {
          id: 'player1',
          name: "Hero",
          role: 'Member',
          type: 'Player'
        }
      ]
    }
  ],

  npcs,

  traits: {
    copyableTraits: {
      BargainingMaster: {
        name: "Bargaining Master",
        description: "Reduces shop prices by 5%",
        essenceCost: 50,
        type: "Social"
      },
      QuickLearner: {
        name: "Quick Learner",
        description: "Increases XP gain by 10%",
        essenceCost: 75,
        type: "Knowledge"
      },
      MentorsInsight: {
        name: "Mentor's Insight",
        description: "Increases Stat Points gained by 1",
        essenceCost: 60,
        type: "Knowledge"
      }
    },
    monsterTraits: {
      GoblinNimbleness: {
        name: "Goblin Nimbleness",
        description: "Slightly increased evasion"
      },
      StoneSkin: {
        name: "Stone Skin",
        description: "Slightly increased defense"
      },
      PoisonSpores: {
        name: "Poison Spores",
        description: "Deals poison damage over time"
      },
      CrystallineBody: {
        name: "Crystalline Body",
        description: "High defense but vulnerable to crushing blows"
      },
      DwarvenTech: {
        name: "Dwarven Technology",
        description: "Uses ancient machinery to enhance attacks"
      },
      StonePhasing: {
        name: "Stone Phasing",
        description: "Can move through rock and surprise attackers"
      },
      CoralArmor: {
        name: "Coral Armor",
        description: "Regenerates armor when in contact with water"
      },
      WaterForm: {
        name: "Water Form",
        description: "Can become liquid to avoid attacks"
      },
      TimeShift: {
        name: "Time Shift",
        description: "Occasionally phases out of time to avoid damage"
      },
      RuneShield: {
        name: "Rune Shield",
        description: "Ancient runes provide magical protection"
      }
    }
  },

  skills: {
    physical: {
      PowerStrike: {
        name: "Power Strike",
        description: "Deals extra damage in one attack",
        goldCost: 100
      },
      DefensiveStance: {
        name: "Defensive Stance",
        description: "Temporarily increase defense",
        goldCost: 80
      }
    },
    mental: {
      AnalyzeWeakness: {
        name: "Analyze Weakness",
        description: "Reduces enemy defense for a short time",
        goldCost: 120
      },
      FocusMind: {
        name: "Focus Mind",
        description: "Temporarily increase mental stats",
        goldCost: 90
      }
    }
  },

  inventory: [],
  quests: [],
  enemies: [
    {
      id: 1,
      name: "Forest Goblin",
      hp: 30,
      attack: 4,
      defense: 2,
      essenceDrop: 5,
      goldDrop: 10,
      portrait: "goblin_portrait",
      traits: ["GoblinNimbleness"]
    },
    {
      id: 2,
      name: "Cave Rat",
      hp: 20,
      attack: 3,
      defense: 1,
      essenceDrop: 3,
      goldDrop: 5,
      portrait: "rat_portrait",
      traits: []
    },
    {
      id: 3,
      name: "Stone Golem",
      hp: 80,
      attack: 6,
      defense: 8,
      essenceDrop: 15,
      goldDrop: 25,
      portrait: "golem_portrait",
      traits: ["StoneSkin"]
    }
  ],
  essence: 100, // Starting Essence value
  affinities: {}
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYER':
      const updatedPlayer = applyTraitEffects(action.payload);
      return { ...state, player: updatedPlayer };
      
    case 'COPY_TRAIT': {
      const { traitId, essenceCost } = action.payload;
      const trait = state.traits.copyableTraits[traitId];
      
      if (!trait || state.player.essence < essenceCost || 
          state.player.acquiredTraits.includes(traitId)) {
        return state;
      }

      const updatedPlayer = {
        ...state.player,
        essence: state.player.essence - essenceCost,
        acquiredTraits: [...state.player.acquiredTraits, traitId]
      };

      return {
        ...state,
        player: applyTraitEffects(updatedPlayer)
      };
    }

    case 'UPDATE_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'UPDATE_QUESTS':
      return { ...state, quests: action.payload };
    case 'UPDATE_ENEMIES':
      return { ...state, enemies: action.payload };
    case 'UPDATE_NPC_OPINION':
      return {
        ...state,
        npcs: state.npcs.map(npc =>
          npc.id === action.payload.npcId
            ? { ...npc, opinionLevel: action.payload.opinion }
            : npc
        )
      };
    case 'JOIN_FACTION': {
      const { factionId, role = 'Member' } = action.payload;
      const faction = state.factions.find(f => f.id === factionId);
      
      if (!faction) return state;

      const updatedFactions = state.factions.map(f => {
        if (f.id === factionId) {
          return {
            ...f,
            memberCount: f.memberCount + 1,
            members: [...f.members, {
              id: state.player.id,
              name: state.player.name,
              role,
              type: 'Player'
            }]
          };
        }
        return f;
      });

      const updatedPlayer = {
        ...state.player,
        factionId,
        factionRole: role
      };

      return {
        ...state,
        factions: updatedFactions,
        player: updatedPlayer
      };
    }

    case 'ADD_FACTION_MEMBER': {
      const { factionId, member } = action.payload;
      return {
        ...state,
        factions: state.factions.map(f => {
          if (f.id === factionId) {
            return {
              ...f,
              memberCount: f.memberCount + 1,
              members: [...f.members, member]
            };
          }
          return f;
        })
      };
    }

    case 'UPDATE_FACTION_RESOURCES': {
      const { factionId, resources } = action.payload;
      return {
        ...state,
        factions: state.factions.map(f => {
          if (f.id === factionId) {
            return {
              ...f,
              resources: {
                ...f.resources,
                ...resources
              }
            };
          }
          return f;
        })
      };
    }

    case 'GAIN_ESSENCE':
      return {
        ...state,
        essence: state.essence + action.payload
      };
    case 'SPEND_ESSENCE':
      return {
        ...state,
        essence: state.essence - action.payload
      };
    case 'UPDATE_AFFINITY':
      return {
        ...state,
        affinities: {
          ...state.affinities,
          [action.payload.npcId]: action.payload.level
        }
      };
    default:
      return state;
  }
};

export const GameStateContext = createContext();
export const GameDispatchContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};