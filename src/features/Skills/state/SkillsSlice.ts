/**
 * Redux slice for Skills state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  SkillsState,
  Skill,
  GainSkillExperiencePayload,
  SetSkillLevelPayload,
  UnlockSkillPayload,
  SetActiveSkillPayload,
  UnlockSkillAbilityPayload,
  ToggleFavoriteSkillPayload,
  InitializeSkillsPayload,
  RewardSkillPointsPayload,
  SpendSkillPointsPayload,
  SetExperienceMultiplierPayload,
  SkillCategory,
  SkillProficiency,
  SkillLogEntry
} from './SkillsTypes';

import {
  trainSkill,
  checkSkillRequirements
} from './SkillsThunks';

/**
 * Calculate experience needed for a specific level
 */
export const calculateExperienceForLevel = (level: number): number => {
  // Level 1 requires 0 experience
  if (level <= 1) return 0;
  
  // Exponential curve: each level requires more experience than the last
  // Base value is 100 experience for level 2
  return Math.floor(100 * Math.pow(level - 1, 1.5));
};

/**
 * Calculate the proficiency level based on skill level
 */
export const calculateProficiency = (level: number): SkillProficiency => {
  if (level < 1) return SkillProficiency.LOCKED;
  if (level < 20) return SkillProficiency.BEGINNER;
  if (level < 40) return SkillProficiency.APPRENTICE;
  if (level < 60) return SkillProficiency.ADEPT;
  if (level < 80) return SkillProficiency.EXPERT;
  return SkillProficiency.MASTER;
};

/**
 * Create a skill log entry
 */
const createSkillLogEntry = (
  skillId: string, 
  type: 'levelUp' | 'experienceGain' | 'abilityUnlock' | 'proficiencyChange',
  data: any
): SkillLogEntry => ({
  id: uuidv4(),
  skillId,
  timestamp: Date.now(),
  type,
  data,
  seen: false
});

/**
 * Initial state for skills
 */
const initialState: SkillsState = {
  skills: {},
  activeSkillId: null,
  skillPoints: 0,
  skillLog: [],
  experienceMultiplier: 1.0,
  globalCooldown: 0,
  error: null,
  isLoading: false,
  favoriteSkillIds: [],
  selectedSkillId: null
};

/**
 * Skills slice with reducers
 */
const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    /**
     * Initialize skills with data
     */
    initializeSkills(state, action: PayloadAction<InitializeSkillsPayload>) {
      const { skills, skillPoints } = action.payload;
      
      // Set skills data
      state.skills = skills;
      
      // Set skill points if provided
      if (skillPoints !== undefined) {
        state.skillPoints = skillPoints;
      }
    },
    
    /**
     * Add a new skill
     */
    addSkill(state, action: PayloadAction<Skill>) {
      const skill = action.payload;
      
      // Add to skills collection
      state.skills[skill.id] = skill;
    },
    
    /**
     * Update a skill's properties
     */
    updateSkill(state, action: PayloadAction<Partial<Skill> & { id: string }>) {
      const { id, ...updates } = action.payload;
      
      if (state.skills[id]) {
        state.skills[id] = {
          ...state.skills[id],
          ...updates
        };
      }
    },
    
    /**
     * Gain experience for a skill
     */
    gainSkillExperience(state, action: PayloadAction<GainSkillExperiencePayload>) {
      const { skillId, amount, source } = action.payload;
      const skill = state.skills[skillId];
      
      if (!skill || skill.locked) {
        return;
      }
      
      // Apply experience multiplier
      const adjustedAmount = amount * state.experienceMultiplier;
      
      // Add experience
      const previousExperience = skill.experience;
      const previousLevel = skill.level;
      const previousProficiency = skill.proficiency;
      
      skill.experience += adjustedAmount;
      
      // Check for level ups
      const newLevel = Math.floor(1 + Math.sqrt(skill.experience / 100));
      
      if (newLevel > skill.level) {
        // Level up!
        skill.level = Math.min(newLevel, skill.maxLevel);
        
        // Update next level experience
        skill.nextLevelExperience = calculateExperienceForLevel(skill.level + 1);
        
        // Check for proficiency change
        const newProficiency = calculateProficiency(skill.level);
        if (newProficiency !== skill.proficiency) {
          skill.proficiency = newProficiency;
          
          // Log proficiency change
          state.skillLog.push(createSkillLogEntry(
            skillId,
            'proficiencyChange',
            {
              previousValue: previousProficiency,
              newValue: newProficiency,
              source
            }
          ));
        }
        
        // Check for ability unlocks
        if (skill.abilities) {
          skill.abilities.forEach(ability => {
            if (!ability.unlocked && ability.unlockLevel <= skill.level) {
              ability.unlocked = true;
              
              // Log ability unlock
              state.skillLog.push(createSkillLogEntry(
                skillId,
                'abilityUnlock',
                {
                  abilityId: ability.id,
                  newValue: ability.unlockLevel,
                  source
                }
              ));
            }
          });
        }
        
        // Log level up
        state.skillLog.push(createSkillLogEntry(
          skillId,
          'levelUp',
          {
            previousValue: previousLevel,
            newValue: skill.level,
            change: skill.level - previousLevel,
            source
          }
        ));
      }
      
      // Log experience gain
      state.skillLog.push(createSkillLogEntry(
        skillId,
        'experienceGain',
        {
          previousValue: previousExperience,
          newValue: skill.experience,
          change: adjustedAmount,
          source
        }
      ));
    },
    
    /**
     * Set a skill's level directly
     */
    setSkillLevel(state, action: PayloadAction<SetSkillLevelPayload>) {
      const { skillId, level } = action.payload;
      const skill = state.skills[skillId];
      
      if (!skill) {
        return;
      }
      
      // Set new level
      const previousLevel = skill.level;
      skill.level = Math.min(level, skill.maxLevel);
      
      // Calculate and set appropriate experience
      skill.experience = calculateExperienceForLevel(skill.level);
      
      // Update next level experience
      skill.nextLevelExperience = calculateExperienceForLevel(skill.level + 1);
      
      // Update proficiency
      const previousProficiency = skill.proficiency;
      const newProficiency = calculateProficiency(skill.level);
      
      if (newProficiency !== skill.proficiency) {
        skill.proficiency = newProficiency;
        
        // Log proficiency change
        state.skillLog.push(createSkillLogEntry(
          skillId,
          'proficiencyChange',
          {
            previousValue: previousProficiency,
            newValue: newProficiency
          }
        ));
      }
      
      // Check and update ability unlocks
      if (skill.abilities) {
        skill.abilities.forEach(ability => {
          ability.unlocked = ability.unlockLevel <= skill.level;
          
          // Only log newly unlocked abilities
          if (ability.unlocked && ability.unlockLevel > previousLevel) {
            state.skillLog.push(createSkillLogEntry(
              skillId,
              'abilityUnlock',
              {
                abilityId: ability.id,
                newValue: ability.unlockLevel
              }
            ));
          }
        });
      }
      
      // Log level change
      state.skillLog.push(createSkillLogEntry(
        skillId,
        'levelUp',
        {
          previousValue: previousLevel,
          newValue: skill.level,
          change: skill.level - previousLevel
        }
      ));
    },
    
    /**
     * Unlock a skill
     */
    unlockSkill(state, action: PayloadAction<UnlockSkillPayload>) {
      const { skillId } = action.payload;
      const skill = state.skills[skillId];
      
      if (!skill) {
        return;
      }
      
      // Set to unlocked
      skill.locked = false;
      
      // Initialize skill if it's at level 0
      if (skill.level < 1) {
        skill.level = 1;
        skill.experience = 0;
        skill.nextLevelExperience = calculateExperienceForLevel(2);
        skill.proficiency = SkillProficiency.BEGINNER;
      }
    },
    
    /**
     * Set active skill for training
     */
    setActiveSkill(state, action: PayloadAction<SetActiveSkillPayload>) {
      state.activeSkillId = action.payload.skillId;
    },
    
    /**
     * Unlock a skill ability
     */
    unlockSkillAbility(state, action: PayloadAction<UnlockSkillAbilityPayload>) {
      const { skillId, abilityId } = action.payload;
      const skill = state.skills[skillId];
      
      if (!skill || !skill.abilities) {
        return;
      }
      
      const ability = skill.abilities.find(a => a.id === abilityId);
      
      if (!ability) {
        return;
      }
      
      // Unlock the ability
      ability.unlocked = true;
      
      // Log ability unlock
      state.skillLog.push(createSkillLogEntry(
        skillId,
        'abilityUnlock',
        {
          abilityId,
          newValue: ability.unlockLevel
        }
      ));
    },
    
    /**
     * Toggle a skill as favorite
     */
    toggleFavoriteSkill(state, action: PayloadAction<ToggleFavoriteSkillPayload>) {
      const { skillId } = action.payload;
      
      if (state.favoriteSkillIds.includes(skillId)) {
        // Remove from favorites
        state.favoriteSkillIds = state.favoriteSkillIds.filter(id => id !== skillId);
      } else {
        // Add to favorites
        state.favoriteSkillIds.push(skillId);
      }
    },
    
    /**
     * Reward skill points
     */
    rewardSkillPoints(state, action: PayloadAction<RewardSkillPointsPayload>) {
      const { amount } = action.payload;
      
      if (amount > 0) {
        state.skillPoints += amount;
      }
    },
    
    /**
     * Spend skill points to improve a skill
     */
    spendSkillPoints(state, action: PayloadAction<SpendSkillPointsPayload>) {
      const { skillId, amount } = action.payload;
      const skill = state.skills[skillId];
      
      if (!skill || state.skillPoints < amount || amount <= 0) {
        return;
      }
      
      // Spend points
      state.skillPoints -= amount;
      
      // Improve skill (each point gives some experience)
      const experiencePerPoint = 50; // Base value for experience from skill points
      const totalExperience = amount * experiencePerPoint;
      
      const previousLevel = skill.level;
      const previousExperience = skill.experience;
      
      skill.experience += totalExperience;
      
      // Update level and proficiency
      const newLevel = Math.floor(1 + Math.sqrt(skill.experience / 100));
      
      if (newLevel > skill.level) {
        // Level up!
        skill.level = Math.min(newLevel, skill.maxLevel);
        
        // Update next level experience
        skill.nextLevelExperience = calculateExperienceForLevel(skill.level + 1);
        
        // Check for proficiency change
        const newProficiency = calculateProficiency(skill.level);
        if (newProficiency !== skill.proficiency) {
          skill.proficiency = newProficiency;
          
          // Log proficiency change
          state.skillLog.push(createSkillLogEntry(
            skillId,
            'proficiencyChange',
            {
              previousValue: skill.proficiency,
              newValue: newProficiency,
              source: 'skillPoints'
            }
          ));
        }
        
        // Log level up
        state.skillLog.push(createSkillLogEntry(
          skillId,
          'levelUp',
          {
            previousValue: previousLevel,
            newValue: skill.level,
            change: skill.level - previousLevel,
            source: 'skillPoints'
          }
        ));
      }
      
      // Log experience gain
      state.skillLog.push(createSkillLogEntry(
        skillId,
        'experienceGain',
        {
          previousValue: previousExperience,
          newValue: skill.experience,
          change: totalExperience,
          source: 'skillPoints'
        }
      ));
    },
    
    /**
     * Set experience multiplier
     */
    setExperienceMultiplier(state, action: PayloadAction<SetExperienceMultiplierPayload>) {
      const { value } = action.payload;
      
      // Ensure the multiplier is at least 0.1
      state.experienceMultiplier = Math.max(0.1, value);
    },
    
    /**
     * Select a skill in the UI
     */
    selectSkill(state, action: PayloadAction<string | null>) {
      state.selectedSkillId = action.payload;
    },
    
    /**
     * Mark skill log entries as seen
     */
    markSkillLogEntriesSeen(state, action: PayloadAction<string[]>) {
      const entryIds = action.payload;
      
      state.skillLog = state.skillLog.map(entry => 
        entryIds.includes(entry.id) ? { ...entry, seen: true } : entry
      );
    },
    
    /**
     * Clear error
     */
    clearError(state) {
      state.error = null;
    },
    
    /**
     * Reset skills to initial state
     */
    resetSkills() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Handle trainSkill thunk
    builder.addCase(trainSkill.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(trainSkill.fulfilled, (state, action) => {
      state.isLoading = false;
      
      if (action.payload.success) {
        // Training handled in the thunk
      }
    });
    builder.addCase(trainSkill.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to train skill';
    });
    
    // Handle checkSkillRequirements thunk
    builder.addCase(checkSkillRequirements.fulfilled, (state, action) => {
      // Check requirements handled in thunk
      // We could update UI state here if needed
    });
  }
});

// Export actions
export const {
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
} = skillsSlice.actions;

// Export reducer
export default skillsSlice.reducer;
