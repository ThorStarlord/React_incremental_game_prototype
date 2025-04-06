/**
 * Redux selectors for Skills state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { 
  SkillsState, 
  Skill, 
  SkillCategory,
  SkillProficiency,
  SkillAbility,
  SkillLogEntry
} from './SkillsTypes';

// Basic selectors
export const selectSkillsState = (state: RootState) => state.skills;
export const selectAllSkills = (state: RootState) => state.skills.skills;
export const selectSkillPoints = (state: RootState) => state.skills.skillPoints;
export const selectActiveSkillId = (state: RootState) => state.skills.activeSkillId;
export const selectSkillLog = (state: RootState) => state.skills.skillLog;
export const selectExperienceMultiplier = (state: RootState) => state.skills.experienceMultiplier;
export const selectGlobalCooldown = (state: RootState) => state.skills.globalCooldown;
export const selectFavoriteSkillIds = (state: RootState) => state.skills.favoriteSkillIds;
export const selectSelectedSkillId = (state: RootState) => state.skills.selectedSkillId;
export const selectSkillsError = (state: RootState) => state.skills.error;
export const selectSkillsLoading = (state: RootState) => state.skills.isLoading;

// Derived selectors
export const selectSkillById = (skillId: string) => 
  createSelector(
    [selectAllSkills],
    (skills) => skills[skillId] || null
  );

export const selectActiveSkill = createSelector(
  [selectAllSkills, selectActiveSkillId],
  (skills, activeId) => activeId ? skills[activeId] : null
);

export const selectSelectedSkill = createSelector(
  [selectAllSkills, selectSelectedSkillId],
  (skills, selectedId) => selectedId ? skills[selectedId] : null
);

export const selectFavoriteSkills = createSelector(
  [selectAllSkills, selectFavoriteSkillIds],
  (skills, favoriteIds) => favoriteIds.map(id => skills[id]).filter(Boolean)
);

export const selectSkillsByCategory = (category: SkillCategory) => 
  createSelector(
    [selectAllSkills],
    (skills) => Object.values(skills).filter(skill => skill.category === category)
  );

export const selectCombatSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.category === SkillCategory.COMBAT)
);

export const selectMagicSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.category === SkillCategory.MAGIC)
);

export const selectCraftingSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.category === SkillCategory.CRAFTING)
);

export const selectGatheringSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.category === SkillCategory.GATHERING)
);

export const selectSocialSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.category === SkillCategory.SOCIAL)
);

export const selectUnlockedSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => !skill.locked)
);

export const selectLockedSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.locked)
);

export const selectSkillsByProficiency = (proficiency: SkillProficiency) => 
  createSelector(
    [selectAllSkills],
    (skills) => Object.values(skills).filter(skill => skill.proficiency === proficiency)
  );

export const selectSkillLogBySkill = (skillId: string) => 
  createSelector(
    [selectSkillLog],
    (log) => log.filter(entry => entry.skillId === skillId)
  );

export const selectUnseenSkillLogEntries = createSelector(
  [selectSkillLog],
  (log) => log.filter(entry => !entry.seen)
);

export const selectSkillsWithUnlockedAbilities = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => 
    skill.abilities?.some(ability => ability.unlocked)
  )
);

export const selectSkillAbilities = (skillId: string) => 
  createSelector(
    [selectSkillById(skillId)],
    (skill) => skill?.abilities || []
  );

export const selectUnlockedSkillAbilities = (skillId: string) => 
  createSelector(
    [selectSkillAbilities(skillId)],
    (abilities) => abilities.filter(ability => ability.unlocked)
  );

export const selectActiveSkillAbilities = createSelector(
  [selectActiveSkill],
  (skill) => skill?.abilities?.filter(ability => ability.unlocked) || []
);

export const selectTrainableSkills = createSelector(
  [selectAllSkills],
  (skills) => Object.values(skills).filter(skill => skill.canTrain)
);

export const selectSkillAbilitiesBySkillType = (type: string) => 
  createSelector(
    [selectAllSkills],
    (skills) => {
      const abilitiesByType: SkillAbility[] = [];
      
      Object.values(skills).forEach(skill => {
        if (skill.type === type && skill.abilities) {
          abilitiesByType.push(...skill.abilities.filter(ability => ability.unlocked));
        }
      });
      
      return abilitiesByType;
    }
  );

export const selectSkillsProgress = createSelector(
  [selectAllSkills],
  (skills) => {
    const total = Object.values(skills).length;
    const unlocked = Object.values(skills).filter(skill => !skill.locked).length;
    
    const categoryCounts: Record<SkillCategory, { total: number; unlocked: number }> = {
      [SkillCategory.COMBAT]: { total: 0, unlocked: 0 },
      [SkillCategory.MAGIC]: { total: 0, unlocked: 0 },
      [SkillCategory.CRAFTING]: { total: 0, unlocked: 0 },
      [SkillCategory.GATHERING]: { total: 0, unlocked: 0 },
      [SkillCategory.SOCIAL]: { total: 0, unlocked: 0 }
    };
    
    Object.values(skills).forEach(skill => {
      categoryCounts[skill.category].total++;
      if (!skill.locked) {
        categoryCounts[skill.category].unlocked++;
      }
    });
    
    return {
      overall: {
        total,
        unlocked,
        percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0
      },
      byCategory: categoryCounts
    };
  }
);

export const selectSkillsProficiencyDistribution = createSelector(
  [selectAllSkills],
  (skills) => {
    const counts: Record<SkillProficiency, number> = {
      [SkillProficiency.LOCKED]: 0,
      [SkillProficiency.BEGINNER]: 0,
      [SkillProficiency.APPRENTICE]: 0,
      [SkillProficiency.ADEPT]: 0,
      [SkillProficiency.EXPERT]: 0,
      [SkillProficiency.MASTER]: 0
    };
    
    Object.values(skills).forEach(skill => {
      counts[skill.proficiency]++;
    });
    
    return counts;
  }
);

export const selectRecentSkillLogEntries = (count = 5) => 
  createSelector(
    [selectSkillLog],
    (log) => [...log].sort((a, b) => b.timestamp - a.timestamp).slice(0, count)
  );

export const selectHasAvailableSkillPoints = createSelector(
  [selectSkillPoints],
  (points) => points > 0
);

export const selectTotalSkillLevels = createSelector(
  [selectAllSkills],
  (skills) => {
    return Object.values(skills).reduce((sum, skill) => {
      return sum + (skill.locked ? 0 : skill.level);
    }, 0);
  }
);

export const selectAverageSkillLevel = createSelector(
  [selectUnlockedSkills],
  (skills) => {
    if (skills.length === 0) return 0;
    
    const totalLevels = skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round((totalLevels / skills.length) * 10) / 10; // Round to 1 decimal place
  }
);

export const selectHighestSkill = createSelector(
  [selectUnlockedSkills],
  (skills) => {
    if (skills.length === 0) return null;
    return skills.reduce((highest, skill) => 
      skill.level > highest.level ? skill : highest, skills[0]
    );
  }
);

export const selectSkillsAtMaxLevel = createSelector(
  [selectUnlockedSkills],
  (skills) => skills.filter(skill => skill.level >= skill.maxLevel)
);

export const selectSkillTrainers = (skillId: string) => 
  createSelector(
    [selectSkillById(skillId)],
    (skill) => skill?.trainers || []
  );

export const selectRelatedSkills = (skillId: string) => 
  createSelector(
    [selectAllSkills, selectSkillById(skillId)],
    (skills, skill) => {
      if (!skill || !skill.relatedSkills) return [];
      return skill.relatedSkills
        .map(id => skills[id])
        .filter(Boolean);
    }
  );
