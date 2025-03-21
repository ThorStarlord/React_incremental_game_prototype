/**
 * Interface for town route parameters
 */
export interface TownParams {
  townId: string;
}

/**
 * Interface for NPC route parameters
 */
export interface NPCParams {
  npcId: string;
}

/**
 * Interface for NPC data
 */
export interface NPC {
  id: string;
  [key: string]: any; // Additional NPC properties
}

/**
 * Interface for Location data
 */
export interface Location {
  name?: string;
  npcs?: NPC[];
  [key: string]: any; // Additional location properties
}

/**
 * Interface for Game State
 */
export interface GameState {
  npcs?: NPC[];
  game?: {
    currentLocation?: Location;
    [key: string]: any; // Additional game properties
  };
  [key: string]: any; // Additional state properties
}
