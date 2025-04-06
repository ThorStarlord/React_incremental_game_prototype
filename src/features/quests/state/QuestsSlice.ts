/**
 * Redux slice for Quests state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  QuestsState,
  Quest,
  QuestObjective,
  QuestStatus,
  StartQuestPayload,
  CompleteQuestPayload,
  AbandonQuestPayload,
  FailQuestPayload,
  UpdateQuestObjectivePayload,
  TrackQuestPayload,
  AddQuestLogEntryPayload,
  UnlockQuestPayload,
  QuestLogEntry
} from './QuestsTypes';

import {
  startQuest,
  completeQuest,
  abandonQuest,
  processQuestEvent,
  checkQuestRequirements
} from './QuestsThunks';

/**
 * Initial state for quests
 */
const initialState: QuestsState = {
  quests: {},
  activeQuestIds: [],
  completedQuestIds: [],
  failedQuestIds: [],
  availableQuestIds: [],
  questProgress: {},
  questLog: [],
  dailyReset: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
  weeklyReset: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  trackedQuestId: null,
  selectedQuestId: null,
  error: null,
  isLoading: false
};

/**
 * Calculate quest progress percentage
 */
const calculateQuestProgress = (quest: Quest): number => {
  if (!quest.objectives.length) return 0;

  const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
  return Math.floor((completedObjectives / quest.objectives.length) * 100);
};

/**
 * Create a quest log entry
 */
const createLogEntry = (
  questId: string,
  message: string,
  type: 'start' | 'progress' | 'complete' | 'fail'
): QuestLogEntry => ({
  id: uuidv4(),
  timestamp: Date.now(),
  message,
  questId,
  type,
  read: false
});

/**
 * Quests slice with reducers
 */
const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    /**
     * Initialize quests data
     */
    initializeQuests(state, action: PayloadAction<Partial<QuestsState>>) {
      return { ...state, ...action.payload };
    },
    
    /**
     * Add a new quest to the available quests
     */
    addQuest(state, action: PayloadAction<Quest>) {
      const quest = action.payload;
      
      // Add to quests collection
      state.quests[quest.id] = {
        ...quest,
        status: QuestStatus.AVAILABLE
      };
      
      // Add to available quests if not already there
      if (!state.availableQuestIds.includes(quest.id)) {
        state.availableQuestIds.push(quest.id);
      }
    },
    
    /**
     * Manually start a quest
     */
    manuallyStartQuest(state, action: PayloadAction<StartQuestPayload>) {
      const { questId } = action.payload;
      const quest = state.quests[questId];
      
      if (!quest) {
        state.error = `Quest with ID ${questId} not found`;
        return;
      }
      
      // If quest is already active, do nothing
      if (state.activeQuestIds.includes(questId)) {
        return;
      }
      
      // Update quest status
      state.quests[questId].status = QuestStatus.ACTIVE;
      state.quests[questId].startedAt = Date.now();
      
      // Move from available to active
      state.availableQuestIds = state.availableQuestIds.filter(id => id !== questId);
      state.activeQuestIds.push(questId);
      
      // Initialize progress tracking
      state.questProgress[questId] = {
        startedAt: Date.now(),
        objectiveProgress: {}
      };
      
      // Reset objectives if the quest was previously completed or failed
      state.quests[questId].objectives = state.quests[questId].objectives.map(obj => ({
        ...obj,
        current: 0,
        completed: false
      }));
      
      // Add log entry
      state.questLog.push(createLogEntry(
        questId,
        `Started quest: ${quest.title}`,
        'start'
      ));
    },
    
    /**
     * Manually complete a quest
     */
    manuallyCompleteQuest(state, action: PayloadAction<CompleteQuestPayload>) {
      const { questId } = action.payload;
      const quest = state.quests[questId];
      
      if (!quest) {
        state.error = `Quest with ID ${questId} not found`;
        return;
      }
      
      // If quest is not active or already completed, do nothing
      if (!state.activeQuestIds.includes(questId) || state.completedQuestIds.includes(questId)) {
        return;
      }
      
      // Update quest status
      state.quests[questId].status = QuestStatus.COMPLETED;
      
      // Move from active to completed
      state.activeQuestIds = state.activeQuestIds.filter(id => id !== questId);
      state.completedQuestIds.push(questId);
      
      // Update progress tracking
      if (state.questProgress[questId]) {
        state.questProgress[questId].completedAt = Date.now();
      }
      
      // If this quest was being tracked, clear tracking
      if (state.trackedQuestId === questId) {
        state.trackedQuestId = null;
      }
      
      // Add log entry
      state.questLog.push(createLogEntry(
        questId,
        `Completed quest: ${quest.title}`,
        'complete'
      ));
      
      // Unlock quests that this quest unlocks
      if (quest.unlocks && quest.unlocks.length > 0) {
        quest.unlocks.forEach(unlockQuestId => {
          const unlockQuest = state.quests[unlockQuestId];
          if (unlockQuest && !state.availableQuestIds.includes(unlockQuestId)) {
            state.availableQuestIds.push(unlockQuestId);
            state.quests[unlockQuestId].status = QuestStatus.AVAILABLE;
          }
        });
      }
    },
    
    /**
     * Manually abandon a quest
     */
    manuallyAbandonQuest(state, action: PayloadAction<AbandonQuestPayload>) {
      const { questId } = action.payload;
      const quest = state.quests[questId];
      
      if (!quest) {
        state.error = `Quest with ID ${questId} not found`;
        return;
      }
      
      // If quest is not active, do nothing
      if (!state.activeQuestIds.includes(questId)) {
        return;
      }
      
      // Update quest status
      state.quests[questId].status = QuestStatus.AVAILABLE;
      
      // Move from active back to available (for non-story quests)
      state.activeQuestIds = state.activeQuestIds.filter(id => id !== questId);
      if (!quest.isStory && !state.availableQuestIds.includes(questId)) {
        state.availableQuestIds.push(questId);
      }
      
      // Clean up progress tracking
      delete state.questProgress[questId];
      
      // If this quest was being tracked, clear tracking
      if (state.trackedQuestId === questId) {
        state.trackedQuestId = null;
      }
      
      // Add log entry
      state.questLog.push(createLogEntry(
        questId,
        `Abandoned quest: ${quest.title}`,
        'fail'
      ));
    },
    
    /**
     * Manually fail a quest
     */
    manuallyFailQuest(state, action: PayloadAction<FailQuestPayload>) {
      const { questId, reason } = action.payload;
      const quest = state.quests[questId];
      
      if (!quest) {
        state.error = `Quest with ID ${questId} not found`;
        return;
      }
      
      // If quest is not active, do nothing
      if (!state.activeQuestIds.includes(questId)) {
        return;
      }
      
      // Update quest status
      state.quests[questId].status = QuestStatus.FAILED;
      
      // Move from active to failed
      state.activeQuestIds = state.activeQuestIds.filter(id => id !== questId);
      state.failedQuestIds.push(questId);
      
      // If this quest was being tracked, clear tracking
      if (state.trackedQuestId === questId) {
        state.trackedQuestId = null;
      }
      
      // Add log entry
      state.questLog.push(createLogEntry(
        questId,
        `Failed quest: ${quest.title}${reason ? ` - ${reason}` : ''}`,
        'fail'
      ));
      
      // If quest is repeatable, move it back to available
      if (quest.isRepeatable && !state.availableQuestIds.includes(questId)) {
        state.availableQuestIds.push(questId);
        state.quests[questId].status = QuestStatus.AVAILABLE;
      }
    },
    
    /**
     * Update quest objective progress
     */
    updateObjectiveProgress(state, action: PayloadAction<UpdateQuestObjectivePayload>) {
      const { questId, objectiveId, progress } = action.payload;
      const quest = state.quests[questId];
      
      if (!quest) {
        state.error = `Quest with ID ${questId} not found`;
        return;
      }
      
      // If quest is not active, do nothing
      if (!state.activeQuestIds.includes(questId)) {
        return;
      }
      
      // Find the objective
      const objectiveIndex = quest.objectives.findIndex(obj => obj.id === objectiveId);
      if (objectiveIndex === -1) {
        state.error = `Objective with ID ${objectiveId} not found in quest ${questId}`;
        return;
      }
      
      const objective = quest.objectives[objectiveIndex];
      
      // If objective is already completed, do nothing
      if (objective.completed) {
        return;
      }
      
      // Update progress tracking
      if (!state.questProgress[questId]) {
        state.questProgress[questId] = {
          startedAt: Date.now(),
          objectiveProgress: {}
        };
      }
      
      const currentProgress = state.questProgress[questId].objectiveProgress[objectiveId] || 0;
      const newProgress = Math.min(objective.target, currentProgress + progress);
      state.questProgress[questId].objectiveProgress[objectiveId] = newProgress;
      
      // Update objective in quest
      state.quests[questId].objectives[objectiveIndex].current = newProgress;
      state.quests[questId].objectives[objectiveIndex].progress = 
        Math.floor((newProgress / objective.target) * 100);
      
      // Check if objective is completed
      if (newProgress >= objective.target) {
        state.quests[questId].objectives[objectiveIndex].completed = true;
        
        // Add log entry for objective completion
        state.questLog.push(createLogEntry(
          questId,
          `Objective completed: ${objective.description}`,
          'progress'
        ));
      }
      
      // Update overall quest progress
      state.quests[questId].progress = calculateQuestProgress(state.quests[questId]);
      
      // Check if all objectives are completed
      const allCompleted = state.quests[questId].objectives.every(obj => obj.completed);
      if (allCompleted) {
        // Quest is ready to be turned in, but we don't auto-complete it
        // The player needs to manually turn it in or a thunk will handle it
      }
    },
    
    /**
     * Track a quest (shows in HUD)
     */
    trackQuest(state, action: PayloadAction<TrackQuestPayload>) {
      const { questId } = action.payload;
      
      // If questId is null, we're untracking the current quest
      if (questId === null) {
        state.trackedQuestId = null;
        return;
      }
      
      // Otherwise, track the specified quest
      const quest = state.quests[questId];
      
      if (!quest) {
        state.error = `Quest with ID ${questId} not found`;
        return;
      }
      
      // If quest is not active, we can't track it
      if (!state.activeQuestIds.includes(questId)) {
        state.error = `Cannot track quest that is not active`;
        return;
      }
      
      state.trackedQuestId = questId;
    },
    
    /**
     * Select a quest (for UI)
     */
    selectQuest(state, action: PayloadAction<string | null>) {
      state.selectedQuestId = action.payload;
    },
    
    /**
     * Add a quest log entry
     */
    addQuestLogEntry(state, action: PayloadAction<AddQuestLogEntryPayload>) {
      const { questId, message, type } = action.payload;
      
      state.questLog.push(createLogEntry(questId, message, type));
    },
    
    /**
     * Mark quest log entries as read
     */
    markQuestLogEntriesAsRead(state, action: PayloadAction<string[]>) {
      const entryIds = action.payload;
      
      state.questLog = state.questLog.map(entry => 
        entryIds.includes(entry.id) ? { ...entry, read: true } : entry
      );
    },
    
    /**
     * Reset daily quests
     */
    resetDailyQuests(state) {
      // Get all daily quests
      const dailyQuestIds = Object.values(state.quests)
        .filter(quest => quest.type === 'daily')
        .map(quest => quest.id);
      
      // Reset completed daily quests to available
      const completedDailyQuestIds = state.completedQuestIds.filter(id => 
        dailyQuestIds.includes(id)
      );
      
      completedDailyQuestIds.forEach(id => {
        // Remove from completed
        state.completedQuestIds = state.completedQuestIds.filter(qid => qid !== id);
        
        // Add to available
        if (!state.availableQuestIds.includes(id)) {
          state.availableQuestIds.push(id);
        }
        
        // Reset status
        state.quests[id].status = QuestStatus.AVAILABLE;
        
        // Reset objectives
        state.quests[id].objectives = state.quests[id].objectives.map(obj => ({
          ...obj,
          current: 0,
          completed: false,
          progress: 0
        }));
      });
      
      // Set next daily reset time
      state.dailyReset = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    },
    
    /**
     * Reset weekly quests
     */
    resetWeeklyQuests(state) {
      // Get all weekly quests
      const weeklyQuestIds = Object.values(state.quests)
        .filter(quest => quest.type === 'weekly')
        .map(quest => quest.id);
      
      // Reset completed weekly quests to available
      const completedWeeklyQuestIds = state.completedQuestIds.filter(id => 
        weeklyQuestIds.includes(id)
      );
      
      completedWeeklyQuestIds.forEach(id => {
        // Remove from completed
        state.completedQuestIds = state.completedQuestIds.filter(qid => qid !== id);
        
        // Add to available
        if (!state.availableQuestIds.includes(id)) {
          state.availableQuestIds.push(id);
        }
        
        // Reset status
        state.quests[id].status = QuestStatus.AVAILABLE;
        
        // Reset objectives
        state.quests[id].objectives = state.quests[id].objectives.map(obj => ({
          ...obj,
          current: 0,
          completed: false,
          progress: 0
        }));
      });
      
      // Set next weekly reset time
      state.weeklyReset = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    },
    
    /**
     * Clear error
     */
    clearError(state) {
      state.error = null;
    },
    
    /**
     * Reset quests to initial state
     */
    resetQuests() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Handle startQuest thunk
    builder.addCase(startQuest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(startQuest.fulfilled, (state, action) => {
      state.isLoading = false;
      // Note: The main quest logic is handled in the reducer
    });
    builder.addCase(startQuest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to start quest';
    });
    
    // Handle completeQuest thunk
    builder.addCase(completeQuest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(completeQuest.fulfilled, (state, action) => {
      state.isLoading = false;
      // Note: The main quest logic is handled in the reducer
    });
    builder.addCase(completeQuest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to complete quest';
    });
    
    // Handle abandonQuest thunk
    builder.addCase(abandonQuest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(abandonQuest.fulfilled, (state, action) => {
      state.isLoading = false;
      // Note: The main quest logic is handled in the reducer
    });
    builder.addCase(abandonQuest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to abandon quest';
    });
    
    // Handle processQuestEvent thunk
    builder.addCase(processQuestEvent.fulfilled, (state, action) => {
      // This is handled in the thunk itself updating objectives
    });
    
    // Handle checkQuestRequirements thunk
    builder.addCase(checkQuestRequirements.fulfilled, (state, action) => {
      const { questId, allMet } = action.payload;
      
      // If requirements are met and quest is not available, make it available
      if (allMet && !state.availableQuestIds.includes(questId) && state.quests[questId]) {
        state.quests[questId].isAvailable = true;
        state.availableQuestIds.push(questId);
      }
    });
  }
});

// Export actions
export const {
  initializeQuests,
  addQuest,
  manuallyStartQuest,
  manuallyCompleteQuest,
  manuallyAbandonQuest,
  manuallyFailQuest,
  updateObjectiveProgress,
  trackQuest,
  selectQuest,
  addQuestLogEntry,
  markQuestLogEntriesAsRead,
  resetDailyQuests,
  resetWeeklyQuests,
  clearError,
  resetQuests
} = questsSlice.actions;

// Export reducer
export default questsSlice.reducer;
