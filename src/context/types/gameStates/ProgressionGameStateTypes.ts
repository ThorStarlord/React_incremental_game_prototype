/**
 * Type definitions for progression-related game state
 */

/**
 * Structure for individual quests
 */
export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  isCompleted: boolean;
  requiredLevel?: number;
  requiredQuests?: string[];
}

/**
 * Quest objective structure
 */
export interface QuestObjective {
  id: string;
  description: string;
  progress: number;
  target: number;
  type: 'kill' | 'collect' | 'explore' | 'talk' | 'craft' | 'custom';
  targetId?: string;
  isCompleted: boolean;
}

/**
 * Quest reward structure
 */
export interface QuestReward {
  type: 'gold' | 'item' | 'experience' | 'skill-exp' | 'reputation' | 'unlock';
  amount?: number;
  itemId?: string;
  skillName?: string;
  featureId?: string;
  reputationId?: string;
}

/**
 * Achievement structure
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  rewards?: QuestReward[];
  progress?: number;
  target?: number;
  hiddenUntilUnlocked?: boolean;
}

/**
 * Location structure
 */
export interface GameLocation {
  id: string;
  name: string;
  description: string;
  connectedLocations: string[];
  availableActivities: string[];
  requiredLevel?: number;
  requiredQuests?: string[];
}

/**
 * Game feature that can be unlocked
 */
export interface GameFeature {
  id: string;
  name: string;
  description: string;
  unlockRequirement: {
    type: 'level' | 'quest' | 'achievement' | 'item' | 'currency';
    id?: string;
    level?: number;
    amount?: number;
  };
}

/**
 * Game progression tracking
 */
export interface ProgressionState {
  currentLocation: string;
  unlockedLocations: string[];
  completedQuests: string[];
  activeQuests: string[];
  achievements: string[];
  unlockedFeatures: string[];
  questProgress?: Record<string, Quest>;
  achievementProgress?: Record<string, Achievement>;
  locationData?: Record<string, GameLocation>;
  featureData?: Record<string, GameFeature>;
}
