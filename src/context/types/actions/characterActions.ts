/**
 * Character management action types
 */

export const CHARACTER_ACTIONS = {
  SET_CHARACTER_TAB: 'character/setTab' as const,
  ADD_CHARACTER: 'character/add' as const,
  UPDATE_CHARACTER: 'character/update' as const,
  REMOVE_CHARACTER: 'character/remove' as const,
  SET_ACTIVE_CHARACTER: 'character/setActive' as const,
  ALLOCATE_ATTRIBUTE_POINTS: 'character/allocateAttributePoints' as const,
  LEVEL_UP_CHARACTER_SKILL: 'character/levelUpSkill' as const
};
