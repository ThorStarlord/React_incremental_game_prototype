/**
 * Skills feature exports
 *
 * This file serves as the public API for the Skills feature,
 * exporting components, hooks, and utilities.
 */

// Export slice actions
export {
  initializeSkills,
  addSkill,
  updateSkill,
  gainSkillExperience,
  setSkillLevel,
  unlockSkill,
  setActiveSkill,
  unlockSkillAbility,
  toggleFavoriteSkill,
  rewardSkillPoints,
  spendSkillPoints,
  setExperienceMultiplier,
  selectSkill,
  markSkillLogEntriesSeen,
  clearError,
  resetSkills
} from './state/SkillsSlice';

// Export thunks
export {
  trainSkill,
  useSkillItem,
  checkSkillRequirements,
  gatherSkillExperience,
  learnNewSkill,
  applySkillBonus,
  allocateSkillPoints,
  grantSkillPoints
} from './state/SkillsThunks';

// Export selectors
export {
  selectSkillsState,
  selectAllSkills,
  selectSkillPoints,
  selectActiveSkillId,
  selectSkillLog,
  selectExperienceMultiplier,
  selectSkillById,
  selectActiveSkill,
  selectSelectedSkill,
  selectFavoriteSkills,
  selectSkillsByCategory,
  selectCombatSkills,
  selectMagicSkills,
  selectCraftingSkills,
  selectGatheringSkills,
  selectSocialSkills,
  selectUnlockedSkills,
  selectLockedSkills,
  selectSkillsByProficiency,
  selectUnseenSkillLogEntries,
  selectSkillsWithUnlockedAbilities,
  selectHasAvailableSkillPoints,
  selectTotalSkillLevels,
  selectAverageSkillLevel,
  selectHighestSkill
} from './state/SkillsSelectors';

// Export types
export type {
  Skill,
  SkillAbility,
  SkillCategory,
  SkillEffect,
  SkillLogEntry,
  SkillProficiency,
  SkillRequirement,
  SkillReward,
  SkillsState,
  SkillType
} from './state/SkillsTypes';

// Export utils
export {
  calculateExperienceForLevel,
  calculateProficiency
} from './state/SkillsSlice';

// Export the reducer
export { default as skillsReducer } from './state/SkillsSlice';
