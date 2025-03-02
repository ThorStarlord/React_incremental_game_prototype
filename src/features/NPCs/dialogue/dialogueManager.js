import { useCallback, useMemo } from 'react';
import elaraDialogues from '../data/dialogues/elara.json';
import borinDialogues from '../data/dialogues/borin.json';
import willaDialogues from '../data/dialogues/willa.json';
import { startQuest, updateQuestProgress } from '../../Quests/utils/questManager';

/**
 * @typedef {Object} DialogueCondition
 * @property {string} type - Type of condition ('quest', 'item', 'stat', 'reputation', etc.)
 * @property {string} target - Target ID (questId, itemId, statName, etc.)
 * @property {string} [operator] - Comparison operator ('==', '>', '<', '>=', '<=', '!=')
 * @property {*} [value] - Value to compare against
 * @property {boolean} [negate] - Whether to negate the condition
 */

/**
 * @typedef {Object} DialogueOption
 * @property {string} id - Unique identifier for this dialogue option
 * @property {string} text - The text shown to the player
 * @property {Array<DialogueCondition>} [conditions] - Conditions that must be met to show this option
 * @property {string} [nextDialogue] - ID of the next dialogue to show when this option is selected
 * @property {Array<Object>} [actions] - Actions to perform when this option is selected
 * @property {Object} [relationshipChanges] - How this affects NPC relationships
 */

/**
 * @typedef {Object} DialogueNode
 * @property {string} id - Unique identifier for this dialogue
 * @property {string} [title] - Title/summary of this dialogue (for history)
 * @property {string} text - The text spoken by the NPC
 * @property {string} [speaker] - Who is speaking (NPC name, or "player" for player responses)
 * @property {Array<DialogueCondition>} [conditions] - Conditions to show this dialogue
 * @property {Array<DialogueOption>} options - Available player responses
 * @property {boolean} [isRoot] - Whether this is a root dialogue
 * @property {Array<Object>} [actions] - Actions to perform when this dialogue is shown
 * @property {string} [mood] - NPC's mood during this dialogue
 * @property {string} [category] - Dialogue category for organization
 * @property {string} [snippet] - Short summary for history view
 */

// Import dialogue data
const dialogueData = {
  elara: elaraDialogues.elara,
  borin: borinDialogues.borin,
  willa: willaDialogues.willa
};

/**
 * Hook for managing NPC dialogue interactions
 * @param {string} npcId - ID of the NPC to interact with
 * @returns {Object} Dialogue management functions
 */
export const useDialogue = (npcId) => {
  /**
   * Get a specific dialogue by ID
   * @param {string} dialogueId - ID of the dialogue to retrieve
   * @returns {DialogueNode|undefined} The dialogue if found
   */
  const getDialogue = useCallback((dialogueId) => {
    const npcDialogues = dialogueData[npcId]?.dialogues;
    return npcDialogues?.find(d => d.id === dialogueId);
  }, [npcId]);

  /**
   * Get all dialogues for the current NPC
   * @returns {Array<DialogueNode>} All dialogues for this NPC
   */
  const getAllDialogues = useCallback(() => {
    return dialogueData[npcId]?.dialogues || [];
  }, [npcId]);

  /**
   * Get root dialogue nodes (starting conversations)
   * @returns {Array<DialogueNode>} Root dialogue nodes
   */
  const getRootDialogues = useCallback(() => {
    const dialogues = dialogueData[npcId]?.dialogues || [];
    return dialogues.filter(d => d.isRoot === true);
  }, [npcId]);

  /**
   * Check if a dialogue condition is met
   * @param {DialogueCondition} condition - The condition to check
   * @param {Object} player - Player state
   * @param {Object} gameState - Current game state
   * @returns {boolean} Whether the condition is met
   */
  const checkCondition = useCallback((condition, player, gameState) => {
    // Default result if no condition logic matches
    let result = false;
    
    switch(condition.type) {
      case 'quest':
        const quest = gameState.quests.find(q => q.id === condition.target);
        if (condition.operator === 'active') {
          result = quest && quest.active;
        } else if (condition.operator === 'completed') {
          result = quest && quest.completed;
        } else if (condition.operator === 'failed') {
          result = quest && quest.failed;
        } else if (condition.operator === 'not_started') {
          result = !quest || (!quest.active && !quest.completed && !quest.failed);
        }
        break;
        
      case 'item':
        const item = player.inventory.find(i => i.id === condition.target);
        const quantity = item ? item.quantity : 0;
        
        if (condition.operator === 'has') {
          result = quantity > 0;
        } else if (condition.operator === '>=') {
          result = quantity >= condition.value;
        } else if (condition.operator === '==') {
          result = quantity === condition.value;
        }
        break;
        
      case 'stat':
        const statValue = player.stats?.[condition.target] || 0;
        
        if (condition.operator === '>') {
          result = statValue > condition.value;
        } else if (condition.operator === '>=') {
          result = statValue >= condition.value;
        } else if (condition.operator === '<') {
          result = statValue < condition.value;
        } else if (condition.operator === '<=') {
          result = statValue <= condition.value;
        } else if (condition.operator === '==') {
          result = statValue === condition.value;
        }
        break;
        
      case 'reputation':
        const reputation = gameState.reputations?.[condition.target] || 0;
        
        if (condition.operator === '>') {
          result = reputation > condition.value;
        } else if (condition.operator === '>=') {
          result = reputation >= condition.value;
        } else if (condition.operator === '<') {
          result = reputation < condition.value;
        } else if (condition.operator === '<=') {
          result = reputation <= condition.value;
        }
        break;
        
      case 'relationship':
        const relationship = gameState.npcs.find(n => n.id === condition.target)?.relationship || 0;
        
        if (condition.operator === '>') {
          result = relationship > condition.value;
        } else if (condition.operator === '>=') {
          result = relationship >= condition.value;
        }
        break;
        
      case 'flag':
        result = gameState.flags.includes(condition.target);
        break;
        
      case 'timeOfDay':
        result = gameState.timeOfDay === condition.value;
        break;
        
      default:
        // Unknown condition type
        result = false;
    }
    
    // Negate result if specified
    return condition.negate ? !result : result;
  }, []);

  /**
   * Check if all conditions for a dialogue or option are met
   * @param {Array<DialogueCondition>} conditions - List of conditions to check
   * @param {Object} player - Player state
   * @param {Object} gameState - Current game state
   * @returns {boolean} Whether all conditions are met
   */
  const checkAllConditions = useCallback((conditions, player, gameState) => {
    if (!conditions || conditions.length === 0) return true;
    
    return conditions.every(condition => checkCondition(condition, player, gameState));
  }, [checkCondition]);

  /**
   * Get available dialogue options based on conditions
   * @param {DialogueNode} dialogue - Current dialogue
   * @param {Object} player - Player state
   * @param {Object} gameState - Current game state
   * @returns {Array<DialogueOption>} Available options
   */
  const getAvailableOptions = useCallback((dialogue, player, gameState) => {
    if (!dialogue || !dialogue.options) return [];
    
    return dialogue.options.filter(option => 
      !option.conditions || checkAllConditions(option.conditions, player, gameState)
    );
  }, [checkAllConditions]);

  /**
   * Execute the actions specified in a dialogue or option
   * @param {Array<Object>} actions - Actions to perform
   * @param {Function} dispatch - Redux dispatch function
   * @param {Object} gameState - Current game state
   * @param {Object} player - Player state
   */
  const executeActions = useCallback((actions, dispatch, gameState, player) => {
    if (!actions || !actions.length) return;
    
    actions.forEach(action => {
      switch (action.type) {
        case 'start_quest':
          startQuest(action.questId, dispatch);
          break;
          
        case 'update_quest':
          updateQuestProgress(action.questId, action.step, dispatch);
          break;
          
        case 'give_item':
          dispatch({ 
            type: 'INVENTORY_ADD_ITEM', 
            payload: { 
              itemId: action.itemId, 
              quantity: action.quantity || 1 
            } 
          });
          break;
          
        case 'take_item':
          dispatch({ 
            type: 'INVENTORY_REMOVE_ITEM', 
            payload: { 
              itemId: action.itemId, 
              quantity: action.quantity || 1 
            } 
          });
          break;
          
        case 'modify_reputation':
          dispatch({
            type: 'UPDATE_REPUTATION',
            payload: {
              faction: action.faction,
              amount: action.amount
            }
          });
          break;
          
        case 'modify_relationship':
          dispatch({
            type: 'UPDATE_NPC_RELATIONSHIP',
            payload: {
              npcId: action.npcId || npcId,
              amount: action.amount
            }
          });
          break;
          
        case 'set_flag':
          dispatch({
            type: 'ADD_NPC_STORY_FLAG',
            payload: {
              flag: action.flag,
              npcId: action.npcId || npcId
            }
          });
          break;
          
        case 'unlock_npc':
          dispatch({
            type: 'UNLOCK_NPC',
            payload: { npcId: action.npcId }
          });
          break;
          
        case 'unlock_location':
          dispatch({
            type: 'UNLOCK_LOCATION',
            payload: { locationId: action.locationId }
          });
          break;
          
        case 'reward_experience':
          dispatch({
            type: 'ADD_EXPERIENCE',
            payload: { amount: action.amount }
          });
          break;
      }
    });
  }, [npcId]);

  /**
   * Handle selecting a dialogue option
   * @param {DialogueOption} option - Selected dialogue option
   * @param {Object} currentDialogue - Current dialogue node
   * @param {Function} dispatch - Redux dispatch function
   * @param {Object} gameState - Current game state
   * @param {Object} player - Player state 
   * @param {Function} setCurrentDialogue - Function to update current dialogue
   * @returns {Object} Next dialogue or null if ending conversation
   */
  const handleOptionSelected = useCallback((
    option, 
    currentDialogue, 
    dispatch, 
    gameState, 
    player,
    setCurrentDialogue
  ) => {
    // Record the player's choice
    if (currentDialogue && option) {
      dispatch({
        type: 'RECORD_DIALOGUE_CHOICE',
        payload: {
          dialogueId: currentDialogue.id,
          optionId: option.id,
          timestamp: new Date().toISOString(),
          npcId
        }
      });
    }
    
    // Execute option actions
    if (option.actions) {
      executeActions(option.actions, dispatch, gameState, player);
    }
    
    // Update relationships if specified
    if (option.relationshipChanges) {
      Object.entries(option.relationshipChanges).forEach(([targetNpcId, change]) => {
        dispatch({
          type: 'UPDATE_NPC_RELATIONSHIP',
          payload: {
            npcId: targetNpcId,
            amount: change
          }
        });
      });
    }
    
    // Get next dialogue if specified
    if (option.nextDialogue) {
      const nextDialogue = getDialogue(option.nextDialogue);
      
      if (nextDialogue) {
        // Execute dialogue actions
        if (nextDialogue.actions) {
          executeActions(nextDialogue.actions, dispatch, gameState, player);
        }
        
        // Log this dialogue in history
        dispatch({
          type: 'ADD_DIALOGUE_HISTORY',
          payload: {
            npcId,
            dialogueBranch: nextDialogue.id,
            timestamp: new Date().toISOString(),
            category: nextDialogue.category || currentDialogue?.category || 'General'
          }
        });
        
        setCurrentDialogue(nextDialogue);
        return nextDialogue;
      }
    }
    
    // End conversation if no next dialogue
    return null;
  }, [npcId, getDialogue, executeActions]);
  
  /**
   * Generate greeting based on time of day, relationship, and previous interactions
   * @param {Object} npc - NPC data
   * @param {Object} gameState - Current game state
   * @returns {string} Appropriate greeting text
   */
  const generateGreeting = useCallback((npc, gameState) => {
    // Time of day affects greeting
    const { timeOfDay } = gameState;
    const relationship = npc.relationship || 0;
    const previousEncounters = gameState.playerInteractions?.interactionHistory?.[npcId]?.interactionCount || 0;
    
    // Time-based greetings take precedence
    if (timeOfDay === 'morning') {
      return getTimeBasedGreeting('morning', npc.type, relationship, previousEncounters);
    } else if (timeOfDay === 'afternoon') {
      return getTimeBasedGreeting('afternoon', npc.type, relationship, previousEncounters);
    } else if (timeOfDay === 'evening') {
      return getTimeBasedGreeting('evening', npc.type, relationship, previousEncounters);
    } else if (timeOfDay === 'night') {
      return getTimeBasedGreeting('night', npc.type, relationship, previousEncounters);
    }
    
    // Fall back to standard greeting
    return getRandomGreeting(npc.type, relationship, previousEncounters);
  }, [npcId]);
  
  return {
    getDialogue,
    getAllDialogues,
    getRootDialogues,
    checkCondition,
    checkAllConditions,
    getAvailableOptions,
    executeActions,
    handleOptionSelected,
    generateGreeting
  };
};

/**
 * Generate a greeting based on time of day
 * @param {string} timeOfDay - Time of day ('morning', 'afternoon', 'evening', 'night')
 * @param {string} npcType - Type of NPC
 * @param {number} relationship - Relationship value with player
 * @param {number} previousEncounters - Number of previous interactions
 * @returns {string} Appropriate greeting
 */
const getTimeBasedGreeting = (timeOfDay, npcType, relationship, previousEncounters) => {
  // Base greetings by time
  const timeGreetings = {
    morning: [
      "Good morning!", 
      "The day is young!", 
      "A fine morning to you!"
    ],
    afternoon: [
      "Good afternoon!", 
      "The day progresses well.", 
      "Greetings this fine day."
    ],
    evening: [
      "Good evening!", 
      "The day wanes.", 
      "A pleasant evening to you."
    ],
    night: [
      "Working late?", 
      "The stars are bright tonight.", 
      "Unusual to see you at this hour."
    ]
  };
  
  // Modified based on relationship
  if (relationship >= 80) {
    // Very friendly
    return `Ah, my dear friend! ${timeGreetings[timeOfDay][Math.floor(Math.random() * timeGreetings[timeOfDay].length)]}`;
  } else if (relationship >= 50) {
    // Friendly
    return timeGreetings[timeOfDay][Math.floor(Math.random() * timeGreetings[timeOfDay].length)];
  } else if (relationship >= 25) {
    // Neutral
    return timeGreetings[timeOfDay][Math.floor(Math.random() * timeGreetings[timeOfDay].length)];
  } else {
    // Cold
    return "Hmph. What do you want?";
  }
};

/**
 * Get a random greeting appropriate to the NPC type and relationship
 * @param {string} npcType - Type of NPC
 * @param {number} relationship - Relationship value (0-100)
 * @param {number} previousEncounters - Number of previous interactions
 * @returns {string} Appropriate greeting text
 */
export const getRandomGreeting = (npcType, relationship = 50, previousEncounters = 0) => {
  // Base greetings by NPC type
  const greetings = {
    Sage: [
      "Seek you wisdom, young one?",
      "The path to knowledge awaits.",
      "What mysteries do you pursue?"
    ],
    Merchant: [
      "Welcome to my humble shop!",
      "Got wares and coin to trade.",
      "The finest goods at fair prices!"
    ],
    Trainer: [
      "Ready for today's lesson?",
      "Your skills can always improve.",
      "Let's make you stronger."
    ],
    Guard: [
      "Move along, citizen.",
      "Keep out of trouble.",
      "I'm watching you."
    ],
    Innkeeper: [
      "Welcome to our establishment!",
      "Need a room for the night?",
      "Food, drink, and a warm bed available."
    ],
    Farmer: [
      "Fine day for the crops!",
      "Working the land is honest work.",
      "Need any fresh produce?"
    ],
    Noble: [
      "To what do I owe this... interruption?",
      "State your business quickly.",
      "I suppose I can spare a moment."
    ]
  };

  // First meeting vs. returning
  if (previousEncounters === 0) {
    // First meeting greetings
    return "Ah, a new face around here. Greetings!";
  } else if (previousEncounters > 10) {
    // Frequent visitor
    if (relationship >= 70) {
      return "Always a pleasure to see my favorite visitor!";
    } else if (relationship >= 40) {
      return "Back again, I see!";
    } else {
      return "You again...";
    }
  }

  // Relationship adjusted greetings
  if (relationship >= 80) {
    // Very friendly
    return "My friend! Always delighted to see you!";
  } else if (relationship >= 50) {
    // Friendly
    const typeGreetings = greetings[npcType] || ["Greetings, traveler."];
    return typeGreetings[Math.floor(Math.random() * typeGreetings.length)];
  } else if (relationship >= 25) {
    // Neutral
    return "Hello there.";
  } else {
    // Cold or hostile
    return "What do you want?";
  }
};

/**
 * Format dialogue text with dynamic content
 * @param {string} text - Raw dialogue text with placeholders
 * @param {Object} player - Player data for replacements
 * @param {Object} gameState - Game state for replacements
 * @returns {string} Formatted text
 */
export const formatDialogueText = (text, player, gameState) => {
  if (!text) return "";
  
  // Replace player name
  let formattedText = text.replace(/\{playerName\}/g, player?.name || "Traveler");
  
  // Replace class
  formattedText = formattedText.replace(/\{playerClass\}/g, player?.class || "adventurer");
  
  // Replace time of day
  formattedText = formattedText.replace(/\{timeOfDay\}/g, gameState?.timeOfDay || "day");
  
  // Replace stats
  const statMatch = formattedText.match(/\{stat:([^}]+)\}/g);
  if (statMatch) {
    statMatch.forEach(match => {
      const statName = match.replace(/\{stat:([^}]+)\}/g, "$1");
      formattedText = formattedText.replace(match, player?.stats?.[statName] || "0");
    });
  }
  
  return formattedText;
};