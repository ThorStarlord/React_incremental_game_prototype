/**
 * @file questsInitialState.ts
 * @description Initial state configuration for the quest system.
 * @module features/Quests
 */

/**
 * Defines the requirement type for a quest
 */
export interface QuestRequirement {
  /** Type of requirement (level, item, quest, etc.) */
  type: string;
  /** Required value (level number, item id, etc.) */
  value: any;
  /** Human-readable description of the requirement */
  description?: string;
}

/**
 * Defines a single objective within a quest
 */
export interface QuestObjective {
  /** Unique identifier for the objective */
  id: string;
  /** Description of the objective */
  description: string;
  /** Type of objective (kill, collect, interact, etc.) */
  type: string;
  /** Target of the objective (enemy type, item, etc.) */
  target: any;
  /** Amount required (kills, items, etc.) */
  required: number;
  /** Whether the objective is completed */
  completed: boolean;
}

/**
 * Defines a reward for completing a quest
 */
export interface QuestReward {
  /** Type of reward (experience, gold, item, etc.) */
  type: string;
  /** Value of the reward (XP amount, gold amount, item ID, etc.) */
  value: any;
  /** Quantity of the reward (for items) */
  quantity?: number;
}

/**
 * Quest status type
 */
export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed';

/**
 * Defines a single quest
 */
export interface Quest {
  /** Unique identifier for the quest */
  id: string;
  /** Display title of the quest */
  title: string;
  /** Description of the quest */
  description: string;
  /** Prerequisites to start the quest */
  requirements: QuestRequirement[];
  /** Tasks that need to be completed */
  objectives: QuestObjective[];
  /** Rewards given upon completion */
  rewards: QuestReward[];
  /** Current status of the quest */
  status: QuestStatus;
}

/**
 * Tracks progress for a specific quest
 */
export interface QuestProgress {
  /** Progress on objectives indexed by objective ID */
  objectiveProgress: {
    [objectiveId: string]: number;
  };
  /** When the quest was started */
  startedAt: Date;
  /** When the quest was completed */
  completedAt?: Date;
}

/**
 * State structure for the quest system
 */
export interface QuestsState {
  /** Collection of all quests indexed by ID */
  quests: {
    [questId: string]: Quest;
  };
  /** IDs of currently active quests */
  activeQuestIds: string[];
  /** IDs of completed quests */
  completedQuestIds: string[];
  /** Progress tracking for quests */
  questProgress: {
    [questId: string]: QuestProgress;
  };
}

/**
 * Initial state for the quests feature
 */
const initialState: QuestsState = {
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
