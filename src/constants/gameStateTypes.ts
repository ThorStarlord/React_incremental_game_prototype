import { CombatState, GameState } from '../context/initialStates/InitialStateComposer'; // Import base types

// Define specific interfaces for player and enemy in combat
export interface CombatPlayerState {
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  attack: number;
  defense: number;
  [key: string]: any; // For future expansion
}

export interface CombatEnemy {
  id: string; // IMPORTANT: Give enemies an ID
  name: string;
  level: number;
  currentHealth: number;
  maxHealth: number;
  attack: number;
  defense: number;
  imageUrl: string; // Or path to image
  experience: number; // XP reward
  gold: number;     // Gold reward
  [key: string]: any; // For future expansion
}

// Module Augmentation: Extending the GameState interface
declare module '../context/InitialState' {
  interface GameState { // We are *extending* the existing GameState
    combat?: CombatState & { // Add the combat property
      player: CombatPlayerState;
      enemy: CombatEnemy;
    };
  }
}

export {}; // Required for module augmentation
// If you need the types here, you can export them.
export type { CombatState, CombatPlayerState, CombatEnemy };
