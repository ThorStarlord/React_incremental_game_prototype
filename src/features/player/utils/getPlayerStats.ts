import { PlayerState } from '../playerInitialState';

/**
 * Type definition for player updates
 */
type PlayerUpdates = Partial<PlayerState>;

// Assuming this file uses a player object that would be imported or defined
// For TypeScript, we need to define where 'player' comes from
// The implementation below assumes 'player' would be imported or passed as a parameter

/**
 * Gets the player object
 * 
 * @param player - The player state object
 * @returns The complete player object
 */
export const getPlayer = (player: PlayerState): PlayerState => {
    return player;
};

/**
 * Updates player properties
 * 
 * @param player - The player state object to update
 * @param updates - Object containing properties to update
 * @returns Updated player object
 */
export const updatePlayer = (player: PlayerState, updates: PlayerUpdates): PlayerState => {
    return { ...player, ...updates };
};

/**
 * Gets the player's name
 * 
 * @param player - The player state object
 * @returns The player's name
 */
export const getPlayerName = (player: PlayerState): string => {
    return player.name;
};

/**
 * Gets the player's level
 * 
 * @param player - The player state object
 * @returns The player's current level
 */
export const getPlayerLevel = (player: PlayerState): number => {
    return player.level;
};

/**
 * Gets the player's current health
 * 
 * @param player - The player state object
 * @returns The player's current health
 */
export const getPlayerHealth = (player: PlayerState): number => {
    return player.health;
};

/**
 * Gets the player's maximum health
 * 
 * @param player - The player state object
 * @returns The player's maximum health
 */
export const getPlayerMaxHealth = (player: PlayerState): number => {
    return player.maxHealth;
};

/**
 * Gets the player's current energy
 * 
 * @param player - The player state object
 * @returns The player's current energy
 */
export const getPlayerEnergy = (player: PlayerState): number => {
    return player.energy;
};

/**
 * Gets the player's maximum energy
 * 
 * @param player - The player state object
 * @returns The player's maximum energy
 */
export const getPlayerMaxEnergy = (player: PlayerState): number => {
    return player.maxEnergy;
};

/**
 * Gets the player's current experience
 * 
 * @param player - The player state object
 * @returns The player's current experience
 */
export const getPlayerExperience = (player: PlayerState): number => {
    // Note: This requires adding 'experience' to the PlayerState interface in playerInitialState.ts
    return player.experience;
};

/**
 * Gets the player's maximum experience for the current level
 * 
 * @param player - The player state object
 * @returns The experience required for the next level
 */
export const getPlayerMaxExperience = (player: PlayerState): number => {
    // Note: This requires adding 'maxExperience' to the PlayerState interface in playerInitialState.ts
    return player.maxExperience;
};
