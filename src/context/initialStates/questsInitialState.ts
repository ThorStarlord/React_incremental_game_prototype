/**
 * @file Initial state for the quest system
 * 
 * This file defines the initial state for the quest tracking system,
 * including active, completed, and available quests.
 */

/**
 * Quest objective that must be completed as part of a quest
 */
export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  current?: number;
  target?: number;
  type: 'kill' | 'gather' | 'explore' | 'talk' | 'craft' | 'deliver';
}

/**
 * Quest reward granted upon completion
 */
export interface QuestReward {
  type: 'gold' | 'experience' | 'item' | 'reputation' | 'skill';
  amount?: number;
  itemId?: string;
  factionId?: string;
  skillId?: string;
}

/**
 * Quest data structure
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  level: number;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  isStory?: boolean;
  isRepeatable?: boolean;
  factionId?: string;
  unlocks?: string[];
  requiredQuests?: string[];
}

/**
 * Quest log entry for tracking player progress
 */
export interface QuestLogEntry {
  timestamp: number;
  message: string;
  questId: string;
  type: 'start' | 'progress' | 'complete' | 'fail';
}

/**
 * Complete quest state
 */
export interface QuestState {
  activeQuests: Quest[];
  completedQuests: string[];
  failedQuests: string[];
  availableQuests: Quest[];
  questLog: QuestLogEntry[];
  dailyReset: number;
  weeklyReset: number;
}

/**
 * Initial quest state with empty collections
 * 
 * Quests are populated during gameplay as the player
 * discovers new areas, talks to NPCs, and progresses
 * through the game's content.
 */
const questsInitialState: QuestState = {
  activeQuests: [],       // Quests the player has accepted but not completed
  completedQuests: [],    // IDs of quests the player has finished
  failedQuests: [],       // IDs of quests the player has failed
  availableQuests: [],    // Quests the player can accept
  questLog: [],           // History of quest-related events
  dailyReset: 0,          // Timestamp for daily quest reset
  weeklyReset: 0          // Timestamp for weekly quest reset
};

export default questsInitialState;
