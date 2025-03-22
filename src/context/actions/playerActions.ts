/**
 * Player Actions
 * ==============
 * 
 * This file provides backward compatibility for the modularized player actions system.
 * It re-exports all player action creators from the new modular structure.
 * 
 * For new code, prefer importing directly from the modular structure:
 * import { modifyHealth, equipTrait } from '../context/actions/player';
 * 
 * @module playerActions
 * @deprecated Use the modular imports from '../context/actions/player' instead
 */

// Re-export everything from the modular player actions
export * from './player';
