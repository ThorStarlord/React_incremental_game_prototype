import { Trait } from '../state/TraitsTypes'; // Assuming TraitDefinition is now Trait

/**
 * Checks if a player can afford to acquire a trait based on essence cost
 *
 * @param trait - The trait object with cost information
 * @param availableEssence - The player's current essence amount
 * @returns Whether the player can afford the trait
 */
export const canAffordTrait = (trait: Trait, availableEssence: number): boolean => {
  // Use essenceCost, default to 0 if not defined
  return (trait.essenceCost ?? 0) <= availableEssence;
};

/**
 * Gets traits that are available to be acquired based on prerequisites and acquisition status
 *
 * @param traits - All available traits in the game
 * @param acquiredTraitIds - IDs of traits the player has already acquired
 * @param playerLevel - Current level of the player (optional, for level requirements)
 * @returns An object containing traits that are available for the player to acquire
 */
export const getAvailableTraits = (
  traits: { [id: string]: Trait },
  acquiredTraitIds: string[],
  playerLevel?: number // Add playerLevel for requirement checks
): { [id: string]: Trait } => {
  return Object.entries(traits).reduce((available, [id, trait]) => {
    // Skip if already acquired
    if (acquiredTraitIds.includes(id)) {
      return available;
    }

    // Check prerequisites if any
    if (trait.requirements) {
      const meetsPrerequisites = Object.entries(trait.requirements).every(([reqKey, reqValue]) => {
        switch (reqKey) {
          case 'level':
            return playerLevel !== undefined && playerLevel >= (reqValue as number);
          case 'prerequisiteTrait':
            return acquiredTraitIds.includes(reqValue as string);
          // Add cases for other requirement types like 'quest', 'relationshipLevel', etc.
          // case 'quest':
          //   // Check if quest is completed (requires access to quest state)
          //   return checkQuestCompletion(reqValue as string);
          // case 'relationshipLevel':
          //   // Check NPC relationship level (requires access to NPC state)
          //   return checkRelationshipLevel(trait.requirements?.npcId, reqValue as number);
          default:
            // Assume unknown requirements are met or handle them specifically
            return true;
        }
      });

      if (!meetsPrerequisites) {
        return available;
      }
    }

    // If all checks pass, add the trait to the available list
    available[id] = trait;
    return available;
  }, {} as { [id: string]: Trait });
};
