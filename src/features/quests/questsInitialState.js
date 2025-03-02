/**
 * @file questsInitialState.js
 * @description Initial state configuration for the quest system.
 * @module features/Quests
 */

/**
 * Initial state for the quests feature
 * @typedef {Object} QuestsState
 * @property {Object.<string, Quest>} quests - Collection of all quests indexed by ID
 * @property {string[]} activeQuestIds - IDs of currently active quests
 * @property {string[]} completedQuestIds - IDs of completed quests
 * @property {Object.<string, QuestProgress>} questProgress - Progress tracking for quests
 */

/**
 * @typedef {Object} Quest
 * @property {string} id - Unique identifier for the quest
 * @property {string} title - Display title of the quest
 * @property {string} description - Description of the quest
 * @property {QuestRequirement[]} requirements - Prerequisites to start the quest
 * @property {QuestObjective[]} objectives - Tasks that need to be completed
 * @property {QuestReward[]} rewards - Rewards given upon completion
 * @property {('not_started'|'active'|'completed'|'failed')} status - Current status of the quest
 */

/**
 * @typedef {Object} QuestRequirement
 * @property {string} type - Type of requirement (level, item, quest, etc.)
 * @property {*} value - Required value (level number, item id, etc.)
 * @property {string} [description] - Human-readable description of the requirement
 */

/**
 * @typedef {Object} QuestObjective
 * @property {string} id - Unique identifier for the objective
 * @property {string} description - Description of the objective
 * @property {string} type - Type of objective (kill, collect, interact, etc.)
 * @property {*} target - Target of the objective (enemy type, item, etc.)
 * @property {number} required - Amount required (kills, items, etc.)
 * @property {boolean} completed - Whether the objective is completed
 */

/**
 * @typedef {Object} QuestReward
 * @property {string} type - Type of reward (experience, gold, item, etc.)
 * @property {*} value - Value of the reward (XP amount, gold amount, item ID, etc.)
 * @property {number} [quantity] - Quantity of the reward (for items)
 */

/**
 * @typedef {Object} QuestProgress
 * @property {Object.<string, number>} objectiveProgress - Progress on objectives indexed by objective ID
 * @property {Date} startedAt - When the quest was started
 * @property {Date} [completedAt] - When the quest was completed
 */

const initialState = {
  quests: {
    'quest-1': {
      id: 'quest-1',
      title: 'Getting Started',
      description: 'Learn the basics of adventuring in this world.',
      requirements: [],
      objectives: [
        {
          id: 'obj-1',
          description: 'Talk to the Guild Master',
          type: 'interact',
          target: 'npc-guildmaster',
          required: 1,
          completed: false
        },
        {
          id: 'obj-2',
          description: 'Defeat 3 slimes',
          type: 'kill',
          target: 'enemy-slime',
          required: 3,
          completed: false
        }
      ],
      rewards: [
        {
          type: 'experience',
          value: 100
        },
        {
          type: 'gold',
          value: 50
        },
        {
          type: 'item',
          value: 'item-potion',
          quantity: 2
        }
      ],
      status: 'not_started'
    },
    'quest-2': {
      id: 'quest-2',
      title: 'The Missing Shipment',
      description: 'Investigate the disappearance of a merchant\'s goods.',
      requirements: [
        {
          type: 'quest',
          value: 'quest-1',
          description: 'Complete "Getting Started" quest'
        },
        {
          type: 'level',
          value: 2,
          description: 'Reach Level 2'
        }
      ],
      objectives: [
        {
          id: 'obj-1',
          description: 'Find the abandoned cart',
          type: 'interact',
          target: 'object-cart',
          required: 1,
          completed: false
        },
        {
          id: 'obj-2',
          description: 'Defeat the bandits',
          type: 'kill',
          target: 'enemy-bandit',
          required: 5,
          completed: false
        },
        {
          id: 'obj-3',
          description: 'Recover the stolen goods',
          type: 'collect',
          target: 'item-goods',
          required: 1,
          completed: false
        }
      ],
      rewards: [
        {
          type: 'experience',
          value: 200
        },
        {
          type: 'gold',
          value: 100
        },
        {
          type: 'item',
          value: 'item-sword-1',
          quantity: 1
        }
      ],
      status: 'not_started'
    }
  },
  activeQuestIds: [],
  completedQuestIds: [],
  questProgress: {}
};

export default initialState;
