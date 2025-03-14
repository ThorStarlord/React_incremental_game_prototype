import { PlayerState, PlayerAttributes, PlayerStats, StatusEffect, Skill } from '../types/GameStateTypes';
import { PlayerInitialState, DefaultPlayerAttributes, resetPlayerState } from '../initialStates/PlayerInitialState';
import { createReducer } from '../utils/reducerUtils';

// Action types
export const PLAYER_ACTIONS = {
  UPDATE_PLAYER: 'player/update',
  UPDATE_ATTRIBUTE: 'player/updateAttribute',
  UPDATE_ATTRIBUTES: 'player/updateAttributes',
  UPDATE_STAT: 'player/updateStat',
  UPDATE_STATS: 'player/updateStats',
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
  SPEND_ATTRIBUTE_POINTS: 'player/spendAttributePoints',
  REST: 'player/rest',
  MODIFY_HEALTH: 'player/modifyHealth',
  MODIFY_ENERGY: 'player/modifyEnergy',
  ACQUIRE_TRAIT: 'player/acquireTrait',
  LEARN_SKILL: 'player/learnSkill',
  UPGRADE_SKILL: 'player/upgradeSkill',
  SET_ACTIVE_CHARACTER: 'player/setActiveCharacter',
  ALLOCATE_ATTRIBUTE: 'player/allocateAttribute'  // Add missing action type
} as const;

// Action types with improved typing
export type PlayerAction = 
  | { type: typeof PLAYER_ACTIONS.UPDATE_PLAYER; payload: Partial<PlayerState> & { timestamp?: number } }
  | { type: typeof PLAYER_ACTIONS.UPDATE_ATTRIBUTE; payload: { attribute: keyof PlayerAttributes; value: number } }
  | { type: typeof PLAYER_ACTIONS.UPDATE_ATTRIBUTES; payload: Partial<PlayerAttributes> }
  | { type: typeof PLAYER_ACTIONS.UPDATE_STAT; payload: { stat: keyof PlayerStats; value: number } }
  | { type: typeof PLAYER_ACTIONS.UPDATE_STATS; payload: Partial<PlayerStats> }
  | { type: typeof PLAYER_ACTIONS.ADD_STATUS_EFFECT; payload: StatusEffect }
  | { type: typeof PLAYER_ACTIONS.REMOVE_STATUS_EFFECT; payload: string }
  | { type: typeof PLAYER_ACTIONS.UPDATE_SKILL; payload: { skillId: string; experience: number } }
  | { type: typeof PLAYER_ACTIONS.EQUIP_TRAIT; payload: { traitId: string; slotIndex?: number } }
  | { type: typeof PLAYER_ACTIONS.UNEQUIP_TRAIT; payload: { traitId: string } }
  | { type: typeof PLAYER_ACTIONS.ADD_TRAIT; payload: string }
  | { type: typeof PLAYER_ACTIONS.REMOVE_TRAIT; payload: string }
  | { type: typeof PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME; payload: number }
  | { type: typeof PLAYER_ACTIONS.SET_NAME; payload: string }
  | { type: typeof PLAYER_ACTIONS.RESET_PLAYER; payload?: { keepName?: boolean } }
  | { type: typeof PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS; payload: number }
  | { type: typeof PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS; payload: { attribute: keyof PlayerAttributes, points: number } }
  | { type: typeof PLAYER_ACTIONS.REST; payload?: { duration?: number; location?: string; timestamp?: number } }
  | { type: typeof PLAYER_ACTIONS.MODIFY_HEALTH; payload: { amount: number; reason?: string; timestamp: number } }
  | { type: typeof PLAYER_ACTIONS.MODIFY_ENERGY; payload: { amount: number; reason?: string; timestamp: number } }
  | { type: typeof PLAYER_ACTIONS.ACQUIRE_TRAIT; payload: { traitId: string; timestamp?: number } }
  | { type: typeof PLAYER_ACTIONS.LEARN_SKILL; payload: { skillId: string; timestamp?: number } }
  | { type: typeof PLAYER_ACTIONS.UPGRADE_SKILL; payload: { skillId: string; level: number; cost: number; timestamp?: number } }
  | { type: typeof PLAYER_ACTIONS.SET_ACTIVE_CHARACTER; payload: { characterId: string; timestamp?: number } }
  | { type: typeof PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE; payload: { attributeName: string; amount: number; timestamp: number } }

// Use the player state from PlayerInitialState
const initialPlayerState: PlayerState = {
  // Use the initial player state but remove level and experience properties
  ...PlayerInitialState.player,
  attributes: { ...DefaultPlayerAttributes },
  // No longer manually defining stats - using the ones from PlayerInitialState
};

// Remove level and experience from initial state
delete (initialPlayerState as any).level;
delete (initialPlayerState as any).experience;
delete (initialPlayerState as any).experienceToNextLevel;

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

// Helper function to narrow action types with improved type safety
function isActionOfType<T extends typeof PLAYER_ACTIONS[keyof typeof PLAYER_ACTIONS]>(
  action: PlayerAction,
  type: T
): action is Extract<PlayerAction, { type: T }> {
  return action.type === type;
}

// Helper function for more specific payload checks with improved typing
function hasPayloadProps<P extends Record<string, unknown>>(
  payload: unknown,
  props: (keyof P)[] 
): payload is P {
  if (!payload || typeof payload !== 'object') return false;
  return props.every(prop => prop in payload);
}

// Player reducer using createReducer utility
export const playerReducer = createReducer<PlayerState, PlayerAction>(
  initialPlayerState,
  {
    [PLAYER_ACTIONS.UPDATE_PLAYER]: (state, action) => {
      // Make sure payload is a valid object before spreading
      if (action.payload && typeof action.payload === 'object') {
        return {
          ...state,
          ...action.payload
        };
      }
      return state;
    },

    [PLAYER_ACTIONS.UPDATE_ATTRIBUTE]: (state, action) => {
      // Define expected payload shape
      type AttributePayload = { attribute: keyof PlayerAttributes; value: number };
      
      // Ensure action is of the correct type with proper payload
      if (action.type !== PLAYER_ACTIONS.UPDATE_ATTRIBUTE || 
          !action.payload || 
          typeof action.payload !== 'object' ||
          !('attribute' in action.payload) || 
          !('value' in action.payload)) {
        return state;
      }
      
      // Now TypeScript knows payload has the correct shape
      const payload = action.payload as AttributePayload;
      const { attribute, value } = payload;
      
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
      if (!action.payload || typeof action.payload !== 'object') {
        return state;
      }
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
      // Type guard for UPDATE_STAT action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_STAT)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('stat' in action.payload) || !('value' in action.payload)) {
        return state;
      }
      
      const stat = action.payload.stat;
      const value = action.payload.value;
      
      return {
        ...state,
        stats: {
          ...state.stats,
          [stat]: value
        }
      };
    },

    [PLAYER_ACTIONS.UPDATE_STATS]: (state, action) => {
      // First check if action is of the correct type
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_STATS)) {
        return state;
      }
      
      // Verify the payload is an object before spreading
      if (!action.payload || typeof action.payload !== 'object') {
        return state;
      }
      
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };
    },

    [PLAYER_ACTIONS.ADD_STATUS_EFFECT]: (state, action) => {
      // Type guard for ADD_STATUS_EFFECT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_STATUS_EFFECT)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a StatusEffect
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
      // Use type assertion for action.payload
      const payload = action.payload as { skillId: string, experience: number };
      const { skillId, experience } = payload;
      
      // Find skill if it exists
      const skills = state.skills || [];
      const existingSkillIndex = skills.findIndex(skill => skill.id === skillId);
      
      // Create a new skills array using slice instead of spread
      const updatedSkills = skills.slice();
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        const currentSkill = skills[existingSkillIndex];
        if (currentSkill) {
          const newExperience = currentSkill.experience + experience;
          const newLevel = Math.floor(Math.pow(newExperience / 100, 0.8)) + 1;
          
          // Create a new skill object explicitly
          updatedSkills[existingSkillIndex] = {
            id: currentSkill.id,
            level: newLevel,
            experience: newExperience
          };
        }
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
      // Type guard for EQUIP_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.EQUIP_TRAIT)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('traitId' in action.payload)) {
        return state;
      }
      
      const traitId = action.payload.traitId;
      // For optional properties like slotIndex, check if they exist
      const slotIndex = 'slotIndex' in action.payload ? action.payload.slotIndex : undefined;
      
      // Ensure trait is owned and not already equipped
      if (!state.acquiredTraits?.includes(traitId) || 
          state.equippedTraits?.includes(traitId)) {
        return state;
      }
      // Check if we have available trait slots
      if ((state.equippedTraits?.length ?? 0) >= (state.traitSlots ?? 0)) {
        return state;
      }
      
      // If slotIndex is provided and valid, handle specific slot assignment
      // Otherwise just add to the equipped traits array
      return {
        ...state,
        equippedTraits: [...(state.equippedTraits || []), traitId]
      };
    },

    [PLAYER_ACTIONS.UNEQUIP_TRAIT]: (state, action) => {
      // Type guard for UNEQUIP_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.UNEQUIP_TRAIT)) {
        return state;
      }
      
      // Now TypeScript knows this is specifically a UNEQUIP_TRAIT action
      const { traitId } = action.payload;
      
      return {
        ...state,
        equippedTraits: state.equippedTraits?.filter(id => id !== traitId) || []
      };
    },

    [PLAYER_ACTIONS.ADD_TRAIT]: (state, action) => {
      // Type guard for ADD_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_TRAIT)) {
        return state;
      }
      
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
      // Type guard for REMOVE_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.REMOVE_TRAIT)) {
        return state;
      }
      
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
      // Type guard for UPDATE_TOTAL_PLAYTIME action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_TOTAL_PLAYTIME)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a number
      return {
        ...state,
        totalPlayTime: state.totalPlayTime + action.payload
      };
    },

    [PLAYER_ACTIONS.SET_NAME]: (state, action) => {
      // Type guard for SET_NAME action
      if (!isActionOfType(action, PLAYER_ACTIONS.SET_NAME)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a string
      return {
        ...state,
        name: action.payload
      };
    },

    [PLAYER_ACTIONS.RESET_PLAYER]: (state, action) => {
      // Type guard for RESET_PLAYER action
      if (!isActionOfType(action, PLAYER_ACTIONS.RESET_PLAYER)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is of type { keepName?: boolean } | undefined
      const keepName = action.payload?.keepName ?? false;
      
      // Make a deep copy of the initial state
      const newState = structuredClone(initialPlayerState);
      if (keepName) {
        newState.name = state.name;
      }
      // Preserve creation date if it exists, otherwise set it to now
      newState.creationDate = state.creationDate || new Date().toISOString();
      return newState;
    },

    [PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS]: (state, action) => {
      // Type guard for ADD_ATTRIBUTE_POINTS action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a number
      // Handle the case when attributePoints is undefined
      const currentPoints = state.attributePoints || 0;
      
      return {
        ...state,
        attributePoints: currentPoints + action.payload
      };
    },

    [PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS]: (state, action) => {
      type AttributePointsPayload = { attribute: keyof PlayerAttributes; points: number };
      
      // Type guard
      if (action.type !== PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS ||
          !action.payload || 
          typeof action.payload !== 'object' ||
          !('attribute' in action.payload) || 
          !('points' in action.payload)) {
        return state;
      }
      
      const payload = action.payload as AttributePointsPayload;
      const { attribute, points } = payload;
      
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
    },

    [PLAYER_ACTIONS.REST]: (state, action) => {
      // Type guard for REST action
      if (!isActionOfType(action, PLAYER_ACTIONS.REST)) {
        return state;
      }

      // Set default values without using spread
      let duration = 1;
      let location = undefined;
      
      // Access payload properties safely
      if (action.payload && typeof action.payload === 'object') {
        if ('duration' in action.payload && typeof action.payload.duration === 'number') {
          duration = action.payload.duration;
        }
        if ('location' in action.payload && typeof action.payload.location === 'string') {
          location = action.payload.location;
        }
      }
      
      // Continue with the rest of the logic
      const healthRecovery = Math.min(
        state.stats.maxHealth - state.stats.health,
        Math.floor(state.stats.healthRegen * duration)
      );
      const manaRecovery = Math.min(
        state.stats.maxMana - state.stats.mana,
        Math.floor(state.stats.manaRegen * duration)
      );
      return {
        ...state,
        stats: {
          ...state.stats,
          health: state.stats.health + healthRecovery,
          mana: state.stats.mana + manaRecovery
        },
        lastRestLocation: location,
        lastRestTime: Date.now()
      };
    },

    [PLAYER_ACTIONS.MODIFY_HEALTH]: (state, action) => {
      // Type guard for MODIFY_HEALTH action
      if (!isActionOfType(action, PLAYER_ACTIONS.MODIFY_HEALTH)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('amount' in action.payload)) {
        return state;
      }
      
      const amount = action.payload.amount;
      const newHealth = Math.max(0, Math.min(state.stats.maxHealth, state.stats.health + amount));
      return {
        ...state,
        stats: {
          ...state.stats,
          health: newHealth
        }
      };
    },

    [PLAYER_ACTIONS.MODIFY_ENERGY]: (state, action) => {
      // Type guard for MODIFY_ENERGY action
      if (!isActionOfType(action, PLAYER_ACTIONS.MODIFY_ENERGY)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('amount' in action.payload)) {
        return state;
      }
      
      const amount = action.payload.amount;
      const newEnergy = Math.max(0, Math.min(state.stats.maxMana, state.stats.mana + amount));
      return {
        ...state,
        stats: {
          ...state.stats,
          mana: newEnergy
        }
      };
    },

    [PLAYER_ACTIONS.ACQUIRE_TRAIT]: (state, action) => {
      // Type guard for ACQUIRE_TRAIT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ACQUIRE_TRAIT)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('traitId' in action.payload)) {
        return state;
      }
      
      const traitId = action.payload.traitId;
      if (state.acquiredTraits?.includes(traitId)) {
        return state;
      }
      
      // Only update acquiredTraits, since traits property doesn't exist in PlayerState
      return {
        ...state,
        acquiredTraits: [...(state.acquiredTraits || []), traitId]
      };
    },

    [PLAYER_ACTIONS.LEARN_SKILL]: (state, action) => {
      // Type guard for LEARN_SKILL action
      if (!isActionOfType(action, PLAYER_ACTIONS.LEARN_SKILL)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('skillId' in action.payload)) {
        return state;
      }
      
      const skillId = action.payload.skillId;
      if (state.skills?.some(skill => skill.id === skillId)) {
        return state;
      }
      const newSkill: Skill = {
        id: skillId,
        level: 1,
        experience: 0
      };
      return {
        ...state,
        skills: [...(state.skills || []), newSkill]
      };
    },

    [PLAYER_ACTIONS.UPGRADE_SKILL]: (state, action) => {
      type UpgradeSkillPayload = { 
        skillId: string;
        level: number;
        cost: number;
        timestamp?: number;
      };
      
      if (!action.payload) return state;
      const payload = action.payload as UpgradeSkillPayload;
      
      // Safely access the payload properties without spreading
      const skillId = payload.skillId;
      const level = payload.level;
      
      const skills = state.skills || [];
      const skillIndex = skills.findIndex(skill => skill.id === skillId);
      
      if (skillIndex === -1) {
        return state;
      }
      
      // Create a new skills array without using spread on potentially undefined values
      const updatedSkills = skills.slice();
      
      // Get the current skill object
      const currentSkill = skills[skillIndex];
      if (currentSkill) {
        // Create a new skill object with updated properties
        updatedSkills[skillIndex] = {
          id: currentSkill.id,
          level: level,
          experience: currentSkill.experience
        };
      }
      
      // Return the updated state
      return {
        ...state,
        skills: updatedSkills
      };
    },

    [PLAYER_ACTIONS.SET_ACTIVE_CHARACTER]: (state, action) => {
      // Type guard for SET_ACTIVE_CHARACTER action
      if (!isActionOfType(action, PLAYER_ACTIONS.SET_ACTIVE_CHARACTER)) {
        return state;
      }
      
      // Now TypeScript knows that action.payload has a characterId property
      return {
        ...state,
        activeCharacterId: action.payload.characterId
      };
    },

    [PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE]: (state, action) => {
      // First check if action is of the correct type
      if (!isActionOfType(action, PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE)) {
        return state;
      }
      
      // Get the payload with proper typing - without spreading
      const payload = action.payload;
      
      // Check payload properties without spreading
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      
      // Check if attributeName and amount exist on payload
      if (!('attributeName' in payload) || !('amount' in payload)) {
        return state;
      }
      
      const attributeName = payload.attributeName;
      const amount = payload.amount;
      
      if (typeof attributeName !== 'string' || typeof amount !== 'number') {
        return state;
      }
      
      // Update the attribute
      const updatedAttributes = {
        ...state.attributes,
        [attributeName]: (state.attributes[attributeName as keyof PlayerAttributes] || 0) + amount
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
    }
  }
);

export default playerReducer;
