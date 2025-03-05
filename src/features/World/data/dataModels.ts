/**
 * Interface for the Region model
 * 
 * @interface RegionModelInterface
 */
export interface RegionModelInterface {
  id: string;
  name: string;
  description: string;
  features: string[];
  dangers: string[];
  resources: string[];
  townIds: string[];
  dungeonIds: string[];
}

/**
 * Interface for the Town model
 * 
 * @interface TownModelInterface
 */
export interface TownModelInterface {
  id: string;
  name: string;
  type: string;
  description: string;
  regionId: string;
  npcIds: number[];
}

/**
 * Interface for the Dungeon model
 * 
 * @interface DungeonModelInterface
 */
export interface DungeonModelInterface {
  id: string;
  name: string;
  type: string;
  description: string;
  regionId: string;
  dangers: string[];
  rewards: string[];
}

/**
 * Interface for the Route model
 * 
 * @interface RouteModelInterface
 */
export interface RouteModelInterface {
  id: string;
  name: string;
  description: string;
  regionIds: string[];
  townIds: string[];
  dangers: string[];
}

/**
 * Type validators for the data models
 * These can be used to validate data at runtime
 */
export const RegionModel = {
  id: String,
  name: String,
  description: String,
  features: [String],
  dangers: [String],
  resources: [String],
  townIds: [String],
  dungeonIds: [String],
};

export const TownModel = {
  id: String,
  name: String,
  type: String,
  description: String,
  regionId: String,
  npcIds: [Number],
};

export const DungeonModel = {
  id: String,
  name: String,
  type: String,
  description: String,
  regionId: String,
  dangers: [String],
  rewards: [String],
};

export const RouteModel = {
  id: String,
  name: String,
  description: String,
  regionIds: [String],
  townIds: [String],
  dangers: [String],
};
