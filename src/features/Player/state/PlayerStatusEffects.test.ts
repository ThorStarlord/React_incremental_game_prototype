import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { addStatusEffect } from './PlayerSlice';
import { processStatusEffectsThunk } from './PlayerThunks';

describe('status effect lifecycle', () => {
  test('decrements durations using logical time and removes expired effects', async () => {
    const store = configureStore({ reducer: rootReducer });
    store.dispatch(addStatusEffect({
      id: 'short-lived',
      name: 'Short-lived test effect',
      duration: 1.5,
    }));

    await store.dispatch(processStatusEffectsThunk(500));
    expect(store.getState().player.statusEffects[0].duration).toBeCloseTo(1);

    const result = await store.dispatch(processStatusEffectsThunk(1000));
    expect(result.payload).toEqual(['short-lived']);
    expect(store.getState().player.statusEffects).toHaveLength(0);
  });

  test('rejects invalid elapsed time without mutating effects', async () => {
    const store = configureStore({ reducer: rootReducer });
    store.dispatch(addStatusEffect({ id: 'stable', name: 'Stable test effect', duration: 5 }));

    await store.dispatch(processStatusEffectsThunk(0));
    await store.dispatch(processStatusEffectsThunk(Number.NaN));

    expect(store.getState().player.statusEffects[0].duration).toBe(5);
  });
});
