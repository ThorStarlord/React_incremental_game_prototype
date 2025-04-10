// Import PlayerState from the local PlayerTypes file
import { PlayerState } from '../state/PlayerTypes';
// Import LEVEL_REQUIREMENTS or calculation logic if needed
import { LEVEL_REQUIREMENTS, calculateExperienceForLevel } from '../../../constants/gameConstants';

/**
 * Type definition for player updates
 */
type PlayerUpdates = Partial<PlayerState>;

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
    // Add null check for player name safety
    return player.name ?? 'Unknown';
};

/**
 * Gets the player's level
 *
 * @param player - The player state object
 * @returns The player's current level
 */
export const getPlayerLevel = (player: PlayerState): number => {
    // Add fallback for potentially missing level
    return player.level ?? 1;
};

/**
 * Gets the player's current health
 *
 * @param player - The player state object
 * @returns The player's current health
 */
export const getPlayerHealth = (player: PlayerState): number => {
    // Add fallback for potentially missing stats or health
    return player.stats?.health ?? 0;
};

/**
 * Gets the player's maximum health
 *
 * @param player - The player state object
 * @returns The player's maximum health
 */
export const getPlayerMaxHealth = (player: PlayerState): number => {
    // Add fallback for potentially missing stats or maxHealth
    return player.stats?.maxHealth ?? 100;
};

/**
 * Gets the player's current energy (mana)
 *
 * @param player - The player state object
 * @returns The player's current energy/mana
 */
export const getPlayerEnergy = (player: PlayerState): number => {
    // Use mana from stats, remove fallback to non-existent 'energy'
    return player.stats?.mana ?? 0;
};

/**
 * Gets the player's maximum energy (mana)
 *
 * @param player - The player state object
 * @returns The player's maximum energy/mana
 */
export const getPlayerMaxEnergy = (player: PlayerState): number => {
    // Use maxMana from stats, remove fallback to non-existent 'maxEnergy'
    return player.stats?.maxMana ?? 100;
};

/**
 * Gets the player's current experience
 *
 * @param player - The player state object
 * @returns The player's current experience
 */
export const getPlayerExperience = (player: PlayerState): number => {
    // Add fallback for potentially missing experience
    return player.experience ?? 0;
};

/**
 * Gets the experience required for the player's next level
 *
 * @param player - The player state object
 * @returns The experience required for the next level
 */
export const getPlayerMaxExperience = (player: PlayerState): number => {
    // Calculate the experience needed for the *next* level
    const nextLevel = (player.level ?? 1) + 1;
    // Use the same calculation logic as in PlayerSelectors or gameConstants
    // Example using calculateExperienceForLevel from gameConstants:
    return calculateExperienceForLevel(nextLevel);
    // Or if using LEVEL_REQUIREMENTS directly:
    // return LEVEL_REQUIREMENTS[nextLevel]?.xp ?? calculateExperienceForLevel(nextLevel);
};
