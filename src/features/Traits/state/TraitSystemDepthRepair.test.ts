import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { setResonanceLevel } from '../../Player/state/PlayerSlice';
import { loadTraits } from './TraitsSlice';
import { acquireTraitWithEssenceThunk } from './TraitThunks';
import { evaluateTraitResonanceReadiness } from './TraitResonanceReadiness';
import type { Trait } from './TraitsTypes';

const makeStore = () => configureStore({ reducer: rootReducer });

const SIMPLE_TRAIT: Trait = {
  id: 'DepthRepairProbe',
  name: 'Depth Repair Probe',
  description: 'Hermetic trait used to qualify resonance authority.',
  category: 'Knowledge',
  rarity: 'Common',
  effects: { attack: 1 },
  essenceCost: 40,
};

describe('Trait system depth repair', () => {
  test('Resonance Level automatically unlocks the player Trait slots it promises', () => {
    const store = makeStore();

    expect(store.getState().player.traitSlots.map(slot => slot.isLocked)).toEqual([
      false, true, true, true, true,
    ]);

    store.dispatch(setResonanceLevel(3));

    expect(store.getState().player.resonanceLevel).toBe(3);
    expect(store.getState().player.traitSlots.map(slot => slot.isLocked)).toEqual([
      false, false, false, true, true,
    ]);
  });

  test('shared readiness explains insufficient Essence and becomes ready when the catalog cost is met', () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [SIMPLE_TRAIT.id]: SIMPLE_TRAIT }));

    let readiness = evaluateTraitResonanceReadiness(store.getState(), SIMPLE_TRAIT.id);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockers).toContain('Essence 0 / 40.');

    store.dispatch(gainEssence({ amount: 40, source: 'test' }));
    readiness = evaluateTraitResonanceReadiness(store.getState(), SIMPLE_TRAIT.id);

    expect(readiness.ready).toBe(true);
    expect(readiness.blockers).toEqual([]);
  });

  test('callers cannot override the authoritative catalog Resonance cost', async () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [SIMPLE_TRAIT.id]: SIMPLE_TRAIT }));
    store.dispatch(gainEssence({ amount: 10, source: 'test' }));

    const rejected = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: SIMPLE_TRAIT.id, essenceCost: 0 })
    );

    expect(acquireTraitWithEssenceThunk.rejected.match(rejected)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(10);
    expect(store.getState().player.permanentTraits).not.toContain(SIMPLE_TRAIT.id);

    store.dispatch(gainEssence({ amount: 30, source: 'test' }));
    const fulfilled = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: SIMPLE_TRAIT.id, essenceCost: 0 })
    );

    expect(acquireTraitWithEssenceThunk.fulfilled.match(fulfilled)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(0);
    expect(store.getState().player.permanentTraits).toContain(SIMPLE_TRAIT.id);
  });
});
