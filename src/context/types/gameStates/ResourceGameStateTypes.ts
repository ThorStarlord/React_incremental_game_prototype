/**
 * Type definitions for game resources and currencies
 */

/**
 * Game materials used for crafting and upgrades
 */
export interface Materials {
  wood: number;
  stone: number;
  leather: number;
  metal: number;
  cloth: number;
  herbs: number;
  [key: string]: number; // Allow for additional materials
}

/**
 * Game resources and currencies
 */
export interface ResourceState {
  gold: number;
  gems: number;
  materials: Materials;
}
