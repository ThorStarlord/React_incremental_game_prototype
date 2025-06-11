/**
 * Type definitions for the GameLoop system
 */

/**
 * Core GameLoop state interface
 */
export interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  currentTick: number;
  tickRate: number; // Ticks per second
  lastUpdateTime: number;
  totalGameTime: number; // Total elapsed time in milliseconds
  gameSpeed: number; // Speed multiplier (0.1x to 5.0x)
  autoSaveInterval: number; // Auto-save frequency in milliseconds
  lastAutoSave: number; // Last auto-save timestamp
}

/**
 * Tick data interface for processing
 */
export interface TickData {
  deltaTime: number;
  currentTick: number;
  gameSpeed: number;
}

export interface GameLoopConfig {
  defaultTickRate: number;
  minSpeed: number;
  maxSpeed: number;
  defaultAutoSaveInterval: number;
}

export type GameLoopStatus = 'stopped' | 'running' | 'paused';

export interface GameSpeedPreset {
  name: string;
  multiplier: number;
  description: string;
}
