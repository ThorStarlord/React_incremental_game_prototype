/**
 * Calculate damage based on attack and defense values
 * 
 * @param {number} attack - The attacker's attack value
 * @param {number} defense - The defender's defense value
 * @returns {number} The calculated damage amount (minimum 0)
 */
export const calculateDamage = (attack: number, defense: number): number => {
    return Math.max(0, attack - defense);
};
