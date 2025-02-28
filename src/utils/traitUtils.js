/**
 * Check if player can acquire a trait
 * @param {Object} player - Player object
 * @param {number} essence - Current essence amount
 * @param {string} traitId - ID of trait to check
 * @param {Object} traits - Traits data
 * @param {number} essenceCost - Optional override for essence cost
 * @returns {Object} - { canAcquire: boolean, reason: string }
 */
export const canAcquireTrait = (player, essence, traitId, traits, essenceCost = null) => {
  const trait = traits.copyableTraits[traitId];
  
  if (!trait) {
    return { canAcquire: false, reason: "Trait not found" };
  }
  
  if (player.acquiredTraits.includes(traitId)) {
    return { canAcquire: false, reason: "You already know this trait" };
  }
  
  const cost = essenceCost !== null ? essenceCost : trait.essenceCost;
  
  if (essence < cost) {
    return { 
      canAcquire: false, 
      reason: `Not enough essence (need ${cost}, have ${essence})`,
      missingEssence: cost - essence
    };
  }
  
  return { canAcquire: true, reason: "Can acquire" };
};