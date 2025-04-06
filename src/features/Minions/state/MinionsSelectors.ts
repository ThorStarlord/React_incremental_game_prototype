/**
 * Redux selectors for Minions state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { Minion, MinionTask, MinionsState } from './MinionsTypes';

// Basic selectors
export const selectMinionsState = (state: RootState) => state.minions;
export const selectAllMinions = (state: RootState) => state.minions.minions;
export const selectAllTasks = (state: RootState) => state.minions.availableTasks;
export const selectAllUpgrades = (state: RootState) => state.minions.upgrades;
export const selectAllTraits = (state: RootState) => state.minions.traits;
export const selectAllSpecializations = (state: RootState) => state.minions.specializations;
export const selectMinionConfig = (state: RootState) => state.minions.config;
export const selectSimulationState = (state: RootState) => state.minions.simulation;
export const selectSelectedMinionId = (state: RootState) => state.minions.selectedMinionId;
export const selectMaxMinionSlots = (state: RootState) => state.minions.maxMinionSlots;
export const selectUnlockedMinionSlots = (state: RootState) => state.minions.unlockedMinionSlots;
export const selectNextSlotCost = (state: RootState) => state.minions.nextSlotCost;
export const selectMinionsError = (state: RootState) => state.minions.error;
export const selectIsMinionsLoading = (state: RootState) => state.minions.isLoading;

// Derived selectors
export const selectMinionsAsArray = createSelector(
  [selectAllMinions],
  (minions) => Object.values(minions)
);

export const selectUnlockedMinionsCount = createSelector(
  [selectMinionsAsArray],
  (minions) => minions.filter(minion => minion.unlocked).length
);

export const selectSelectedMinion = createSelector(
  [selectAllMinions, selectSelectedMinionId],
  (minions, selectedId) => selectedId ? minions[selectedId] : null
);

export const selectAvailableTasksForMinion = createSelector(
  [selectAllTasks, (_, minionId) => minionId, selectAllMinions],
  (tasks, minionId, minions) => {
    const minion = minions[minionId];
    if (!minion) return [];
    
    return tasks.filter(task => 
      task.unlocked && 
      minion.level >= task.requiredLevel &&
      (!task.requirements.specialization || 
        !minion.specialization || 
        task.requirements.specialization.includes(minion.specialization))
    );
  }
);

export const selectCompletedTasks = createSelector(
  [selectMinionsAsArray],
  (minions) => minions.filter(
    minion => minion.assignment && minion.assignment.completed
  ).map(minion => minion.assignment)
);

export const selectIdleMinions = createSelector(
  [selectMinionsAsArray],
  (minions) => minions.filter(
    minion => minion.unlocked && !minion.assignment
  )
);

export const selectWorkingMinions = createSelector(
  [selectMinionsAsArray],
  (minions) => minions.filter(
    minion => minion.unlocked && minion.assignment && !minion.assignment.completed
  )
);

export const selectMinionsByTask = createSelector(
  [selectMinionsAsArray, (_, taskId) => taskId],
  (minions, taskId) => minions.filter(
    minion => minion.assignment && minion.assignment.taskId === taskId
  )
);

export const selectMinionsBySpecialization = createSelector(
  [selectMinionsAsArray, (_, spec) => spec],
  (minions, specialization) => minions.filter(
    minion => minion.specialization === specialization
  )
);

export const selectMinionsByTrait = createSelector(
  [selectMinionsAsArray, (_, traitId) => traitId],
  (minions, traitId) => minions.filter(
    minion => minion.traits && minion.traits.includes(traitId)
  )
);

export const selectMinionsByLevel = createSelector(
  [selectMinionsAsArray, (_, minLevel, maxLevel) => ({ minLevel, maxLevel })],
  (minions, { minLevel, maxLevel }) => minions.filter(
    minion => minion.level >= minLevel && (!maxLevel || minion.level <= maxLevel)
  )
);

export const selectMinionsByRarity = createSelector(
  [selectMinionsAsArray, (_, rarity) => rarity],
  (minions, rarity) => minions.filter(
    minion => minion.rarity === rarity
  )
);

export const selectHighestLevelMinion = createSelector(
  [selectMinionsAsArray],
  (minions) => {
    if (minions.length === 0) return null;
    return minions.reduce((highest, current) => 
      current.level > highest.level ? current : highest
    );
  }
);

export const selectLowestFatigueMinion = createSelector(
  [selectMinionsAsArray],
  (minions) => {
    const availableMinions = minions.filter(m => m.unlocked && !m.assignment);
    if (availableMinions.length === 0) return null;
    
    return availableMinions.reduce((lowest, current) => 
      current.fatigue < lowest.fatigue ? current : lowest
    );
  }
);

export const selectBestMinionForTask = createSelector(
  [selectAllMinions, selectAllTasks, (_, taskId) => taskId],
  (minions, tasks, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    const availableMinions = Object.values(minions).filter(
      m => m.unlocked && !m.assignment && m.level >= task.requiredLevel
    );
    
    if (availableMinions.length === 0) return null;
    
    // Score each minion for the task
    return availableMinions.reduce((best, current) => {
      // Simple scoring based on stats required by task
      let currentScore = current.level;
      let bestScore = best.level;
      
      if (task.requirements.stats) {
        Object.entries(task.requirements.stats).forEach(([stat, value]) => {
          if (value !== undefined) {
            currentScore += (current.stats[stat] || 0) - value;
            bestScore += (best.stats[stat] || 0) - value;
          }
        });
      }
      
      // Specialization bonus
      if (task.requirements.specialization && current.specialization) {
        if (task.requirements.specialization.includes(current.specialization)) {
          currentScore += 10;
        }
      }
      
      if (task.requirements.specialization && best.specialization) {
        if (task.requirements.specialization.includes(best.specialization)) {
          bestScore += 10;
        }
      }
      
      // Fatigue penalty
      currentScore -= current.fatigue * 0.1;
      bestScore -= best.fatigue * 0.1;
      
      return currentScore > bestScore ? current : best;
    });
  }
);

export const selectTaskProgress = createSelector(
  [selectAllMinions, (_, minionId) => minionId],
  (minions, minionId) => {
    const minion = minions[minionId];
    if (!minion || !minion.assignment) return 0;
    return minion.assignment.progress || 0;
  }
);

export const selectMinionFatigueRate = createSelector(
  [selectAllMinions, (_, minionId) => minionId],
  (minions, minionId) => {
    const minion = minions[minionId];
    if (!minion) return 0;
    
    // Base fatigue rate
    let rate = 1;
    
    // Adjust based on stamina
    rate *= (10 / (minion.stats.stamina || 5));
    
    // Adjust based on traits
    if (minion.traits) {
      // Example trait effects on fatigue rate would be applied here
    }
    
    return rate;
  }
);

export const selectMinionExperienceToNextLevel = createSelector(
  [selectAllMinions, (_, minionId) => minionId],
  (minions, minionId) => {
    const minion = minions[minionId];
    if (!minion) return 0;
    
    const currentExp = minion.experience;
    const currentLevel = minion.level;
    const expForNextLevel = Math.floor(100 * Math.pow(currentLevel, 1.5));
    
    return {
      current: currentExp,
      required: expForNextLevel,
      percentage: Math.min(100, (currentExp / expForNextLevel) * 100)
    };
  }
);

export const selectHasAvailableMinionsForTask = createSelector(
  [selectAllMinions, selectAllTasks, (_, taskId) => taskId],
  (minions, tasks, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    return Object.values(minions).some(
      m => m.unlocked && !m.assignment && m.level >= task.requiredLevel
    );
  }
);

export const selectTaskRequirementsMet = createSelector(
  [selectAllMinions, selectAllTasks, (_, minionId, taskId) => ({ minionId, taskId })],
  (minions, tasks, { minionId, taskId }) => {
    const minion = minions[minionId];
    const task = tasks.find(t => t.id === taskId);
    
    if (!minion || !task) return false;
    
    // Check level requirement
    if (minion.level < task.requiredLevel) return false;
    
    // Check stat requirements
    if (task.requirements.stats) {
      for (const [stat, value] of Object.entries(task.requirements.stats)) {
        if (value !== undefined && (minion.stats[stat] || 0) < value) {
          return false;
        }
      }
    }
    
    // Check specialization requirements
    if (task.requirements.specialization && task.requirements.specialization.length > 0) {
      if (!minion.specialization || !task.requirements.specialization.includes(minion.specialization)) {
        return false;
      }
    }
    
    // Check ability requirements
    if (task.requirements.abilities && task.requirements.abilities.length > 0) {
      const hasRequiredAbilities = task.requirements.abilities.every(
        reqAbility => minion.abilities.some(ability => ability.id === reqAbility)
      );
      
      if (!hasRequiredAbilities) return false;
    }
    
    return true;
  }
);

export const selectTasksByType = createSelector(
  [selectAllTasks, (_, type) => type],
  (tasks, type) => tasks.filter(task => task.id.includes(type))
);

export const selectFatigueRecoveryTime = createSelector(
  [selectAllMinions, (_, minionId) => minionId],
  (minions, minionId) => {
    const minion = minions[minionId];
    if (!minion) return 0;
    
    const currentFatigue = minion.fatigue;
    const recoveryRate = minion.recoveryRate || 5; // 5% per minute by default
    
    // Calculate minutes to full recovery
    return Math.ceil((currentFatigue / recoveryRate) * 60);
  }
);

export const selectMinionSlotsStats = createSelector(
  [selectUnlockedMinionSlots, selectMaxMinionSlots, selectUnlockedMinionsCount],
  (unlockedSlots, maxSlots, minionsCount) => ({
    unlockedSlots,
    maxSlots,
    usedSlots: minionsCount,
    availableSlots: unlockedSlots - minionsCount,
    percentage: (minionsCount / unlockedSlots) * 100
  })
);
