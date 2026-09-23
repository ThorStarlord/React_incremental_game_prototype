/**
 * @file CopyListeners.ts
 * @description Listener middleware to keep Copy shared traits in sync with Player equipment.
 * When the player unequips a trait, automatically unshare it from all Copies that have it shared.
 */

import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { unequipTrait, equipTrait, addPermanentTrait } from '../../Player/state/PlayerSlice';
import {
  unshareTraitFromCopy,
  ensureCopyTraitSlots,
  unlockCopySlotsIfEligible,
  setCopySharePreference,
  ensureCopyAutomationState,
  markArchiveVerificationCaseVerified,
  recordCopyException,
  resolveCopyException,
  upsertArchiveVerificationCase,
} from './CopySlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { applySharePreferencesForCopyThunk } from './CopyThunks';
import { recordRelationshipExperience } from '../../Relationships/state/RelationshipSlice';

// Create a dedicated listener middleware instance for the Copy feature cross-slice sync.
export const copyListeners = createListenerMiddleware<RootState>();

// When unequipping a trait, unshare it from all copies that had it
copyListeners.startListening({
  actionCreator: unequipTrait,
  effect: async (action, api) => {
    // Read the traitId being unequipped from the original state BEFORE the reducer cleared it
    const originalState = api.getOriginalState();
    const slotIndex = action.payload.slotIndex;
    const traitId = originalState.player.traitSlots[slotIndex]?.traitId;
    if (!traitId) return; // nothing to do

    const stateAfter = api.getState();
    const copies = Object.values(stateAfter.copy.copies);
    let unsharedCount = 0;

    for (const copy of copies) {
      // Ensure slots exist for older saves
      if (!copy.traitSlots) {
        api.dispatch(ensureCopyTraitSlots({ copyId: copy.id }));
      }
      const slots = copy.traitSlots ?? [];
      for (const slot of slots) {
        if (slot.traitId === traitId) {
          api.dispatch(unshareTraitFromCopy({ copyId: copy.id, slotIndex: slot.slotIndex }));
          unsharedCount++;
        }
      }
    }

    if (unsharedCount > 0) {
      api.dispatch(addNotification({ type: 'info', message: `Unshared trait from ${unsharedCount} Copy slot(s) due to unequip.` }));
    }
  },
});

// When equipping a new trait into a slot that previously had a different one,
// unshare the replaced (old) trait from all copies.
copyListeners.startListening({
  actionCreator: equipTrait,
  effect: async (action, api) => {
    const originalState = api.getOriginalState();
    const { slotIndex, traitId: newTraitId } = action.payload;
    const prevTraitId = originalState.player.traitSlots[slotIndex]?.traitId;
    if (!prevTraitId || prevTraitId === newTraitId) return;

    const stateAfter = api.getState();
    const copies = Object.values(stateAfter.copy.copies);
    let unsharedCount = 0;
    for (const copy of copies) {
      if (!copy.traitSlots) {
        api.dispatch(ensureCopyTraitSlots({ copyId: copy.id }));
      }
      const slots = copy.traitSlots ?? [];
      for (const slot of slots) {
        if (slot.traitId === prevTraitId) {
          api.dispatch(unshareTraitFromCopy({ copyId: copy.id, slotIndex: slot.slotIndex }));
          unsharedCount++;
        }
      }
    }
    if (unsharedCount > 0) {
      api.dispatch(addNotification({ type: 'info', message: `Unshared replaced trait from ${unsharedCount} Copy slot(s).` }));
    }

    // Auto-apply preferences for the newly equipped trait where enabled
    const stateNow = api.getState();
    for (const copy of Object.values(stateNow.copy.copies)) {
      const prefs = copy.sharePreferences || {};
      if (prefs[newTraitId]) {
        // fire and forget
        api.dispatch(applySharePreferencesForCopyThunk(copy.id) as any);
      }
    }
  },
});

// When a trait is made permanent, it ceases to be shareable; unshare from all copies.
copyListeners.startListening({
  actionCreator: addPermanentTrait,
  effect: async (action, api) => {
    const { payload: traitId } = action;
    if (!traitId) return;
    const state = api.getState();
    const copies = Object.values(state.copy.copies);
    let unsharedCount = 0;
    const affected = new Set<string>();
    for (const copy of copies) {
      if (!copy.traitSlots) {
        api.dispatch(ensureCopyTraitSlots({ copyId: copy.id }));
      }
      for (const slot of copy.traitSlots ?? []) {
        if (slot.traitId === traitId) {
          api.dispatch(unshareTraitFromCopy({ copyId: copy.id, slotIndex: slot.slotIndex }));
          unsharedCount++;
          affected.add(copy.id);
        }
      }
    }
    if (unsharedCount > 0) {
      api.dispatch(addNotification({ type: 'info', message: `Unshared trait from ${unsharedCount} Copy slot(s) due to permanence.` }));
    }

    // Try to fill freed slots with other enabled preferences
    affected.forEach((copyId) => api.dispatch(applySharePreferencesForCopyThunk(copyId) as any));
  },
});

export default copyListeners;

// Reinitialize trait slots after a full state replace (load/import) for migration safety.
copyListeners.startListening({
  predicate: (action) => action.type === 'meta/replaceState',
  effect: async (action, api) => {
    api.dispatch(ensureCopyAutomationState());
    const state = api.getState();
    const copies = Object.values(state.copy.copies);
    for (const copy of copies) {
      if (!copy.traitSlots || !(copy as any).sharePreferences) {
        api.dispatch(ensureCopyTraitSlots({ copyId: copy.id }));
      }
    }
  },
});

// When copy slots may unlock, attempt to auto-apply share preferences to fill empties.
copyListeners.startListening({
  actionCreator: unlockCopySlotsIfEligible,
  effect: async (action, api) => {
    const { copyId } = action.payload;
    if (copyId) api.dispatch(applySharePreferencesForCopyThunk(copyId) as any);
  },
});

// When a share preference is enabled, attempt to apply immediately for that copy.
copyListeners.startListening({
  actionCreator: setCopySharePreference,
  effect: async (action, api) => {
    const { copyId, enabled } = action.payload;
    if (enabled) api.dispatch(applySharePreferencesForCopyThunk(copyId) as any);
  },
});


/**
 * Durable exception state is the authority; notifications are only the
 * immediate attention surface and are intentionally not persisted.
 */
copyListeners.startListening({
  actionCreator: recordCopyException,
  effect: async (action, api) => {
    const originalState = api.getOriginalState();
    if (originalState.copy.exceptionsById?.[action.payload.id]) return;

    const state = api.getState();
    const copy = state.copy.copies[action.payload.copyId];
    const copyName = copy?.name ?? 'A Copy';
    api.dispatch(addNotification({
      type: 'warning',
      message: `${copyName} paused Archive Verification: contradictory sources require your judgment.`,
    }));
  },
});

/**
 * Feed the first standing-order vertical slice from existing authored Campaign
 * One events. These cases represent procedural verification work only; they do
 * not replace Knowledge, Relationship, or World State authority.
 */
copyListeners.startListening({
  actionCreator: recordRelationshipExperience,
  effect: async (action, api) => {
    const tick = api.getState().gameLoop.currentTick;

    if (action.payload.id === 'elara_gc08_exp_network_diagnosis') {
      api.dispatch(upsertArchiveVerificationCase({
        id: 'archive_case_gc08_network_diagnosis',
        status: 'pending',
        classification: 'routine',
        sourceIds: [
          'fact_gc07_counterphase_principle',
          'elara_gc08_exp_network_diagnosis',
        ],
        createdAtTick: tick,
      }));
      return;
    }

    if (action.payload.id === 'elara_gc08_exp_diagnostic_preparation') {
      api.dispatch(upsertArchiveVerificationCase({
        id: 'archive_case_gc08_diagnostic_anomaly',
        status: 'pending',
        classification: 'source_contradiction',
        sourceIds: [
          'archive_source_gc08_lattice_pattern',
          'archive_source_gc08_counterphase_projection',
        ],
        createdAtTick: tick,
      }));
      return;
    }

    if (action.payload.id === 'lyra_gc08_exp_commit_diagnostic') {
      const state = api.getState();

      Object.values(state.copy.archiveVerificationCasesById ?? {})
        .filter(item =>
          item.classification === 'source_contradiction' &&
          item.status !== 'verified'
        )
        .forEach(item => {
          api.dispatch(markArchiveVerificationCaseVerified({ caseId: item.id }));
        });

      Object.values(state.copy.exceptionsById ?? {})
        .filter(exception =>
          exception.routineId === 'archive_verification' &&
          exception.status !== 'resolved'
        )
        .forEach(exception => {
          api.dispatch(resolveCopyException({
            exceptionId: exception.id,
            tick,
            action: 'player_resolved',
          }));
        });
    }
  },
});
