import { useCallback, useMemo } from 'react';
import elaraDialogues from '../data/dialogues/elara.json';
import borinDialogues from '../data/dialogues/borin.json';
import willaDialogues from '../data/dialogues/willa.json';
import { startQuest, updateQuestProgress } from '../../Quests/utils/questManager';

/**
 * Interface defining a dialogue condition
 */
interface DialogueCondition {
  /** Type of condition ('quest', 'item', 'stat', 'reputation', etc.) */
  type: string;
  /** Target ID (questId, itemId, statName, etc.) */
  target: string;
  /** Comparison operator ('==', '>', '<', '>=', '<=', '!=') */
  operator?: string;
  /** Value to compare against */
  value?: any;
  /** Whether to negate the condition */
  negate?: boolean;
}

/**
 * Interface defining a dialogue option
 */
interface DialogueOption {
  /** Unique identifier for this dialogue option */
  id: string;
  /** The text shown to the player */
  text: string;
  /** Conditions that must be met to show this option */
  conditions?: DialogueCondition[];
  /** ID of the next dialogue to show when this option is selected */
  nextDialogue?: string;
  /** Actions to perform when this option is selected */
  actions?: DialogueAction[];
  /** How this affects NPC relationships */
  relationshipChanges?: Record<string, number>;
}

/**
 * Interface defining a dialogue action
 */
interface DialogueAction {
  /** Type of action to perform */
  type: string;
  /** Target of the action (quest ID, item ID, etc.) */
  [key: string]: any;
}

/**
 * Interface defining a dialogue node
 */
interface DialogueNode {
  /** Unique identifier for this dialogue */
  id: string;
  /** Title/summary of this dialogue (for history) */
  title?: string;
  /** The text spoken by the NPC */
  text: string;
  /** Who is speaking (NPC name, or "player" for player responses) */
  speaker?: string;
  /** Conditions to show this dialogue */
  conditions?: DialogueCondition[];
  /** Available player responses */
  options: DialogueOption[];
  /** Whether this is a root dialogue */
  isRoot?: boolean;
  /** Actions to perform when this dialogue is shown */
  actions?: DialogueAction[];
  /** NPC's mood during this dialogue */
  mood?: string;
  /** Dialogue category for organization */
  category?: string;
  /** Short summary for history view */
  snippet?: string;
}

/**
 * Interface defining NPC dialogue data
 */
interface NPCDialogueData {
  /** Array of dialogue nodes for this NPC */
  dialogues: DialogueNode[];
}

/**
 * Interface for Dialogue NPCs collection
 */
interface DialogueNPCs {
  /** Elara's dialogue data */
  elara: NPCDialogueData;
  /** Borin's dialogue data */
  borin: NPCDialogueData;
  /** Willa's dialogue data */
  willa: NPCDialogueData;
  /** Additional NPCs */
  [key: string]: NPCDialogueData;
}

/**
 * Interface for player state
 */
interface Player {
  /** Player stats like strength, intelligence, etc. */
  stats?: Record<string, number>;
  /** Player inventory items */
  inventory: Array<{id: string, quantity: number}>;
  /** Additional player properties */
  [key: string]: any;
}

/**
 * Interface for game state
 */
interface GameState {
  /** Quest information */
  quests: Array<{id: string, active: boolean, completed: boolean, failed: boolean}>;
  /** Reputation with different factions */
  reputations?: Record<string, number>;
  /** NPC data including relationships */
  npcs: Array<{id: string, relationship: number}>;
  /** Game flags set */
  flags: string[];
  /** Current time of day */
  timeOfDay: string;
  /** Additional game state properties */
  [key: string]: any;
}

/**
 * Interface for dispatch function
 */
interface Dispatch {
  (action: { type: string, payload: any }): void;
}

// Import dialogue data
const dialogueData: DialogueNPCs = {
  elara: elaraDialogues as any,
  borin: borinDialogues as any,
  willa: willaDialogues as any
};

/**
 * Hook for managing NPC dialogue interactions
 * @param npcId - ID of the NPC to interact with
 * @returns Dialogue management functions
 */
export const useDialogue = (npcId: string) => {
  /**
   * Get a specific dialogue by ID
   * @param dialogueId - ID of the dialogue to retrieve
   * @returns The dialogue if found
   */
  const getDialogue = useCallback((dialogueId: string): DialogueNode | undefined => {
    const npcDialogues = dialogueData[npcId as keyof DialogueNPCs]?.dialogues;
    return npcDialogues?.find(d => d.id === dialogueId);
  }, [npcId]);

  /**
   * Get all dialogues for the current NPC
   * @returns All dialogues for this NPC
   */
  const getAllDialogues = useCallback((): DialogueNode[] => {
    return dialogueData[npcId as keyof DialogueNPCs]?.dialogues || [];
  }, [npcId]);

  /**
   * Get root dialogue nodes (starting conversations)
   * @returns Root dialogue nodes
   */
  const getRootDialogues = useCallback((): DialogueNode[] => {
    const dialogues = dialogueData[npcId as keyof DialogueNPCs]?.dialogues || [];
    return dialogues.filter(d => d.isRoot === true);
  }, [npcId]);

  /**
   * Check if a dialogue condition is met
   * @param condition - The condition to check
   * @param player - Player state
   * @param gameState - Current game state
   * @returns Whether the condition is met
   */
  const checkCondition = useCallback((
    condition: DialogueCondition,
    player: Player,
    gameState: GameState
  ): boolean => {
    // Default result if no condition logic matches
    let result = false;
    
    switch(condition.type) {
      case 'quest':
        const quest = gameState.quests.find(q => q.id === condition.target);
        if (condition.operator === 'active') {
          result = !!quest?.active;
        } else if (condition.operator === 'completed') {
          result = !!quest?.completed;
        } else if (condition.operator === 'failed') {
          result = !!quest?.failed;
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
   * @param conditions - List of conditions to check
   * @param player - Player state
   * @param gameState - Current game state
   * @returns Whether all conditions are met
   */
  const checkAllConditions = useCallback((
    conditions: DialogueCondition[] | undefined, 
    player: Player, 
    gameState: GameState
  ): boolean => {
    if (!conditions || conditions.length === 0) return true;
    
    return conditions.every(condition => checkCondition(condition, player, gameState));
  }, [checkCondition]);

  /**
   * Get available dialogue options based on conditions
   * @param dialogue - Current dialogue
   * @param player - Player state
   * @param gameState - Current game state
   * @returns Available options
   */
  const getAvailableOptions = useCallback((
    dialogue: DialogueNode | null | undefined,
    player: Player,
    gameState: GameState
  ): DialogueOption[] => {
    if (!dialogue || !dialogue.options) return [];
    
    return dialogue.options.filter(option => 
      !option.conditions || checkAllConditions(option.conditions, player, gameState)
    );
  }, [checkAllConditions]);

  /**
   * Execute the actions specified in a dialogue or option
   * @param actions - Actions to perform
   * @param dispatch - Redux dispatch function
   * @param gameState - Current game state
   * @param player - Player state
   */
  const executeActions = useCallback((
    actions: DialogueAction[] | undefined,
    dispatch: Dispatch,
    gameState: GameState,
    player: Player
  ): void => {
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
   * @param option - Selected dialogue option
   * @param currentDialogue - Current dialogue node
   * @param dispatch - Redux dispatch function
   * @param gameState - Current game state
   * @param player - Player state 
   * @param setCurrentDialogue - Function to update current dialogue
   * @returns Next dialogue or null if ending conversation
   */
  const handleOptionSelected = useCallback((
    option: DialogueOption, 
    currentDialogue: DialogueNode | null, 
    dispatch: Dispatch, 
    gameState: GameState, 
    player: Player,
    setCurrentDialogue: (dialogue: DialogueNode | null) => void
  ): DialogueNode | null => {
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
   * @param npc - NPC data
   * @param gameState - Current game state
   * @returns Appropriate greeting text
   */
  const generateGreeting = useCallback((
    npc: { type?: string; relationship?: number },
    gameState: { timeOfDay: string; playerInteractions?: { interactionHistory?: Record<string, { interactionCount: number }> } }
  ): string => {
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
 * @param timeOfDay - Time of day ('morning', 'afternoon', 'evening', 'night')
 * @param npcType - Type of NPC
 * @param relationship - Relationship value with player
 * @param previousEncounters - Number of previous interactions
 * @returns Appropriate greeting
 */
const getTimeBasedGreeting = (
  timeOfDay: string, 
  npcType?: string, 
  relationship: number = 0, 
  previousEncounters: number = 0
): string => {
  // Base greetings by time
  const timeGreetings: Record<string, string[]> = {
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
 * @param npcType - Type of NPC
 * @param relationship - Relationship value (0-100)
 * @param previousEncounters - Number of previous interactions
 * @returns Appropriate greeting text
 */
export const getRandomGreeting = (
  npcType?: string, 
  relationship: number = 50, 
  previousEncounters: number = 0
): string => {
  // Base greetings by NPC type
  const greetings: Record<string, string[]> = {
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
    const typeGreetings = npcType && greetings[npcType] ? greetings[npcType] : ["Greetings, traveler."];
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
 * @param text - Raw dialogue text with placeholders
 * @param player - Player data for replacements
 * @param gameState - Game state for replacements
 * @returns Formatted text
 */
export const formatDialogueText = (
  text: string, 
  player?: { name?: string; class?: string; stats?: Record<string, any> }, 
  gameState?: { timeOfDay?: string }
): string => {
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
      formattedText = formattedText.replace(match, String(player?.stats?.[statName] || "0"));
    });
  }
  
  return formattedText;
};
