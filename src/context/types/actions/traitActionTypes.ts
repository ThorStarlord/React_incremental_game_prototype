/**
 * Trait-related action type definitions
 * 
 * This module defines the types and interfaces for trait actions
 * in the game.
 * 
 * @module traitActionTypes
 */

import { TraitId } from '../gameStates/TraitsGameStateTypes';

/**
 * Trait action type constants
 */
export const TRAIT_ACTIONS = {
  DISCOVER_TRAIT: 'traits/discover' as const,
  UNLOCK_TRAIT: 'traits/unlock' as const,
  EQUIP_TRAIT: 'traits/equip' as const,
  UNEQUIP_TRAIT: 'traits/unequip' as const,
  ADD_TRAIT: 'traits/add' as const,
  REMOVE_TRAIT: 'traits/remove' as const,
  EVOLVE_TRAIT: 'traits/evolve' as const,
  INCREASE_TRAIT_AFFINITY: 'traits/increaseAffinity' as const,
  UNLOCK_TRAIT_SLOT: 'traits/unlockSlot' as const,
  ADD_TRAIT_POINTS: 'traits/addPoints' as const,
  SPEND_TRAIT_POINTS: 'traits/spendPoints' as const,
  UPDATE_TRAIT: 'traits/update' as const,
  UPGRADE_TRAIT: 'traits/upgrade' as const,
  TOGGLE_FAVORITE_TRAIT: 'traits/toggleFavorite' as const,
  IMPORT_TRAITS: 'traits/import' as const,
  RESET_TRAITS: 'traits/reset' as const
};

// Create a union type of all trait action types
export type TraitActionType = typeof TRAIT_ACTIONS[keyof typeof TRAIT_ACTIONS];

/**
 * Base trait action interface
 */
export interface TraitAction {
  type: TraitActionType;
  payload?: any;
}

/**
 * Typed trait action interfaces
 */
export type AddTraitAction = { type: typeof TRAIT_ACTIONS.ADD_TRAIT; payload: { traitId: TraitId } };
export type RemoveTraitAction = { type: typeof TRAIT_ACTIONS.REMOVE_TRAIT; payload: { traitId: TraitId } };
export type DiscoverTraitAction = { type: typeof TRAIT_ACTIONS.DISCOVER_TRAIT; payload: { traitId: TraitId } };
export type EquipTraitAction = { type: typeof TRAIT_ACTIONS.EQUIP_TRAIT; payload: { traitId: TraitId; slotIndex?: number } };
export type UnequipTraitAction = { type: typeof TRAIT_ACTIONS.UNEQUIP_TRAIT; payload: { traitId: TraitId } };
export type UnlockTraitSlotAction = { type: typeof TRAIT_ACTIONS.UNLOCK_TRAIT_SLOT; payload: { slotIndex: number } };
export type AddTraitPointsAction = { type: typeof TRAIT_ACTIONS.ADD_TRAIT_POINTS; payload: { amount: number } };
export type SpendTraitPointsAction = { type: typeof TRAIT_ACTIONS.SPEND_TRAIT_POINTS; payload: { traitId: TraitId; points: number } };
