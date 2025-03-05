/**
 * Interface for player object
 */
interface Player {
  acquiredTraits: string[];
  [key: string]: any; // Additional player properties
}

/**
 * Interface for trait object
 */
interface Trait {
  id: string;
  name: string;
  essenceCost: number;
  [key: string]: any; // Additional trait properties
}

/**
 * Interface for traits collection
 */
interface TraitsCollection {
  copyableTraits: {
    [key: string]: Trait;
  };
  [key: string]: any; // Additional trait collection properties
}

/**
 * Interface for the return value of canAcquireTrait function
 */
interface AcquisitionCheck {
  canAcquire: boolean;
  reason: string;
  missingEssence?: number;
}

/**
 * Check if player can acquire a trait
 * @param {Player} player - Player object
 * @param {number} essence - Current essence amount
 * @param {string} traitId - ID of trait to check
 * @param {TraitsCollection} traits - Traits data
 * @param {number} essenceCost - Optional override for essence cost
 * @returns {AcquisitionCheck} - { canAcquire: boolean, reason: string }
 */
export const canAcquireTrait = (
  player: Player, 
  essence: number, 
  traitId: string, 
  traits: TraitsCollection, 
  essenceCost: number | null = null
): AcquisitionCheck => {
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
