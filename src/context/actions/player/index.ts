/**
 * Player Actions
 * ==============
 * 
 * This file exports all actions related to the player character in the incremental RPG.
 * It serves as the public API for player actions, aggregating them from specialized modules.
 * 
 * @module playerActions
 */

// Export from each module directly instead of importing from playerActions
export {
  updatePlayer,
  setPlayerName,
  resetPlayer
} from './stateActions';

export {
  modifyHealth,
  modifyEnergy,
  rest
} from './healthActions';

export {
  acquireTrait,
  equipTrait,
  unequipTrait
} from './traitActions';

export {
  allocateAttribute,
  addAttributePoints,
  spendAttributePoints
} from './attributeActions';

export {
  updateSkill,
  learnSkill,
  upgradeSkill
} from './skillActions';

export {
  setActiveCharacter,
  updatePlayTime
} from './characterActions';

// Export types
export {
  ModificationReason,
  PLAYER_ACTIONS
} from '../../types/playerActionTypes';

// Export utils
export {
  playerActionValidation
} from './utils';
