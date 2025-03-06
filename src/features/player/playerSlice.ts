import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface representing the basic player stats
 */
interface PlayerStats {
  /** Player's current strength level */
  strength: number;
  /** Player's current dexterity level */
  dexterity: number;
  /** Player's current intelligence level */
  intelligence: number;
  /** Player's current vitality level */
  vitality: number;
}

/**
 * Interface representing player resources
 */
interface PlayerResources {
  /** Player's current amount of gold */
  gold: number;
  /** Player's current experience points */
  experience: number;
  /** Player's available skill points */
  skillPoints: number;
  /** Player's available trait slots */
  traitSlots: number;
}

/**
 * Interface representing player progression
 */
interface PlayerProgression {
  /** Player's current level */
  level: number;
  /** Experience required for next level */
  experienceToNextLevel: number;
  /** Areas unlocked by the player */
  unlockedAreas: string[];
  /** Skills unlocked by the player */
  unlockedSkills: string[];
}

/**
 * Interface for the player's state
 */
interface PlayerState {
  /** Player's display name */
  name: string;
  /** Player's stats */
  stats: PlayerStats;
  /** Player's resources */
  resources: PlayerResources;
  /** Player's progression */
  progression: PlayerProgression;
  /** Whether the player is in combat */
  inCombat: boolean;
  /** Additional player properties */
  [key: string]: any;
}

/**
 * Initial state for the player
 */
const InitialState: PlayerState = {
  name: 'Adventurer',
  stats: {
    strength: 5,
    dexterity: 5,
    intelligence: 5,
    vitality: 5
  },
  resources: {
    gold: 0,
    experience: 0,
    skillPoints: 0,
    traitSlots: 1
  },
  progression: {
    level: 1,
    experienceToNextLevel: 100,
    unlockedAreas: ['town'],
    unlockedSkills: []
  },
  inCombat: false
};

/**
 * Redux slice for player state management
 */
const playerSlice = createSlice({
  name: 'player',
  InitialState,
  reducers: {
    /**
     * Updates player's name
     */
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    
    /**
     * Increases a specific player stat
     */
    increasePlayerStat: (state, action: PayloadAction<{stat: keyof PlayerStats, amount: number}>) => {
      const { stat, amount } = action.payload;
      if (state.stats[stat] !== undefined) {
        state.stats[stat] += amount;
      }
    },
    
    /**
     * Adds experience to the player and handles level ups
     */
    addExperience: (state, action: PayloadAction<number>) => {
      const expToAdd = action.payload;
      state.resources.experience += expToAdd;
      
      // Handle level up logic
      while (state.resources.experience >= state.progression.experienceToNextLevel) {
        state.resources.experience -= state.progression.experienceToNextLevel;
        state.progression.level += 1;
        state.resources.skillPoints += 1;
        
        // Increase experience requirement for next level
        state.progression.experienceToNextLevel = Math.floor(
          state.progression.experienceToNextLevel * 1.2
        );
      }
    },
    
    /**
     * Updates player's gold amount
     */
    updateGold: (state, action: PayloadAction<{amount: number}>) => {
      state.resources.gold += action.payload.amount;
    },
    
    /**
     * Unlocks a new area for the player
     */
    unlockArea: (state, action: PayloadAction<string>) => {
      if (!state.progression.unlockedAreas.includes(action.payload)) {
        state.progression.unlockedAreas.push(action.payload);
      }
    },
    
    /**
     * Unlocks a new skill for the player
     */
    unlockSkill: (state, action: PayloadAction<string>) => {
      if (!state.progression.unlockedSkills.includes(action.payload)) {
        state.progression.unlockedSkills.push(action.payload);
      }
    },
    
    /**
     * Updates the player's combat status
     */
    setCombatStatus: (state, action: PayloadAction<boolean>) => {
      state.inCombat = action.payload;
    },
    
    /**
     * Updates trait slots
     */
    updateTraitSlots: (state, action: PayloadAction<number>) => {
      state.resources.traitSlots += action.payload;
    }
  }
});

// Export actions
export const { 
  setPlayerName, 
  increasePlayerStat, 
  addExperience,
  updateGold,
  unlockArea,
  unlockSkill,
  setCombatStatus,
  updateTraitSlots
} = playerSlice.actions;

// Export selectors
export const selectPlayer = (state: { player: PlayerState }) => state.player;
export const selectPlayerStats = (state: { player: PlayerState }) => state.player.stats;
export const selectPlayerResources = (state: { player: PlayerState }) => state.player.resources;
export const selectPlayerLevel = (state: { player: PlayerState }) => state.player.progression.level;

// Export reducer
export default playerSlice.reducer;
