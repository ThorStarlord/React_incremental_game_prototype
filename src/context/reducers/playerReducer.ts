import { PlayerState, PlayerAttributes, PlayerStats, StatusEffect, Skill } from '../types/PlayerGameStateTypes';
import { DefaultPlayerAttributes } from '../initialStates/PlayerInitialState';
import { createReducer } from '../utils/reducerUtils';

// Action types
export const PLAYER_ACTIONS = {
  UPDATE_PLAYER: 'player/update',
  UPDATE_ATTRIBUTE: 'player/updateAttribute',
  UPDATE_ATTRIBUTES: 'player/updateAttributes',
  UPDATE_STAT: 'player/updateStat',
  UPDATE_STATS: 'player/updateStats',
  GAIN_EXPERIENCE: 'player/gainExperience',
  LEVEL_UP: 'player/levelUp',
  ADD_STATUS_EFFECT: 'player/addStatusEffect',
  REMOVE_STATUS_EFFECT: 'player/removeStatusEffect',
  UPDATE_SKILL: 'player/updateSkill',
  EQUIP_TRAIT: 'player/equipTrait',
  UNEQUIP_TRAIT: 'player/unequipTrait',
  ADD_TRAIT: 'player/addTrait',
  REMOVE_TRAIT: 'player/removeTrait',
  UPDATE_TOTAL_PLAYTIME: 'player/updateTotalPlayTime',
  SET_NAME: 'player/setName',
  RESET_PLAYER: 'player/reset',
  ADD_ATTRIBUTE_POINTS: 'player/addAttributePoints',
  SPEND_ATTRIBUTE_POINTS: 'player/spendAttributePoints'
};

// Action types
export type PlayerAction = 
  | { type: typeof PLAYER_ACTIONS.UPDATE_PLAYER; payload: Partial<PlayerState> }
  | { type: typeof PLAYER_ACTIONS.UPDATE_ATTRIBUTE; payload: { attribute: keyof PlayerAttributes; value: number } }
  | { type: typeof PLAYER_ACTIONS.UPDATE_ATTRIBUTES; payload: Partial<PlayerAttributes> }
  | { type: typeof PLAYER_ACTIONS.UPDATE_STAT; payload: { stat: keyof PlayerStats; value: number } }
  | { type: typeof PLAYER_ACTIONS.UPDATE_STATS; payload: Partial<PlayerStats> }
  | { type: typeof PLAYER_ACTIONS.GAIN_EXPERIENCE; payload: number }
  | { type: typeof PLAYER_ACTIONS.LEVEL_UP; payload?: { attributes?: Partial<PlayerAttributes> } }
  | { type: typeof PLAYER_ACTIONS.ADD_STATUS_EFFECT; payload: StatusEffect }
  | { type: typeof PLAYER_ACTIONS.REMOVE_STATUS_EFFECT; payload: string }
  | { type: typeof PLAYER_ACTIONS.UPDATE_SKILL; payload: { skillId: string; experience: number } }
  | { type: typeof PLAYER_ACTIONS.EQUIP_TRAIT; payload: string }
  | { type: typeof PLAYER_ACTIONS.UNEQUIP_TRAIT; payload: string }
  | { type: typeof PLAYER_ACTIONS.ADD_TRAIT; payload: string }
  | { type: typeof PLAYER_ACTIONS.REMOVE_TRAIT; payload: string }
  | { type: typeof PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME; payload: number }
  | { type: typeof PLAYER_ACTIONS.SET_NAME; payload: string }
  | { type: typeof PLAYER_ACTIONS.RESET_PLAYER; payload?: { keepName?: boolean } }
  | { type: typeof PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS; payload: number }
  | { type: typeof PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS; payload: { attribute: keyof PlayerAttributes, points: number } }

// Initial state from PlayerInitialState.ts
const initialPlayerState: PlayerState = {
  name: "Adventurer",
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  attributes: { ...DefaultPlayerAttributes },
  stats: {
    health: 100,
    maxHealth: 100,
    healthRegen: 1,
    mana: 50,
    maxMana: 50,
    manaRegen: 0.5,
    physicalDamage: 5,
    magicalDamage: 2,
    critChance: 5,
    critMultiplier: 1.5
  },
  totalPlayTime: 0,
  creationDate: null,
  equippedTraits: [],
  permanentTraits: [],
  acquiredTraits: [],
  traitSlots: 2,
  attributePoints: 0,
  skills: [],
  activeEffects: []
};

// Calculate experience required for a level
const calculateExperienceToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

// Calculate base stats from attributes
const calculateBaseStats = (attributes: PlayerAttributes): Partial<PlayerStats> => {
  return {
    maxHealth: 100 + (attributes.vitality * 10),
    healthRegen: 0.5 + (attributes.vitality * 0.1),
    maxMana: 50 + (attributes.intelligence * 10),
    manaRegen: 0.5 + (attributes.intelligence * 0.1),
    physicalDamage: 5 + (attributes.strength * 0.5),
    magicalDamage: 2 + (attributes.intelligence * 0.5),
    critChance: 5 + (attributes.luck * 0.5),
    critMultiplier: 1.5 + (attributes.luck * 0.05),
  };
};

// Player reducer using createReducer utility
export const playerReducer = createReducer<PlayerState, PlayerAction>(
  initialPlayerState,
  {
    [PLAYER_ACTIONS.UPDATE_PLAYER]: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },

    [PLAYER_ACTIONS.UPDATE_ATTRIBUTE]: (state, action) => {
      const { attribute, value } = action.payload;
      const updatedAttributes = {
        ...state.attributes,
        [attribute]: value
      };
      
      // Recalculate stats affected by this attribute change
      const updatedStats = calculateBaseStats(updatedAttributes);
      
      return {
        ...state,
        attributes: updatedAttributes,
        stats: {
          ...state.stats,
          ...updatedStats
        }
      };
    },

    [PLAYER_ACTIONS.UPDATE_ATTRIBUTES]: (state, action) => {
      const updatedAttributes = {
        ...state.attributes,
        ...action.payload
      };
      
      // Recalculate stats based on new attributes
      const updatedStats = calculateBaseStats(updatedAttributes);
      
      return {
        ...state,
        attributes: updatedAttributes,
        stats: {
          ...state.stats,
          ...updatedStats
        }
      };
    },

    [PLAYER_ACTIONS.UPDATE_STAT]: (state, action) => {
      const { stat, value } = action.payload;
      return {
        ...state,
        stats: {
          ...state.stats,
          [stat]: value
        }
      };
    },

    [PLAYER_ACTIONS.UPDATE_STATS]: (state, action) => {
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };
    },

    [PLAYER_ACTIONS.GAIN_EXPERIENCE]: (state, action) => {
      const experienceGained = action.payload;
      const newExperience = state.experience + experienceGained;
      const experienceToNextLevel = state.experienceToNextLevel;
      
      // Check if player has leveled up
      if (newExperience >= experienceToNextLevel) {
        // Level up handled by the LEVEL_UP action
        return {
          ...state,
          experience: newExperience
        };
      }
      
      return {
        ...state,
        experience: newExperience
      };
    },

    [PLAYER_ACTIONS.LEVEL_UP]: (state, action) => {
      const { attributes = {} } = action.payload || {};
      const newLevel = state.level + 1;
      const remainingExperience = state.experience - state.experienceToNextLevel;
      const newExperienceToNextLevel = calculateExperienceToNextLevel(newLevel);
      
      // Update attributes if specified
      const updatedAttributes = {
        ...state.attributes,
        ...attributes
      };
      
      // Recalculate stats based on new attributes
      const updatedStats = calculateBaseStats(updatedAttributes);
      
      // Give attribute points on level up
      const newAttributePoints = state.attributePoints + 3;
      
      return {
        ...state,
        level: newLevel,
        experience: remainingExperience,
        experienceToNextLevel: newExperienceToNextLevel,
        attributes: updatedAttributes,
        stats: {
          ...state.stats,
          ...updatedStats,
          health: updatedStats.maxHealth || state.stats.health, // Restore health on level up
          mana: updatedStats.maxMana || state.stats.mana // Restore mana on level up
        },
        attributePoints: newAttributePoints
      };
    },

    [PLAYER_ACTIONS.ADD_STATUS_EFFECT]: (state, action) => {
      const newEffect = action.payload;
      
      // Check if effect already exists (to replace it)
      const existingEffectIndex = state.activeEffects?.findIndex(
        effect => effect.id === newEffect.id
      ) ?? -1;
      
      const updatedEffects = [...(state.activeEffects || [])];
      
      if (existingEffectIndex >= 0) {
        // Replace existing effect
        updatedEffects[existingEffectIndex] = newEffect;
      } else {
        // Add new effect
        updatedEffects.push(newEffect);
      }
      
      return {
        ...state,
        activeEffects: updatedEffects
      };
    },

    [PLAYER_ACTIONS.REMOVE_STATUS_EFFECT]: (state, action) => {
      const effectId = action.payload;
      return {
        ...state,
        activeEffects: state.activeEffects?.filter(effect => effect.id !== effectId) || []
      };
    },

    [PLAYER_ACTIONS.UPDATE_SKILL]: (state, action) => {
      const { skillId, experience } = action.payload;
      
      // Find skill if it exists
      const existingSkillIndex = state.skills?.findIndex(
        skill => skill.id === skillId
      ) ?? -1;
      
      let updatedSkills = [...(state.skills || [])];
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        const currentSkill = state.skills?.[existingSkillIndex] as Skill;
        const newExperience = currentSkill.experience + experience;
        const newLevel = Math.floor(Math.pow(newExperience / 100, 0.8)) + 1;
        
        updatedSkills[existingSkillIndex] = {
          ...currentSkill,
          experience: newExperience,
          level: newLevel
        };
      } else {
        // Add new skill
        const newSkill: Skill = {
          id: skillId,
          level: 1,
          experience
        };
        updatedSkills.push(newSkill);
      }
      
      return {
        ...state,
        skills: updatedSkills
      };
    },

    [PLAYER_ACTIONS.EQUIP_TRAIT]: (state, action) => {
      const traitId = action.payload;
      
      // Ensure trait is owned and not already equipped
      if (!state.acquiredTraits?.includes(traitId) || 
          state.equippedTraits?.includes(traitId)) {
        return state;
      }
      
      // Check if we have available trait slots
      if ((state.equippedTraits?.length ?? 0) >= (state.traitSlots ?? 0)) {
        return state;
      }
      
      return {
        ...state,
        equippedTraits: [...(state.equippedTraits || []), traitId]
      };
    },

    [PLAYER_ACTIONS.UNEQUIP_TRAIT]: (state, action) => {
      const traitId = action.payload;
      
      return {
        ...state,
        equippedTraits: state.equippedTraits?.filter(id => id !== traitId) || []
      };
    },

    [PLAYER_ACTIONS.ADD_TRAIT]: (state, action) => {
      const traitId = action.payload;
      
      // Don't add if already owned
      if (state.acquiredTraits?.includes(traitId)) {
        return state;
      }
      
      return {
        ...state,
        acquiredTraits: [...(state.acquiredTraits || []), traitId]
      };
    },

    [PLAYER_ACTIONS.REMOVE_TRAIT]: (state, action) => {
      const traitId = action.payload;
      
      // Also remove from equipped if it's equipped
      const newEquippedTraits = state.equippedTraits?.filter(id => id !== traitId) || [];
      
      return {
        ...state,
        acquiredTraits: state.acquiredTraits?.filter(id => id !== traitId) || [],
        equippedTraits: newEquippedTraits
      };
    },

    [PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME]: (state, action) => {
      return {
        ...state,
        totalPlayTime: state.totalPlayTime + action.payload
      };
    },

    [PLAYER_ACTIONS.SET_NAME]: (state, action) => {
      return {
        ...state,
        name: action.payload
      };
    },

    [PLAYER_ACTIONS.RESET_PLAYER]: (state, action) => {
      const { keepName = false } = action.payload || {};
      const newState = { ...initialPlayerState };
      
      if (keepName) {
        newState.name = state.name;
      }
      
      // Set creation date to current time if resetting
      newState.creationDate = new Date().toISOString();
      
      return newState;
    },

    [PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS]: (state, action) => {
      return {
        ...state,
        attributePoints: state.attributePoints + action.payload
      };
    },

    [PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS]: (state, action) => {
      const { attribute, points } = action.payload;
      
      // Ensure player has enough attribute points
      if ((state.attributePoints || 0) < points) {
        return state;
      }
      
      const updatedAttributes = {
        ...state.attributes,
        [attribute]: (state.attributes[attribute] || 0) + points
      };
      
      // Recalculate stats based on new attributes
      const updatedStats = calculateBaseStats(updatedAttributes);
      
      return {
        ...state,
        attributes: updatedAttributes,
        stats: {
          ...state.stats,
          ...updatedStats
        },
        attributePoints: (state.attributePoints || 0) - points
      };
    }
  }
);

export default playerReducer;
