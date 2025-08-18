import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, RootState } from '../../../../app/store';
import { copyListeners } from '../CopyListeners';
import copyReducer, { shareTraitToCopy } from '../CopySlice';
import playerReducer, { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import notificationsReducer from '../../../../shared/state/NotificationSlice';

// Minimal reducer setup for the test using the actual reducers
const makeStore = () => configureStore({
  reducer: (state: any, action: any) => rootReducer(state, action),
  middleware: (gDM) => gDM().prepend(copyListeners.middleware),
});

describe('CopyListeners auto-unshare', () => {
  it('unshares a trait from copies when the player unequips it', () => {
    const store = makeStore();

    // Seed: equip a trait in player slot 0
    store.dispatch(equipTrait({ traitId: 'trait-test', slotIndex: 0 }));

    // Seed: add the same trait to a copy slot using the reducer directly
    // We need a copy id from initial state; use one from the slice's seeded state
    const stateBefore = store.getState() as RootState;
    const copyId = Object.keys(stateBefore.copy.copies)[0];
    store.dispatch(shareTraitToCopy({ copyId, slotIndex: 0, traitId: 'trait-test' }));

    // Sanity check preconditions
    let s = store.getState() as RootState;
    expect(s.player.traitSlots[0].traitId).toBe('trait-test');
    expect(s.copy.copies[copyId].traitSlots?.[0].traitId).toBe('trait-test');

    // Act: unequip the trait -> should trigger listener to unshare from copies
    store.dispatch(unequipTrait({ slotIndex: 0 }));

    s = store.getState() as RootState;
    expect(s.player.traitSlots[0].traitId).toBeNull();
    expect(s.copy.copies[copyId].traitSlots?.[0].traitId).toBeNull();
  });
});
