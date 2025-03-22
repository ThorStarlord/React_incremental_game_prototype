/**
 * Player-related action types
 */

export const PLAYER_ACTIONS = {
  GAIN_EXPERIENCE: 'player/gainExperience' as const,
  LEVEL_UP: 'player/levelUp' as const,
  MODIFY_HEALTH: 'player/modifyHealth' as const,
  MODIFY_ENERGY: 'player/modifyEnergy' as const,
  ALLOCATE_ATTRIBUTE: 'player/allocateAttribute' as const,
  EQUIP_ITEM: 'player/equipItem' as const,
  UNEQUIP_ITEM: 'player/unequipItem' as const,
  REST: 'player/rest' as const,
  UPDATE_PLAYER: 'player/update' as const,
  SET_NAME: 'player/setName' as const,
  RESET_PLAYER: 'player/reset' as const,
  ACQUIRE_TRAIT: 'player/acquireTrait' as const,
  SWITCH_CHARACTER: 'player/switchCharacter' as const,
  SET_ACTIVE_CHARACTER: 'player/setActiveCharacter' as const,
  UPDATE_TOTAL_PLAYTIME: 'player/updateTotalPlayTime' as const
};
