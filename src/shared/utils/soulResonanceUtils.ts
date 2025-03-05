/**
 * Interface for affinities object
 */
interface Affinities {
  [npcId: string]: string;
}

/**
 * Calculate the amount of essence generated based on character affinities
 * 
 * @param {Affinities} affinities - Object mapping NPC IDs to affinity levels
 * @returns {number} Total essence generation value
 */
export const calculateEssenceGeneration = (affinities: Affinities): number => {
  let total = 0;
  for (const level of Object.values(affinities)) {
    switch (level) {
      case 'Acquaintance':
        total += 1;
        break;
      case 'Friend':
        total += 2;
        break;
      case 'Ally':
        total += 3;
        break;
      case 'Soulbound':
        total += 5;
        break;
      default:
        break;
    }
  }
  return total;
};
