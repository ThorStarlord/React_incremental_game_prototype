import React, { createContext, useReducer, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { npcs } from '../modules/data/npcs';
import { ESSENCE_COSTS, AFFINITY_LEVELS, RELATIONSHIP_TIERS } from '../config/gameConstants';
import { saveGame, loadGame } from '../storage';
import { Snackbar, Alert } from '@mui/material';
import { traits as traitsData } from '../modules/data/traits';

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
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  MOVE_ITEM: 'MOVE_ITEM',
  USE_ITEM: 'USE_ITEM',

  // Other Actions
  UPDATE_QUESTS: 'UPDATE_QUESTS',
  UPDATE_ENEMIES: 'UPDATE_ENEMIES',

  // NPC Actions
  UPDATE_NPC_RELATIONSHIP: 'UPDATE_NPC_RELATIONSHIP',
  UPDATE_DIALOGUE_STATE: 'UPDATE_DIALOGUE_STATE',
  DECAY_RELATIONSHIPS: 'DECAY_RELATIONSHIPS',

  // Trait Actions
  EQUIP_TRAIT: 'EQUIP_TRAIT',
  UNEQUIP_TRAIT: 'UNEQUIP_TRAIT',

  // Upgrade Actions
  UPGRADE_TRAIT_SLOTS: 'UPGRADE_TRAIT_SLOTS',

  // Initialization Action
  INITIALIZE_GAME_DATA: 'INITIALIZE_GAME_DATA',

  // Reorder Equipped Traits Action
  REORDER_EQUIPPED_TRAITS: 'REORDER_EQUIPPED_TRAITS',
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
    case ACTION_TYPES.EQUIP_TRAIT: {
      const traitId = action.payload;
      
      // Check if trait is already equipped or player has slots available
      if (
        state.player.equippedTraits.includes(traitId) ||
        state.player.equippedTraits.length >= state.player.traitSlots
      ) {
        return state;
      }

      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: [...state.player.equippedTraits, traitId]
        }
      };
    }
    case ACTION_TYPES.UNEQUIP_TRAIT: {
      const traitId = action.payload;
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: state.player.equippedTraits.filter(id => id !== traitId)
        }
      };
    }
    case ACTION_TYPES.UPGRADE_TRAIT_SLOTS:
      return {
        ...state,
        player: {
          ...state.player,
          traitSlots: Math.min(state.player.traitSlots + 1, 8)  // Cap at 8 slots
        }
      };
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

// New inventory reducer
const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_INVENTORY:
      return { ...state, inventory: action.payload };
    case ACTION_TYPES.ADD_ITEM:
      // Check if we already have this item type and it's stackable
      if (action.payload.stackable) {
        const existingItemIndex = state.inventory.findIndex(
          item => item && item.id === action.payload.id
        );

        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          const updatedInventory = [...state.inventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: (updatedInventory[existingItemIndex].quantity || 1) + (action.payload.quantity || 1)
          };
          return { ...state, inventory: updatedInventory };
        }
      }

      // Find first empty slot
      const emptySlotIndex = state.inventory.findIndex(item => item === null);
      if (emptySlotIndex === -1) {
        // No empty slots
        console.warn('Inventory full');
        return state;
      }

      // Add item to empty slot
      const newInventory = [...state.inventory];
      newInventory[emptySlotIndex] = action.payload;
      return { ...state, inventory: newInventory };

    case ACTION_TYPES.REMOVE_ITEM:
      const indexToRemove = action.payload.index;
      if (indexToRemove >= 0 && indexToRemove < state.inventory.length) {
        const updatedInventory = [...state.inventory];
        updatedInventory[indexToRemove] = null;
        return { ...state, inventory: updatedInventory };
      }
      return state;

    case ACTION_TYPES.MOVE_ITEM:
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex >= 0 && 
        fromIndex < state.inventory.length &&
        toIndex >= 0 &&
        toIndex < state.inventory.length
      ) {
        const updatedInventory = [...state.inventory];
        [updatedInventory[fromIndex], updatedInventory[toIndex]] = 
          [updatedInventory[toIndex], updatedInventory[fromIndex]];
        return { ...state, inventory: updatedInventory };
      }
      return state;

    case ACTION_TYPES.USE_ITEM:
      const itemIndex = action.payload.index;
      if (itemIndex < 0 || itemIndex >= state.inventory.length || !state.inventory[itemIndex]) {
        return state;
      }

      const item = state.inventory[itemIndex];
      let updatedPlayer = { ...state.player };
      let updatedInventory = [...state.inventory];

      // Apply item effects based on type
      if (item.type === 'consumable') {
        // Apply consumable effects
        if (item.effects) {
          Object.entries(item.effects).forEach(([stat, value]) => {
            if (stat === 'hp') {
              updatedPlayer.hp = Math.min(
                updatedPlayer.hp + value,
                updatedPlayer.maxHp || 100
              );
            } else if (stat in updatedPlayer) {
              updatedPlayer[stat] += value;
            }
          });
        }

        // Decrease quantity or remove
        if (item.quantity > 1) {
          updatedInventory[itemIndex] = {
            ...item,
            quantity: item.quantity - 1
          };
        } else {
          updatedInventory[itemIndex] = null;
        }

        return {
          ...state,
          player: updatedPlayer,
          inventory: updatedInventory
        };
      }

      return state;

    default:
      return state;
  }
};

const npcReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_NPC_RELATIONSHIP: {
      const { npcId, changeAmount } = action.payload;
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;

      // Calculate new relationship value clamped between -100 and 100
      const newRelationship = Math.max(-100, Math.min(100, (npc.relationship || 0) + changeAmount));
      
      // Track if relationship tier changed for notification
      const oldTier = Object.values(RELATIONSHIP_TIERS).find(tier => (npc.relationship || 0) >= tier.threshold);
      const newTier = Object.values(RELATIONSHIP_TIERS).find(tier => newRelationship >= tier.threshold);
      const tierChanged = oldTier?.name !== newTier?.name;

      return {
        ...state,
        npcs: state.npcs.map(n => 
          n.id === npcId 
            ? { 
                ...n, 
                relationship: newRelationship,
                lastInteraction: Date.now(),
                relationshipChanged: tierChanged,
                newTier: tierChanged ? newTier?.name : undefined
              }
            : n
        ),
      };
    }

    case ACTION_TYPES.UPDATE_DIALOGUE_STATE:
      return {
        ...state,
        npcs: state.npcs.map(n =>
          n.id === action.payload.npcId
            ? { 
                ...n, 
                dialogueState: {
                  ...n.dialogueState,
                  ...action.payload.dialogueState
                }
              }
            : n
        )
      };

    case ACTION_TYPES.DECAY_RELATIONSHIPS:
      // Optional: Implement relationship decay over time
      // This could make inactive relationships slowly return to neutral
      return {
        ...state,
        npcs: state.npcs.map(npc => {
          const lastInteraction = npc.lastInteraction || Date.now();
          const daysSinceInteraction = (Date.now() - lastInteraction) / (1000 * 60 * 60 * 24);
          
          if (daysSinceInteraction > 7 && npc.relationship !== 0) {
            const decayAmount = Math.sign(npc.relationship || 0) * Math.min(Math.abs(npc.relationship || 0), 1);
            return {
              ...npc,
              relationship: (npc.relationship || 0) - decayAmount
            };
          }
          return npc;
        })
      };

    default:
      return state;
  }
};

// Update the main reducer to include inventory operations
const gameReducer = (state, action) => {
  // Try each domain reducer in sequence
  const newState = playerReducer(
    essenceReducer(
      socialReducer(
        factionReducer(
          inventoryReducer(
            npcReducer(state, action),
            action
          ),
          action
        ),
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
    case ACTION_TYPES.INITIALIZE_GAME_DATA:
      return {
        ...newState,
        traits: {
          copyableTraits: traitsData.copyableTraits
        }
      };
    case ACTION_TYPES.REORDER_EQUIPPED_TRAITS:
      return {
        ...newState,
        player: {
          ...newState.player,
          equippedTraits: action.payload
        }
      };
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

  // Initialize game data when the provider mounts
  useEffect(() => {
    memoizedDispatch({ type: ACTION_TYPES.INITIALIZE_GAME_DATA });
  }, [memoizedDispatch]);

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
    maxHp: 100,
    attack: 10,
    defense: 5,
    statPoints: 0,
    essence: 0,
    gold: 50,
    experience: 0,
    level: 1,
    acquiredTraits: [],
    learnedSkills: [],
    factionId: 1, // Player starts as part of the Mystic Order
    factionRole: 'Member', // Player starts as a regular member
    equippedTraits: [], // Initialize empty equipped traits array
    traitSlots: 3, // Start with 3 slots
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

  inventory: [
    { 
      id: 'health-potion', 
      name: 'Health Potion', 
      type: 'consumable', 
      description: 'Restores 20 HP', 
      quantity: 3, 
      stackable: true,
      effects: { hp: 20 }
    },
    { 
      id: 'wooden-sword', 
      name: 'Wooden Sword', 
      type: 'weapon', 
      description: 'A basic training sword', 
      rarity: 'common', 
      stats: { 'Attack': 3 } 
    },
    { 
      id: 'cloth-armor', 
      name: 'Cloth Armor', 
      type: 'armor', 
      description: 'Provides minimal protection', 
      rarity: 'common', 
      stats: { 'Defense': 2 } 
    },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
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

// Add relationship action creators
export const createRelationshipAction = {
  update: (npcId, changeAmount) => ({
    type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP,
    payload: { npcId, changeAmount }
  }),
  updateDialogue: (npcId, dialogueState) => ({
    type: ACTION_TYPES.UPDATE_DIALOGUE_STATE,
    payload: { npcId, dialogueState }
  })
};