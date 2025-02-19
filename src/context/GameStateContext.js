import React, { createContext, useReducer, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { npcs } from '../modules/data/npcs';
import { ESSENCE_COSTS, AFFINITY_LEVELS } from '../config/gameConstants';
import { saveGame, loadGame } from '../storage';
import { Snackbar, Alert } from '@mui/material';

// Action Types
const ACTION_TYPES = {
  // Player Actions
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  COPY_TRAIT: 'COPY_TRAIT',
  LEARN_SKILL: 'LEARN_SKILL',

  // Essence Actions
  GAIN_ESSENCE: 'GAIN_ESSENCE',
  SPEND_ESSENCE: 'SPEND_ESSENCE',

  // Social Actions
  UPDATE_AFFINITY: 'UPDATE_AFFINITY',
  UPDATE_NPC_OPINION: 'UPDATE_NPC_OPINION',

  // Faction Actions
  JOIN_FACTION: 'JOIN_FACTION',
  ADD_FACTION_MEMBER: 'ADD_FACTION_MEMBER',
  UPDATE_FACTION_RESOURCES: 'UPDATE_FACTION_RESOURCES',
  CREATE_FACTION: 'CREATE_FACTION',

  // Inventory Actions
  UPDATE_INVENTORY: 'UPDATE_INVENTORY',
  UPDATE_QUESTS: 'UPDATE_QUESTS',
  UPDATE_ENEMIES: 'UPDATE_ENEMIES'
};

// Reducer functions organized by domain
const playerReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PLAYER:
      return { ...state, player: applyTraitEffects(action.payload) };
    case ACTION_TYPES.COPY_TRAIT:
      return handleCopyTrait(state, action.payload);
    case ACTION_TYPES.LEARN_SKILL:
      return handleLearnSkill(state, action.payload);
    default:
      return state;
  }
};

const essenceReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_ESSENCE:
      return { ...state, essence: state.essence + action.payload };
    case ACTION_TYPES.SPEND_ESSENCE:
      return { ...state, essence: state.essence - action.payload };
    default:
      return state;
  }
};

const socialReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_AFFINITY:
      return {
        ...state,
        affinities: {
          ...state.affinities,
          [action.payload.npcId]: action.payload.level
        }
      };
    case ACTION_TYPES.UPDATE_NPC_OPINION:
      return {
        ...state,
        npcs: state.npcs.map(npc =>
          npc.id === action.payload.npcId
            ? { ...npc, opinionLevel: action.payload.opinion }
            : npc
        )
      };
    default:
      return state;
  }
};

const factionReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.JOIN_FACTION:
    case ACTION_TYPES.ADD_FACTION_MEMBER:
    case ACTION_TYPES.UPDATE_FACTION_RESOURCES:
    case ACTION_TYPES.CREATE_FACTION:
      return handleFactionAction(state, action);
    default:
      return state;
  }
};

const gameReducer = (state, action) => {
  // Try each domain reducer in sequence
  const newState = playerReducer(
    essenceReducer(
      socialReducer(
        factionReducer(state, action),
        action
      ),
      action
    ),
    action
  );

  // Handle any remaining generic actions
  switch (action.type) {
    case ACTION_TYPES.UPDATE_INVENTORY:
      return { ...newState, inventory: action.payload };
    case ACTION_TYPES.UPDATE_QUESTS:
      return { ...newState, quests: action.payload };
    case ACTION_TYPES.UPDATE_ENEMIES:
      return { ...newState, enemies: action.payload };
    default:
      return newState;
  }
};

// Context creation
export const GameStateContext = createContext();
export const GameDispatchContext = createContext();

// Custom hooks for selecting specific state slices
export const usePlayerState = () => {
  const { player } = useContext(GameStateContext);
  return player;
};

export const useEssence = () => {
  const { essence } = useContext(GameStateContext);
  return essence;
};

export const useAffinities = () => {
  const { affinities } = useContext(GameStateContext);
  return affinities;
};

export const useFactions = () => {
  const { factions } = useContext(GameStateContext);
  return factions;
};

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Provider component
export const GameProvider = ({ children }) => {
  const [loadError, setLoadError] = useState(null);
  const [showLoadNotification, setShowLoadNotification] = useState(false);

  // Initialize state with saved game data or default initial state
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    try {
      const savedGame = loadGame();
      if (savedGame) {
        setShowLoadNotification(true);
        return savedGame;
      }
      return initialState;
    } catch (err) {
      setLoadError('Failed to load saved game. Starting new game...');
      return initialState;
    }
  });

  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Create debounced save function
  const debouncedSave = useMemo(
    () => debounce((gameState) => {
      const saved = saveGame(gameState);
      if (saved) {
        setShowSaveNotification(true);
      }
    }, 1000),
    []
  );

  // Save game state when it changes
  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  // Memoized dispatch with save feedback
  const memoizedDispatch = useCallback((action) => {
    dispatch(action);
  }, []);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={memoizedDispatch}>
        {children}
        <Snackbar
          open={showSaveNotification}
          autoHideDuration={2000}
          onClose={() => setShowSaveNotification(false)}
          message="Game saved"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        <Snackbar
          open={showLoadNotification}
          autoHideDuration={3000}
          onClose={() => setShowLoadNotification(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowLoadNotification(false)}>
            Game loaded successfully!
          </Alert>
        </Snackbar>
        {loadError && (
          <Snackbar
            open={!!loadError}
            autoHideDuration={5000}
            onClose={() => setLoadError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="warning" onClose={() => setLoadError(null)}>
              {loadError}
            </Alert>
          </Snackbar>
        )}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

// Action creators
export const createEssenceAction = {
  gain: (amount) => ({
    type: ACTION_TYPES.GAIN_ESSENCE,
    payload: amount
  }),
  spend: (amount) => ({
    type: ACTION_TYPES.SPEND_ESSENCE,
    payload: amount
  })
};

export const createAffinityAction = {
  update: (npcId, level) => ({
    type: ACTION_TYPES.UPDATE_AFFINITY,
    payload: { npcId, level }
  })
};

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

const handleCopyTrait = (state, payload) => {
  const { traitId, essenceCost } = payload;
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
};

const handleLearnSkill = (state, payload) => {
  const { skillId, goldCost } = payload;
  const skill = state.skills.physical[skillId] || state.skills.mental[skillId];
  
  if (!skill || state.player.gold < goldCost || 
      state.player.learnedSkills.includes(skillId)) {
    return state;
  }

  const updatedPlayer = {
    ...state.player,
    gold: state.player.gold - goldCost,
    learnedSkills: [...state.player.learnedSkills, skillId]
  };

  return {
    ...state,
    player: updatedPlayer
  };
};

const handleFactionAction = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.JOIN_FACTION: {
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

    case ACTION_TYPES.ADD_FACTION_MEMBER: {
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

    case ACTION_TYPES.UPDATE_FACTION_RESOURCES: {
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

    case ACTION_TYPES.CREATE_FACTION: {
      const { faction } = action.payload;
      return {
        ...state,
        factions: [...state.factions, faction]
      };
    }

    default:
      return state;
  }
};