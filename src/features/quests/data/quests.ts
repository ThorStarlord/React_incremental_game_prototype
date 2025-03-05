/**
 * Interface defining a quest step
 */
interface QuestStep {
  /** Description of what the player needs to do */
  description: string;
  /** The type of action required (talk, deliver, find, clear, etc.) */
  action: string;
  /** The target of the action (NPC, location, item, etc.) */
  target: string;
  /** Optional item required for the step (for delivery quests, etc.) */
  item?: string;
}

/**
 * Interface defining rewards for completing a quest
 */
interface QuestRewards {
  /** Amount of essence rewarded */
  essence?: number;
  /** Affinity gained with an NPC */
  affinity?: {
    /** The NPC identifier */
    npc: string;
    /** Amount of affinity points gained */
    amount: number;
  };
  /** Skill rewarded on completion */
  skill?: string;
}

/**
 * Interface defining a quest
 */
export interface QuestData {
  /** Unique identifier for the quest */
  id: string;
  /** Display name of the quest */
  name: string;
  /** NPC who gives the quest */
  giver: string;
  /** Description of the quest */
  description: string;
  /** Steps required to complete the quest */
  steps: QuestStep[];
  /** Rewards for completing the quest */
  rewards: QuestRewards;
}

/**
 * Array of all available quests in the game
 */
const quests: QuestData[] = [
  {
    id: 'welcome_to_oakhaven',
    name: 'Welcome to Oakhaven',
    giver: 'elara',
    description: 'Talk to Elder Elara, learn about Oakhaven, and complete a simple task she requests.',
    steps: [
      {
        description: 'Talk to Elder Elara',
        action: 'talk',
        target: 'elara'
      },
      {
        description: 'Deliver the medicinal herb pouch to Borin at the lumber mill',
        action: 'deliver',
        target: 'borin',
        item: 'medicinal_herb_pouch'
      }
    ],
    rewards: {
      essence: 10,
      affinity: { npc: 'elara', amount: 1 }
    }
  },
  {
    id: 'lumber_mill_troubles',
    name: 'Lumber Mill Troubles',
    giver: 'borin',
    description: 'Help Borin at the lumber mill with a minor problem.',
    steps: [
      {
        description: 'Clear the debris in the lumber storage area',
        action: 'clear',
        target: 'lumber_storage_area'
      }
    ],
    rewards: {
      essence: 15,
      affinity: { npc: 'borin', amount: 1 },
      skill: 'miners_strength'
    }
  },
  {
    id: 'tavern_tales',
    name: 'Tavern Tales',
    giver: 'willa',
    description: 'Talk to Whispering Willa at the tavern and gather rumors about the surrounding region.',
    steps: [
      {
        description: 'Find a rare flower near the edge of the Whispering Woods',
        action: 'find',
        target: 'rare_flower'
      },
      {
        description: 'Bring the rare flower back to Willa',
        action: 'deliver',
        target: 'willa',
        item: 'rare_flower'
      }
    ],
    rewards: {
      essence: 10,
      affinity: { npc: 'willa', amount: 1 },
      skill: 'gossip_network'
    }
  }
];

export default quests;

/**
 * Fetches all available quests
 * @returns Promise resolving to an array of quests
 */
export const fetchQuests = (): Promise<QuestData[]> => {
  // Simulating an API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(quests), 300);
  });
};
