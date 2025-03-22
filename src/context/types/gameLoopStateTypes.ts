import { PlayerState } from './PlayerGameStateTypes';
import { GameState } from './GameStateTypes';

/**
 * Interface for NPC object in the game state
 */
export interface NPC {
  id: string;
  name: string;
  relationship: number;
  [key: string]: any; // For other NPC properties
}

/**
 * Interface for area object in the game state
 */
export interface GameArea {
  id: string;
  name?: string;
  dangerLevel: number;
  possibleEnemies: string[];
  [key: string]: any;
}

/**
 * Interface for in-game time tracking
 */
export interface GameTime {
  day: number;
  period: 'MORNING' | 'DAY' | 'EVENING' | 'NIGHT';
  hour?: number;
  minute?: number;
}

/**
 * Interface for quest objectives
 */
export interface QuestObjective {
  id: string;
  type: string;
  description?: string;
  completed: boolean;
  progress?: number;
  target?: number;
  [key: string]: any;
}

/**
 * Interface for active quests
 */
export interface Quest {
  id: string;
  title?: string;
  description?: string;
  objectives?: QuestObjective[];
  rewards?: any[];
  status?: string;
  [key: string]: any;
}

/**
 * Extended PlayerState with additional properties
 */
export interface ExtendedPlayerState extends PlayerState {
  equippedTraits: string[];
  goldPerMinute?: number;
  activeSkill?: string;
  skills?: any[];
  healthRegenRate?: number;
  health?: number;
  maxHealth?: number;
  passiveSkillGainRate?: number;
}

/**
 * Extended GameState with additional properties used in GameLoop
 */
export interface ExtendedGameState extends GameState {
  player: ExtendedPlayerState;
  npcs?: NPC[];
  gameTime?: GameTime;
  inCombat?: boolean;
  currentArea?: GameArea;
  activeQuests?: Quest[];
}
